import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/index.js'

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nev: { type: DataTypes.STRING(120), allowNull: false }, // teljes név
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
    jelszo_hash: { type: DataTypes.STRING(100), allowNull: false },
    szerep: { type: DataTypes.ENUM('admin', 'felhasznalo'), defaultValue: 'felhasznalo' },
    aktiv: { type: DataTypes.BOOLEAN, defaultValue: true },

        // 🔽 új mezők elfelejtett jelszóhoz
    reset_token_hash: { type: DataTypes.STRING(64), allowNull: true },
    reset_token_lejar: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'users_new', // a te DB-névkonvenciódhoz igazítva
    tableName: 'users_new',
    timestamps: true,
    underscored: true,
  }
)

export default User
