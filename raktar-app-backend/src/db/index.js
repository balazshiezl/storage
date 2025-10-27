import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NEVE,
  process.env.DB_FELHASZNALO,
  process.env.DB_JELSZO,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
)

export default sequelize
