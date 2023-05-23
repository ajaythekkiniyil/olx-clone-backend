const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require,
            unique: true,          
        },
        phone: {
            type: Number,
            require,
            unique: true,
            minLength: 10,
            maxLength: 10,
        },
        email: {
            type: String,
            require,
            unique: true, 
        }
    }
)

const user = mongoose.model('user', userSchema)
module.exports = user