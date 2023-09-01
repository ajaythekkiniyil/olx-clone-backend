const mongoose = require('mongoose')

const chatSchema = mongoose.model({
    productId: {
        type: Number,
        required: true,
        unique: true,
    },
    participants: {
        type: Array,
    },
    messages:{
        type: Array,
    }
})

module.exports = mongoose.model('chat', chatSchema)