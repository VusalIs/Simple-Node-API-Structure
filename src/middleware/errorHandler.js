const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    console.log(err);

    // Mongoose id not found error
    if (err.name === 'CastError') {
        error = new ErrorResponse(`Request not found with id of ${req.value}`, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = new ErrorResponse('Entered duplicate key value', 404);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message, 401);
    }

    return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
