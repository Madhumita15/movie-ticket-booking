const express = require('express')
const app = express()
const router = require('./router/index')
const errorHandeler = require('./middleware/errorHandeler.middleware')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = require('../swagger.json')
const swaggerDocument = swaggerJsDoc(swaggerOptions)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router)

app.use(errorHandeler)


module.exports = app