const express = require('express');
const router = express.Router();
exports.router = router;
const path = require('path');
const connectToDatabase = require('../config/dbconfig');

// Route to serve login-form.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login-form.html'));
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Connect to the database
      const connection = await connectToDatabase();

      // Query the R_User table for matching email and password
      const query = `
      SELECT UserID, Name,Address,PhoneNo 
      FROM R_User 
      WHERE Email = ? AND Password = ?
    `;
      const resultSet = await connection.query(query, [email, password]);

      if (resultSet.length > 0) {
        
          req.session.UserID = resultSet[0].UserID;
          req.session.Name = resultSet[0].Name;
          req.session.Address = resultSet[0].Address;
          req.session.PhoneNo = resultSet[0].PhoneNo;

          console.log(req.session);
          console.log('user logged in successfully...');
          res.status(200).redirect('/success');
          
      } else {
          // If no match, display an error message
          res.status(401).redirect('/failure');
      }
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('<h1>An error occurred during login. Please try again later.</h1>');
  }
});


module.exports = router;
