const express = require('express');
const app = express();
const routeConf = require('./src/config/RouteConf');
const dbConf = require('./src/config/DBConf');
const errorHandler = require('./src/middleware/errorHandler');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sendMail } = require('./src/utils/mailHandler');

// Set env variables
require('dotenv').config();

// Middleware to parse json body and url
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

// Enable CORS Policy
app.use(cors());

// Start the server and set the port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Set all routes
routeConf(express, app);

// Set custom error middleware
app.use(errorHandler);

//Handle unhandled promise errors
process.on('unhandledRejection', err => {
    console.log(`Unhandled Error: ${err}`);
    process.exit(1);
});

// Establish database Connection
// dbConf();
