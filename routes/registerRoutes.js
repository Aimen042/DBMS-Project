const express = require('express');
const router = express.Router();
const connectToDatabase = require('../config/dbconfig');

// POST route for user registration
router.post('/', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // Connect to the database
    const connection = await connectToDatabase();

    // Prepare the stored procedure call
    const query = `
      EXEC AddNewUser 
        @Name = '${name}', 
        @Email = '${email}', 
        @Password = '${password}', 
        @PhoneNo = '${phone}', 
        @Address = '${address}'
    `;
    await connection.query(query);

    // Query the database to retrieve the inserted user details
    const fetchUserQuery = `
      SELECT UserID, Name, Address, PhoneNo 
      FROM R_User 
      WHERE Email = ? AND Password = ?
    `;
    const resultSet = await connection.query(fetchUserQuery, [email, password]);

    if (resultSet.length > 0) {
      // Save user details in the session
      req.session.UserID = resultSet[0].UserID;
      req.session.Name = resultSet[0].Name;
      req.session.Address = resultSet[0].Address;
      req.session.PhoneNo = resultSet[0].PhoneNo;

      console.log('User registered and session set:');
      console.log(req.session);

      // Redirect or send success response
      res.status(200).redirect('/success'); // Redirect to a success page
    } else {
      // If fetching user fails, send an error response
      res.status(500).send('User registration successful, but failed to set session.');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Failed to register user.');
  }
});

module.exports = router;
