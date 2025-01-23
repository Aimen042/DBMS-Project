const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve success
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/restaurantData.html'));
});

// Retrieving Data
const connectToDatabase = require('../config/dbconfig');
const { type } = require('os');
const { json } = require('stream/consumers');

router.get('/restaurant-tables', async (req, res) => {
  console.log('Request URL:', req.originalUrl);  // Log the URL being accessed
  try {
      const connection = await connectToDatabase();
      const result = await connection.query('SELECT * FROM Restaurant');
      console.log(result); // Log the result to verify the data
      res.json(result); // Send the retrieved data as JSON
  } catch (err) {
      console.error('Error fetching restaurant data:', err);
      res.status(500).send('Internal Server Error');
  }
});

// Delete restaurant and associated menus
router.delete('/restaurant-tables/:id', async (req, res) => {
  const restaurantId = req.params.id;
  console.log('Delete Request for Restaurant ID:', restaurantId); // Log the restaurant ID

  const connection = await connectToDatabase();
  try {
    await connection.beginTransaction();

    const deleteOrderItemsQuery = await connection.query('DELETE FROM OrderItems WHERE RestaurantID = ?', [restaurantId]);

    if(deleteOrderItemsQuery){
    const deleteMenuQuery = await connection.query('DELETE FROM Menu WHERE RestaurantID = ?', [restaurantId]);
    console.log(deleteMenuQuery);
    
    if(deleteMenuQuery){
      await connection.query('DELETE FROM Restaurant WHERE RestaurantID = ?', [restaurantId]);
    }
  }

    await connection.commit();

    console.log(`Restaurant with ID ${restaurantId} and its associated menu deleted successfully.`);
    res.status(200).json({ message: `Restaurant with ID ${restaurantId} deleted` });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting restaurant and associated menus:', err);
    res.status(500).json({ message: 'Error deleting restaurant and its menus', error: err });
  }
});

// Add a new restaurant to the database
router.post('/restaurant-tables', async (req, res) => {
  const { Name, Description, Address, PhoneNumber, CuisineType, Rating, OpeningTime, ClosingTime } = req.body;
  console.log(req.body);

  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}Z`); // Assuming the input is in HH:MM:SS format
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.0000000`; // No "Z" and 7 zeros after seconds
  };
  
  // Converting opening and closing times
  const formattedOpeningTime = formatTime(OpeningTime);
  const formattedClosingTime = formatTime(ClosingTime);
  
  console.log(formattedOpeningTime); // "10:00:00.0000000"
  console.log(formattedClosingTime); // "22:00:00.0000000"
  console.log(formattedClosingTime,formattedOpeningTime);
  
  if (!Name || !Description || !Address || !PhoneNumber || !CuisineType || !Rating || !OpeningTime || !ClosingTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const connection = await connectToDatabase();

    const restaurantQuery = `
    INSERT INTO Restaurant (Name, Description, Address, PhoneNumber, CuisineType,Rating  ,OpeningTime, ClosingTime) VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;
    
    const result = await connection.query(
      restaurantQuery,
      [Name, Description, Address, PhoneNumber, CuisineType,Rating,  formattedOpeningTime, formattedClosingTime]
    );

   // Send the newly created restaurant data with the ID
  
    res.status(200);
    res.json(result);
    console.log('Data', result);

    // res.status(201).json(newRestaurant); // Send the newly added restaurant as a response
  } catch (err) {
    console.error('Error adding restaurant:', err);
    res.status(500).json({ message: 'Error adding restaurant', error: err });
  }
});


//Update request
router.put('/restaurant-tables/:id', async (req, res) => {
  const restaurantId = req.params.id; // Extract the restaurant ID from the URL
  const { Name, Description, Address, PhoneNumber, CuisineType, Rating, OpeningTime, ClosingTime } = req.body;

  // Validate all required fields
  if (!Name || !Description || !Address || !PhoneNumber || !CuisineType || !Rating || !OpeningTime || !ClosingTime) {
    return res.status(400).json({ message: 'All fields are required for updating the restaurant' });
  }

  // Format time fields to match the database format
  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}Z`);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.0000000`;
  };

  const formattedOpeningTime = formatTime(OpeningTime);
  const formattedClosingTime = formatTime(ClosingTime);

  try {
    const connection = await connectToDatabase();

    // SQL query to update the restaurant
    const updateQuery = `
      UPDATE Restaurant
      SET Name = ?, Description = ?, Address = ?, PhoneNumber = ?, CuisineType = ?, Rating = ?, OpeningTime = ?, ClosingTime = ?
      WHERE RestaurantID = ?
    `;

    const result = await connection.query(updateQuery, [
      Name,
      Description,
      Address,
      PhoneNumber,
      CuisineType,
      Rating,
      formattedOpeningTime,
      formattedClosingTime,
      restaurantId,
    ]);

    console.log(`Restaurant with ID ${restaurantId} updated successfully.`);
    res.status(200).json({ message: `Restaurant with ID ${restaurantId} updated successfully`, result });
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(500).json({ message: 'Error updating restaurant', error: err });
  }
});



module.exports = router;




