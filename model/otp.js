const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema(
    {
        number: {
            type: Number,
            require,
            unique: true,
            minLength: 4,
            maxLength: 4,
        }
    }
)

const otp = mongoose.model('otp', otpSchema)
module.exports = otp