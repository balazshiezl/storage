import { Sequelize } from 'sequelize'
import 'dotenv/config'

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
})
export async function kapcsolodjAdatbazishoz() {
  try {
    await sequelize.authenticate()
    await sequelize.sync() // fejlesztéshez jó; prodban migrációt javasolt használni
    console.log('✅ Adatbázis kapcsolat OK')
  } catch (err) {
    console.error('❌ Adatbázis hiba:', err)
    process.exit(1)
  }
}
