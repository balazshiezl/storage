import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/index.js'

class InventoryItem extends Model {}

InventoryItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.TEXT },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.STRING, defaultValue: 'db' },
    min_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    expiration_date: { type: DataTypes.DATEONLY },
    manufacture_date: { type: DataTypes.DATEONLY },
    image_path: { type: DataTypes.TEXT },
    location: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    modelName: 'inventory_items_new',
    tableName: 'inventory_items_new',
    timestamps: true,
    underscored: true,
  }
)

export default InventoryItem
