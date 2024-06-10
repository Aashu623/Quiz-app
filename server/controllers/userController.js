const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcryptjs')

//REGISTER USER
exports.registerUser = async (req, res, next) => {
    const { name, enrollment, email, password, branch } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ $or: [{ enrollment }, { email }] });

    if (existingUser) {
        return next(new ErrorHandler("User already exits", 400));
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = await User.create({
        name,
        enrollment,
        email,
        password: hashedPassword,
        branch
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    // Set cookie with the token
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600, // in seconds (1 hour)
        path: '/' // adjust as needed
    }));

    res.status(201).json({
        success: true,
        user
    });
};

//LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { enrollment, password } = req.body;


    //checking if user has given password and enrollment both
    if (!enrollment || !password) {
        return next(new ErrorHandler("Please Enter Enrollment & Password", 400));
    }

    const user = await User.findOne({ enrollment });


    if (!user) {
        return next(new ErrorHandler("Invalid enrollment or password"))
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(new ErrorHandler("Wrong password", 401));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    // Send success response with user data
    res.status(200).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
});

//LOGOUT USER
exports.logout = catchAsyncErrors(async (req, res, next) => {

    const user = null;
    const token = '';
    res.status(200).cookie('token',token).json({
        success: true,
        user,
        message: "Logged Out"
    })
});

//GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    })
});

//GET ALL USER --ADMIN
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
});

//GET SINGLE USER --ADMIN
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id : ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
});

//UPDATE USER ROLE --ADMIN
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
    })
});

//DELETE USER --ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id:${req.params.id}`));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})