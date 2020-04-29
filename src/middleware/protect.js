const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

exports.protect = permissions => {
    return asyncHandler(async (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return next(new ErrorResponse('Not authorized for this route!', 401));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (!permissions.find(element => element == decoded.status)) {
                return next(new ErrorResponse('You are not allowed for this request!', 401));
            }

            req.user = decoded;
        } catch (error) {
            return next(new ErrorResponse('Not authorized for this route!', 401));
        }
        return next();
    });
};
