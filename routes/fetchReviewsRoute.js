const express = require('express');
const router = express.Router();
const connectToDatabase = require('../config/dbconfig');

// Middleware to parse JSON data
router.use(express.json());

router.get('/:restaurantName', async (req, res) => {
    const restaurantName = req.params.restaurantName;
    console.log(restaurantName);

    try {
        const connection = await connectToDatabase();
        // Get the RestaurantID based on the restaurant name
        const restaurantQuery = `SELECT RestaurantID FROM Restaurant WHERE Name = ?`;
        const  restaurantQueryResult = await connection.query(restaurantQuery, [restaurantName]);
        const restaurantID = restaurantQueryResult[0].RestaurantID;
        console.log(restaurantID)
        // if (!restaurant) {
        //     return res.status(404).json({ success: false, message: "Restaurant not found." });
        // }


        // Fetch reviews for the restaurant
        const reviewQuery = `
            SELECT r.Rating, r.Review, r.ReviewDate, c.Name
            FROM RatingAndReview as r
            JOIN R_User as c ON r.CustomerID = c.UserID
            WHERE r.RestaurantID = ?
            ORDER BY r.ReviewDate DESC
        `;
        const reviews = await connection.query(reviewQuery, [restaurantID]);
        console.log(reviews);
        res.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

module.exports = router;