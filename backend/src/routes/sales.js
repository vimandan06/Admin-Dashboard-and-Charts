const express = require('express');
const { authMiddleware, isStaff } = require('../middleware/auth');
const Sale = require('../models/Sale');
const Product = require('../models/Product'); // import product

const router = express.Router();

// Staff can create a sale
router.post('/', authMiddleware, isStaff, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const staffId = req.user.id;

    if (!productId || !quantity)
      return res.status(400).json({ message: 'Missing product or quantity' });

    // fetch product to calculate totalPrice
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const totalPrice = product.price * Number(quantity);

    const sale = await Sale.create({
      staffId,
      productId,
      quantity,
      totalPrice,   // set totalPrice
      date: new Date()
    });

    res.json(sale);
  } catch (err) {
    console.error('Error creating sale:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
