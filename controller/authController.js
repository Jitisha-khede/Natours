const jwt = require('jsonwebtoken')
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id } , process.env.JWT_SECREAT,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync( async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400)); // 400 for bad request
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new AppError('Incorrect email or password', 401)); // 401 for unauthorized
    }

    const correct = await user.correctPassword(password, user.password);

    if (!correct) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is okay, send the token to the client
    const token = signToken(user._id);
    console.log(token);
    res.status(200).json({
        status: 'success',
        token
    });
});
