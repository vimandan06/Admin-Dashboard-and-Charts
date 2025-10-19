const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');

class Sale extends Model {}

Sale.init({
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false }
}, { sequelize, modelName: 'Sale', tableName: 'sales', timestamps: true });

Sale.belongsTo(User, { as: 'staff', foreignKey: 'staffId' });
Sale.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Sale;
