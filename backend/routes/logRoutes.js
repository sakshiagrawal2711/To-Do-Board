const express = require('express');
const router = express.Router();
const Action = require('../models/Action');

// GET /api/logs
router.get('/', async (req, res) => {
  try {
    const logs = await Action.find()
      .populate('user', 'username')
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch logs' });
  }
});

module.exports = router;
