const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    })
}
exports.updateUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    })
}
exports.getAllUsers = catchAsync( async(req,res) =>{
    const users = await User.find();

    //SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: User.length,
        data : {
            users
        }
    });
})
exports.deleteUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    })
}
exports.createUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet'
    })
}