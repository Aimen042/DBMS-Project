const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve success
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/riderData.html'));
});

// Retrieving Data
const connectToDatabase = require('../config/dbconfig');

router.get('/rider-tables', async (req, res) => {
  console.log('Request URL:', req.originalUrl);  // Log the URL being accessed
  try {
      const connection = await connectToDatabase();
      const result = await connection.query('SELECT * FROM DeliveryAgent');
      console.log(result); // Log the result to verify the data
      res.json(result); // Send the retrieved data as JSON
  } catch (err) {
      console.error('Error fetching restaurant data:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.delete('/rider-tables/:id', async (req, res) => {
  const AgentId = req.params.id;
  console.log('Delete Request for Agent ID:', AgentId); // Log the Agent ID

  try {
    const connection = await connectToDatabase();
    await connection.beginTransaction();
    await connection.query('DELETE FROM DeliveryAgent WHERE AgentID = ?', [AgentId]);

    await connection.commit();

    console.log(`Rider with ID ${AgentId} deleted successfully.`);
    res.status(200).json({ message: `Rider with ID ${AgentId} deleted` });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting rider', err);
    res.status(500).json({ message: 'Error deleting rider', error: err });
  } finally {
    connection.end();
  }
});

module.exports = router;