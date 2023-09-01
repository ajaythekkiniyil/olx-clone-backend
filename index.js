const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const productRoute = require('./routes/product')
const userRoute = require('./routes/user')

// Enable All CORS Requests
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

require('dotenv').config()

// Routes
app.get('/', (req, res) => {
    res.send('welcome to api')
})

app.use('/api/product', productRoute)
app.use('/api/user', userRoute)

const port = process.env.PORT || 3002

// connecting to database and server listening on port
const connectDB = ()=>{
    mongoose.connect(process.env.DBURL)
    .then(resp=> {
        app.listen(port, () => console.log(`Connected to DB and Server started at ${port}`))
    })
    .catch(err=> console.log(err))
}
connectDB()
