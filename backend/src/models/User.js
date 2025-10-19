const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
  // choose "username" for consistency with other code; store friendly name in 'name'
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin','staff'), allowNull: false, defaultValue: 'staff' },
  phone: { type: DataTypes.STRING, allowNull: true },
  otp: { type: DataTypes.STRING, allowNull: true },
  otpExpires: { type: DataTypes.DATE, allowNull: true }
}, { sequelize, modelName: 'User', tableName: 'users', timestamps: true });

module.exports = User;
