const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailHandler');

//@desc   registration for User
//@route  POST /auth/user/register
//@access PUBLIC
exports.createUser = asyncHandler(async (req, res, next) => {
    const {
        first_name,
        last_name,
        username,
        password,
        passwordConfirmation,
        home_address,
        email,
        linkedin,
        facebook,
        instagram,
    } = req.body;

    if (password != passwordConfirmation) {
        next(new ErrorResponse('Passwords are not matched!', 400));
    }

    const newUser = new User({
        first_name,
        last_name,
        username,
        password,
        passwordConfirmation,
        home_address,
        email,
        linkedin,
        facebook,
        instagram,
    });

    await newUser.save();

    const token = newUser.getSignedJWTToken();

    await sendMail({ mailTo: email, mailType: 'REGISTRATION', options: { username, id: newUser._id, token } });

    return res.status(201).json({ success: true, message: 'You successfully created a user!' });
});

//@desc   Activate account
//@route  POST /auth/verify/:token
//@access PUBLIC
exports.activateAccount = asyncHandler(async (req, res, next) => {
    const token = req.params.token;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);

    await User.updateOne({ _id: decoded.userId }, { status: 'VERIFIED' });

    return res.status(201).json({ success: true, message: 'Account activated. You can log in now.' });
});

//@desc   login for users
//@route  POST /auth/user/login
//@access PUBLIC
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('email password status');

    if (!user) {
        return next(new ErrorResponse('Provided email is not correct!', 400));
    }

    if (user.status === 'PENDING') {
        return next(new ErrorResponse('Please verify your account!', 401));
    }

    const isMatch = user.isMatchedPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Password is incorrect!', 401));
    }

    const token = user.getSignedJWTToken();
    sendTokenInCookie(token, 200, res);
});

// Sent token in cookie
const sendTokenInCookie = (token, statusCode, res) => {
    const options = {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
    };

    return res.status(statusCode).cookie('token', token, options).json({ success: true, message: 'Logged in!' });
};
