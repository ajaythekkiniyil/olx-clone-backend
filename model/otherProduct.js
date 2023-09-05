const mongoose = require('mongoose')

const otherPrductSchema = mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    sellerId: {
        type: String,
    },
    datePosted: {
        type: Date,
    },
    image: {
        type: Array,
    },
    location:{
        type: String,
    }
})

module.exports = mongoose.model('otherProduct', otherPrductSchema)