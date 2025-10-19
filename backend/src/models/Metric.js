const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Metric extends Model {}

Metric.init({
  name: { type: DataTypes.STRING(64), allowNull: false },
  value: { type: DataTypes.FLOAT, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  meta: { type: DataTypes.JSON, allowNull: true }
}, { sequelize, modelName: 'Metric', tableName: 'metrics', timestamps: false });

module.exports = Metric;
