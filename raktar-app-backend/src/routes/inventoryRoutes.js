import { Router } from 'express'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import InventoryItem from '../models/InventoryItem.js'
import { authKotelezett } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'

const router = Router()

// LISTA + keresés/szűrés + lapozás
router.get('/', authKotelezett, async (req, res) => {
  try {
    const { q, category, exp_before, page = 1, limit = 12 } = req.query
    const where = {}
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

    res.json({ items: rows, total: count, page: Number(page), pages: Math.ceil(count / Number(limit)) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a lista lekérésekor' })
  }
})

// EGY TÉTEL
router.get('/:id', authKotelezett, async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ uzenet: 'Nem található' })
    res.json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba' })
  }
})

// LÉTREHOZÁS (kép opcionális, form-data)
router.post('/', authKotelezett, upload.single('image'), async (req, res) => {
  try {
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

// MÓDOSÍTÁS (kép cseréje opcionális)
router.put('/:id', authKotelezett, upload.single('image'), async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ uzenet: 'Nem található' })

    const patch = { ...req.body }
    if (patch.quantity !== undefined) patch.quantity = Number(patch.quantity)
    if (patch.min_quantity !== undefined) patch.min_quantity = Number(patch.min_quantity)
    if (req.file) patch.image_path = `/uploads/${req.file.filename}`

    patch.updated_by = req.felhasznalo.id
    patch.updated_at = dayjs().toDate()

    await item.update(patch)
    res.json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a módosításkor' })
  }
})

// DARABSZÁM NÖVELÉS/CSÖKKENTÉS
router.patch('/:id/increment', authKotelezett, async (req, res) => {
  try {
    const { amount } = req.body // lehet negatív is
    const item = await InventoryItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ uzenet: 'Nem található' })

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

// TÖRLÉS
router.delete('/:id', authKotelezett, async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ uzenet: 'Nem található' })
    await item.destroy()
    res.json({ uzenet: 'Törölve' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ uzenet: 'Szerverhiba a törléskor' })
  }
})

export default router
