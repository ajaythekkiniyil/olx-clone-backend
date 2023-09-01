const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: Number,
    },
    address: {
        type: JSON,
    },
    otp: {
        type: Number
    },
    verified: {
        type: Boolean
    }
})

module.exports = mongoose.model('user', userSchema)