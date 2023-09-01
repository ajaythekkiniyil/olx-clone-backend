const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    sellerId: {
        type: String,
    },
    brand: {
        type: String,
    },
    year: {
        type: Number,
    },
    fuel: {
        type: String,
    },
    kilometerDriven: {
        type: Number,
    },
    owner: {
        type: Number,
    },
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

module.exports = mongoose.model('car', carSchema)