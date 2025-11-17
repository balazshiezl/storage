// src/routes/inventoryRoutes.js
import { Router } from 'express'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import InventoryItem from '../models/InventoryItem.js'
import { authKotelezett } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'

const router = Router()

function getWarehouseId(req) {
  // Elsődleges: header (stabil minden HTTP metódus alatt)
  const fromHeader = req.headers?.['x-warehouse-id']

  // Tartalék: query vagy body (ha mégis így küldöd)
  const fromQuery = req.query?.warehouseId
  const fromBody  = req.body?.warehouseId

  const raw = fromHeader ?? fromQuery ?? fromBody
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}


// LISTA + keresés/szűrés + lapozás
router.get('/', authKotelezett, async (req, res) => {
  try {
    const warehouseId = getWarehouseId(req)
    if (!warehouseId) return res.status(400).json({ uzenet: 'warehouseId hiányzik' })

    const { q, category, exp_before, page = 1, limit = 12 } = req.query
    const where = { warehouse_id: warehouseId }

    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { category: { [Op.iLike]: `%${q}%` } },
        { location: { [Op.iLike]: `%${q}%` } },
      ]
    }
    if (category) where.category = category
    if (exp_before) where.expiration_date = { [Op.lte]: exp_before }

    const offset = (Number(page) - 1) * Number(limit)
    const { rows, count } = await InventoryItem.findAndCountAll({
      where,
      order: [['updated_at', 'DESC']],
      offset,
      limit: Number(limit),
    })

    res.json({
      items: rows,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a lista lekérésekor' })
  }
})

// EGY TÉTEL (csak a saját raktárból engedjük)
router.get('/:id', authKotelezett, async (req, res) => {
  try {
    const warehouseId = getWarehouseId(req)
    if (!warehouseId) return res.status(400).json({ uzenet: 'warehouseId hiányzik' })

    const item = await InventoryItem.findByPk(req.params.id)
    if (!item || item.warehouse_id !== warehouseId) {
      return res.status(404).json({ uzenet: 'Nem található' })
    }
    res.json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba' })
  }
})

// LÉTREHOZÁS (kép opcionális, form-data)
router.post('/', authKotelezett, upload.single('image'), async (req, res) => {
  try {
    const warehouseId = getWarehouseId(req)
    if (!warehouseId) return res.status(400).json({ uzenet: 'warehouseId hiányzik' })

    const {
      name, description, category, quantity, unit, min_quantity,
      expiration_date, manufacture_date, location,
    } = req.body

    const image_path = req.file ? `/uploads/${req.file.filename}` : null

    const uj = await InventoryItem.create({
      name,
      description,
      category,
      quantity: quantity ? Number(quantity) : 0,
      unit: unit || 'db',
      min_quantity: min_quantity ? Number(min_quantity) : 0,
      expiration_date: expiration_date || null,
      manufacture_date: manufacture_date || null,
      image_path,
      location,
      warehouse_id: warehouseId,              // ⬅ kötelező
      created_by: req.felhasznalo.id,
      updated_by: req.felhasznalo.id,
      updated_at: dayjs().toDate(),
    })
    res.status(201).json(uj)
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a létrehozáskor' })
  }
})

// MÓDOSÍTÁS (kép cseréje opcionális) – csak saját raktárban
router.put('/:id', authKotelezett, upload.single('image'), async (req, res) => {
  try {
    const warehouseId = getWarehouseId(req)
    if (!warehouseId) return res.status(400).json({ uzenet: 'warehouseId hiányzik' })

    const item = await InventoryItem.findByPk(req.params.id)
    if (!item || item.warehouse_id !== warehouseId) {
      return res.status(404).json({ uzenet: 'Nem található' })
    }

    const patch = { ...req.body }
    if (patch.quantity !== undefined) patch.quantity = Number(patch.quantity)
    if (patch.min_quantity !== undefined) patch.min_quantity = Number(patch.min_quantity)
    if (req.file) patch.image_path = `/uploads/${req.file.filename}`

    // Biztonság: ne lehessen átrakni másik raktárba
    delete patch.warehouse_id
    delete patch.warehouseId

    patch.updated_by = req.felhasznalo.id
    patch.updated_at = dayjs().toDate()

    await item.update(patch)
    res.json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a módosításkor' })
  }
})

// DARABSZÁM NÖVELÉS/CSÖKKENTÉS – csak saját raktárban
router.patch('/:id/increment', authKotelezett, async (req, res) => {
  try {
    const warehouseId = getWarehouseId(req)
    if (!warehouseId) return res.status(400).json({ uzenet: 'warehouseId hiányzik' })

    const { amount } = req.body // lehet negatív is
    const item = await InventoryItem.findByPk(req.params.id)
    if (!item || item.warehouse_id !== warehouseId) {
      return res.status(404).json({ uzenet: 'Nem található' })
    }

    const ujMenny = (item.quantity || 0) + Number(amount || 0)
    await item.update({
      quantity: ujMenny < 0 ? 0 : ujMenny,
      updated_by: req.felhasznalo.id,
      updated_at: new Date(),
    })
    res.json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a darabszám módosításakor' })
  }
})

// TÖRLÉS – csak saját raktárban
router.delete('/:id', authKotelezett, async (req, res) => {
  try {
    const warehouseId = getWarehouseId(req)
    if (!warehouseId) return res.status(400).json({ uzenet: 'warehouseId hiányzik' })

    const item = await InventoryItem.findByPk(req.params.id)
    if (!item || item.warehouse_id !== warehouseId) {
      return res.status(404).json({ uzenet: 'Nem található' })
    }
    await item.destroy()
    res.json({ uzenet: 'Törölve' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a törléskor' })
  }
})

export default router
