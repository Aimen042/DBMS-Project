const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve success
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/menuData.html'));
});

// Retrieving Data
const connectToDatabase = require('../config/dbconfig');

router.get('/menu-tables', async (req, res) => {
  console.log('Request URL:', req.originalUrl);  // Log the URL being accessed
  try {
      const connection = await connectToDatabase();
      const result = await connection.query('SELECT * FROM Menu');
      console.log(result); // Log the result to verify the data
      res.json(result); // Send the retrieved data as JSON
  } catch (err) {
      console.error('Error fetching menu data:', err);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;