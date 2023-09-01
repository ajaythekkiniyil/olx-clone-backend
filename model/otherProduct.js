const mongoose = require('mongoose')

const otherPrductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    sellerId: {
        type: Number,
        required: true,
        unique: true,
    },
    datePosted: {
        type: Date,
    },
    image: {
        type: Array,
    },
    location:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('otherProduct', otherPrductSchema)