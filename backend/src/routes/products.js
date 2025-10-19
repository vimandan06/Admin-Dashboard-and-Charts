const express = require('express');
const { createProduct, listProducts } = require('../controllers/productController');
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const router = express.Router();

router.get('/', listProducts);
router.post('/', authMiddleware, requireRole('admin'), createProduct);

module.exports = router;
