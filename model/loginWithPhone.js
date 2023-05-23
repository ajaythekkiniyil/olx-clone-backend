const mongoose = require('mongoose')

const loginWithPhoneSchema = new mongoose.Schema(
    {
        phone: {
            type: Number,
            maxLength:10,
            minLength:10,
            require,
            unique: true
        }
    }
) 

const loginWithPhone = mongoose.model('loginWithPhone', loginWithPhoneSchema)
module.exports = loginWithPhone