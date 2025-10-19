const { Sequelize, Op } = require('sequelize');
const Metric = require('../models/Metric');
const User = require('../models/User');

exports.getTimeSeries = async (req, res) => {
  try {
    const period = req.query.period || '30d';
    const days = parseInt(String(period).replace('d','')) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const results = await Metric.findAll({
      attributes: [
        'name',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%Y-%m-%d'), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('value')), 'value']
      ],
      where: { timestamp: { [Op.gte]: since } },
      group: ['name', Sequelize.fn('DATE_FORMAT', Sequelize.col('timestamp'), '%Y-%m-%d')],
      order: [[Sequelize.literal('date'), 'ASC']],
      raw: true
    });

    const series = { users: [], sales: [], conversions: [] };
    results.forEach(r => { if (series[r.name]) series[r.name].push({ date: r.date, value: Number(r.value) }); });

    res.json({ status: 'success', data: series });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.getKPIs = async (req, res) => {
  try {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);

    const totalMetrics = await Metric.findAll({ attributes: ['name', [Sequelize.fn('SUM', Sequelize.col('value')), 'total']], group: ['name'], raw: true });
    const todayMetrics = await Metric.findAll({ attributes: ['name', [Sequelize.fn('SUM', Sequelize.col('value')), 'total']], where: { timestamp: { [Op.gte]: todayStart } }, group: ['name'], raw: true });

    // count users directly
    const totalUsersCount = await User.count();
    const newUsersToday = await User.count({ where: { createdAt: { [Op.gte]: todayStart } } });

    const formatMetrics = (metrics) => {
      const map = {};
      metrics.forEach(m => {
        if (m.name === 'users') map.totalUsers = Number(m.total);
        if (m.name === 'sales') map.sales = Number(m.total);
        if (m.name === 'conversions') map.newUsers = Number(m.total);
      });
      return map;
    };

    const total = formatMetrics(totalMetrics);
    // override totalUsers to actual user count
    total.totalUsers = totalUsersCount;

    const today = formatMetrics(todayMetrics);
    today.newUsers = newUsersToday;

    res.json({ status: 'success', data: { total, today } });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};
