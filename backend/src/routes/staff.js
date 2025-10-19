const express = require('express');
const User = require('../models/User');
const { authMiddleware, isAdmin } = require('../middleware/auth'); // ✅ correct import
const router = express.Router();

// ✅ Only admin can access staff list
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const staff = await User.findAll({
      attributes: ['id', 'username', 'name', 'email', 'role', 'phone', 'createdAt']
    });
    res.json(staff);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
