const express = require('express')
const app = express()
const router = require('./router/index')
const errorHandeler = require('./middleware/errorHandeler.middleware')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(router)

app.use(errorHandeler)


module.exports = app