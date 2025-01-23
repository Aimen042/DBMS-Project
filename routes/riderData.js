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


// Add a new rider to the database
router.post('/rider-tables', async (req, res) => {
  const { Name, PhoneNumber, Status, Email, JoiningDate, VehicleDetails } = req.body;

  // Validate required fields
  if (!Name || !PhoneNumber || !Status || !Email || !JoiningDate || !VehicleDetails) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const connection = await connectToDatabase();

    // SQL query to insert a new rider
    const riderQuery = `
      INSERT INTO DeliveryAgent (Name, PhoneNumber, Status, Email, JoiningDate, VehicleDetails)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    const result = await connection.query(riderQuery, [
      Name,
      PhoneNumber,
      Status,
      Email,
      JoiningDate,
      VehicleDetails,
    ]);

    console.log('Rider added successfully:', result);

    // Send a success response
    res.status(201).json({ message: 'Rider added successfully', data: result });
  } catch (err) {
    console.error('Error adding rider:', err);
    res.status(500).json({ message: 'Error adding rider', error: err });
  }
});



//delete endpoint
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
  } 
});


// Update endpoint
router.put('/rider-tables/:id', async (req, res) => {
  const AgentId = req.params.id;
  const { Name, PhoneNumber, Status, Email, JoiningDate, VehicleDetails } = req.body;

  console.log('Update request received');
  console.log('AgentID:', AgentId);
  console.log('Request body:', req.body);

  if (!Name || !PhoneNumber || !Status || !Email || !JoiningDate || !VehicleDetails) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const connection = await connectToDatabase();
    const updateQuery = `
      UPDATE DeliveryAgent
      SET 
        Name = ?,
        PhoneNumber = ?,
        Status = ?,
        Email = ?,
        JoiningDate = ?,
        VehicleDetails = ?
      WHERE AgentID = ?
    `;
    const result = await connection.query(updateQuery, [
      Name,
      PhoneNumber,
      Status,
      Email,
      JoiningDate,
      VehicleDetails,
      AgentId,
    ]);

    console.log('Update query executed:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `No rider found with ID ${AgentId}` });
    }

    res.status(200).json({ message: `Rider with ID ${AgentId} updated successfully` });
  } catch (err) {
    console.error('Error updating rider:', err);
    res.status(500).json({ message: 'Error updating rider', error: err });
  }
});


module.exports = router;