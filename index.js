const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
// Enable All CORS Requests
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Routes
const userRouter = require('./routes/user')

require('dotenv').config()

app.get('/', (req,res)=>{
    res.send('hi')
    console.log(req.cookies)
})

// user route
app.use('/api/user', userRouter)

// database connection and server start
const port = process.env.PORT || 3001
const connectDB = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(resp=> {
        app.listen(port, () => console.log(`Connected to DB and Server started at ${port}`))
    })
    .catch(err=> console.log(err))
}
connectDB()

