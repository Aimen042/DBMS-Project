const odbc = require('odbc');

const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-UUIE0QG,1433;Database=FoodOrderingManagementSystem;Trusted_Connection=yes;';

let connection;

const connectToDatabase = async () => {
    try {
        connection = await odbc.connect(connectionString);
        console.log('Connection to the database was successful...');
        return connection;
    } catch (err) {
        console.error('Connection error:', err);
        throw err; // To notify the server in case of failure
    }
};

module.exports = connectToDatabase;
