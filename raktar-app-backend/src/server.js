import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import sequelize from './db/index.js'
import './models/User.js'
import InventoryItem from './models/InventoryItem.js'
import authRoutes from './routes/authRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import path from 'path'



const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))
app.use(express.json())

// statikus kiszolgálás a feltöltött képekhez
const uploadsPath = path.resolve('uploads')
app.use('/uploads', express.static(uploadsPath))

app.use('/api/auth', authRoutes)
app.use('/api/items', inventoryRoutes)

const port = process.env.PORT || 4000

async function start() {
  try {
    await sequelize.authenticate()
    // FIGYELEM: élesben NE alter-ezz minden indításkor.
    // Fejlesztésnél egyszer bekapcsolhatod:
    // await sequelize.sync({ alter: true })
    await sequelize.sync()
    app.listen(port, () => console.log(`API fut: http://localhost:${port}`))
  } catch (e) {
    console.error('DB vagy szerver indítási hiba:', e)
    process.exit(1)
  }
}
start()
