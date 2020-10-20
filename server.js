const express = require('express');
const app = express()
const bodyParser = require('body-parser')
require("dotenv").config()
const api = require("./router/api")
const user = require("./router/userRoutes")
const mongoose = require('mongoose')
const cors = require('cors')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/BankDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

    next()
})

app.use('/user', user)
app.use('/', api)

const PORT = 3100
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// { amount: 3200, vendor: "Elevation", category: "Salary" },
// { amount: -7, vendor: "Runescape", category: "Entertainment" },
// { amount: -20, vendor: "Subway", category: "Food" },
// { amount: -98, vendor: "La Baguetterie", category: "Food" }