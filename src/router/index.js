const express = require('express')
const router = express.Router()
const authRouter = require('../router/auth.router')
const movieRouter = require('../router/movie.router')
const showRouter = require('../router/show.router')
const theaterRouter = require('../router/theater.router')
const userRouter = require('../router/user.router')
const bookingRouter = require('../router/booking.router')

router.use("/api/v1/auth", authRouter)
router.use("/api/v1", userRouter)
router.use("/api/v1", movieRouter)
router.use("/api/v1", showRouter)
router.use("/api/v1", theaterRouter)
router.use("/api/v1", bookingRouter)



module.exports = router