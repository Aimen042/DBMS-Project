// Imports
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const homeRoutes = require('./routes/homeRoutes');
const loginRoutes = require('./routes/loginRoutes');
const successRoutes = require('./routes/successRoutes');
const failureRoutes = require('./routes/failureRoutes');
const mcdonaldRoute = require('./routes/mcdonaldRoute');
const bocRoute = require('./routes/bocRoute');
const deliziaRoute = require('./routes/deliziaRoute');
const odRoute = require('./routes/odRoute');
const broadwayRoute = require('./routes/broadwayRoute');
const cartRoute = require('./routes/cartRoute');
const connectToDatabase = require('./config/dbconfig');
const registerRoutes = require('./routes/registerRoutes');
const addReviewRoute = require('./routes/addReviewRoute');
const fetchReviewsRoute = require('./routes/fetchReviewsRoute');
const checkoutRoute = require('./routes/checkoutRoute');
const adminPanelRoute = require('./routes/adminPanel');
const restaurantData = require('./routes/restaurantData');
const customerData = require('./routes/customerData');
const menuData = require('./routes/menuData');
const orderData = require('./routes/orderData');
const riderData = require('./routes/riderData');

const cors = require('cors')
const session = require('express-session');

const app = express();
const PORT = 5000;

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure session middleware
app.use(
    session({
      secret: 'my_secret_key', // Replace with a secure key
      resave: false, // Prevents session being saved back to the session store if it wasn't modified
      saveUninitialized: true, // Saves uninitialized sessions to the store
      cookie: { secure: false }, // Set secure: true if using HTTPS
    })
  );


// Use application routes
app.use('/', homeRoutes);
app.use('/login', loginRoutes);
app.post('/login',loginRoutes);
app.use('/register', registerRoutes);
app.use('/success',successRoutes);
app.use('/failure',failureRoutes);
app.use('/mcdonalds',mcdonaldRoute);
app.use('/boc',bocRoute);
app.use('/delizia',deliziaRoute);
app.use('/od',odRoute);
app.use('/broadway',broadwayRoute);
app.use('/cart',cartRoute);
app.use('/checkout',checkoutRoute);
app.use('/addReview',addReviewRoute);
app.use('/reviews',fetchReviewsRoute);
app.use('/adminPanel',adminPanelRoute);
app.use('/restaurantData',restaurantData);
// app.post('/restaurantData',restaurantData);
app.use('/customerData',customerData);
app.use('/menuData',menuData);
app.use('/orderData',orderData);
app.use('/riderData',riderData);
// ODBC Connection String
app.use(cors());

(async () => {
    try {
        const connection = await connectToDatabase();
    } catch (err) {
        console.error('Failed to initialize the database connection:', err);
    }
})();

// hosting
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});