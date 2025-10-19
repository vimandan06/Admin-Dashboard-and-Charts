const express = require('express');
const { getTimeSeries, getKPIs } = require('../controllers/analyticsController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
router.get('/timeseries', authMiddleware, getTimeSeries);
router.get('/kpis', authMiddleware, getKPIs);
module.exports = router;
