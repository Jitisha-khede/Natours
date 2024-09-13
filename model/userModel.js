const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength : 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

userSchema.pre('save', async function(next){
    //only runnthis function if password is actually modified
    if(!this.isModified('password')) return next();

    //hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password,12);

    //delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
};

const User = mongoose.model('User', userSchema);
module.exports = User;