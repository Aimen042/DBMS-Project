const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve success
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/mcdonalds.html'));
});

module.exports = router;
