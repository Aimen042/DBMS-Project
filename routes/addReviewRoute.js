const express = require('express');
const router = express.Router();
const connectToDatabase = require('../config/dbconfig');


router.use(express.json());

router.post('/:restaurantName/rating/:rating/review/:review', async (req, res) => {
    const restaurantName = req.params.restaurantName;
    const rating = req.params.rating;
    const review = req.params.review;
    // console.log(req.body);

    try {
        const connection = await connectToDatabase();
        // Get RestaurantID based on the name
        const restaurantQuery = `SELECT RestaurantID FROM Restaurant WHERE Name = ?`;
        const restaurantQueryResult = await connection.query(restaurantQuery, [restaurantName]);
        const restaurantID = restaurantQueryResult[0].RestaurantID;
        console.log(restaurantID);

        if (!restaurantQueryResult) {
            return res.status(404).json({ success: false, message: "Restaurant not found." });
        }

        // Get CustomerID from username
        console.log(req.session.Name)
        const Name = req.session.Name;

        console.log(Name);
        const userQuery = `SELECT UserID FROM R_User WHERE Name = ?`;
        const userQueryResult = await connection.query(userQuery, [Name]);
        const UserID = userQueryResult[0].UserID;
        console.log(UserID);

        // // Insert review into RatingAndReview table
        const reviewQuery = `
            INSERT INTO RatingAndReview (CustomerID, RestaurantID, Rating, Review)
            VALUES (?, ?, ?, ?)
        `;
        
        await connection.query(reviewQuery, [UserID, restaurantID, rating, review]);

        res.json({ success: true, message: "Review added successfully." });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

module.exports = router;