const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Product extends Model {}

Product.init({
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
}, { sequelize, modelName: 'Product', tableName: 'products', timestamps: true });

module.exports = Product;
