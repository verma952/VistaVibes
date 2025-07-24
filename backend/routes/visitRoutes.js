const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

// Increment visit count
router.post('/', async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count += 1;
    }
    await visit.save();
    res.status(200).json({ count: visit.count });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get current visit count
router.get('/', async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.status(200).json({ count: visit ? visit.count : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
