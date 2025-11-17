// src/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import sequelize from './db/index.js'
import './models/User.js'
import InventoryItem from './models/InventoryItem.js'
import authRoutes from './routes/authRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import warehouseRoutes from './routes/warehouseRoutes.js'
import path from 'path'

const app = express()

// 🔹 CORS beállítás – dinamikus engedélyezés localhost + Cloudflare tunnel esetén
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // pl. Postman vagy backendről hívás
    if (
      origin.includes('localhost') ||
      origin.includes('trycloudflare.com')
    ) {
      return callback(null, true)
    }
    console.warn('❌ Tiltott CORS eredet:', origin)
    return callback(new Error('CORS tiltva'))
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-warehouse-id'],
}))

app.use(express.json())

// 🔹 statikus kiszolgálás a feltöltött képekhez
const uploadsPath = path.resolve('uploads')
app.use('/uploads', express.static(uploadsPath))

// 🔹 route-ok
app.use('/api/auth', authRoutes)
app.use('/api/items', inventoryRoutes)
app.use('/api/warehouse', warehouseRoutes)

const port = process.env.PORT || 4000

// 🔹 adatbázis + szerver indítás
async function start() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(port, () =>
      console.log(`✅ API fut: http://localhost:${port}`)
    )
  } catch (e) {
    console.error('❌ DB vagy szerver indítási hiba:', e)
    process.exit(1)
  }
}

start()
