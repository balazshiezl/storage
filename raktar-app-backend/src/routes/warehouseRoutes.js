// src/routes/warehouseRoutes.js
import express from "express"
import bcrypt from "bcrypt"
import Warehouse from "../models/Warehouse.js"

const router = express.Router()

// 🔹 Raktár belépés
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body
    const warehouse = await Warehouse.findOne({ where: { name } })
    if (!warehouse) return res.status(404).json({ message: "Nincs ilyen raktár" })

    const valid = await bcrypt.compare(password, warehouse.password)
    if (!valid) return res.status(401).json({ message: "Hibás jelszó" })

    res.json({ warehouseId: warehouse.id })
  } catch (e) {
    console.error("Warehouse login error:", e)
    res.status(500).json({ message: "Szerverhiba a belépéskor" })
  }
})

// 🔹 Új raktár létrehozása
router.post("/create", async (req, res) => {
  try {
    const { name, password } = req.body
    const existing = await Warehouse.findOne({ where: { name } })
    if (existing) return res.status(400).json({ message: "Már létezik ilyen raktár" })

    const newWarehouse = await Warehouse.create({ name, password })
    res.status(201).json({ id: newWarehouse.id, name: newWarehouse.name })
  } catch (e) {
    console.error("Warehouse create error:", e)
    res.status(500).json({ message: "Hiba a raktár létrehozásakor" })
  }
})

export default router
