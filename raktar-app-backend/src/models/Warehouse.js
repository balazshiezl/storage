// src/models/Warehouse.js
import { DataTypes } from "sequelize"
import bcrypt from "bcrypt"
import sequelize from "../db/index.js"

const Warehouse = sequelize.define("warehouse", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: false,    // ✅ ne keresse a createdAt / updatedAt mezőket
})

// Hash jelszó mentés előtt
Warehouse.beforeCreate(async (warehouse) => {
  warehouse.password = await bcrypt.hash(warehouse.password, 10)
})

export default Warehouse
