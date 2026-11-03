const { createBookingService, cancelBookingService, getAllBookingHistoryService, getBookingHistoryByUserIdService } = require("../service/booking.service")
const httpStatusCode = require("../utils/httpStatusCode")
const SendMail = require("../utils/sendMail")

class BookingController{
    async createBooking(req, res){
        const {numberOfTicket, showId} = req.body
        const userId = req.user._id
        console.log("numberofticket", typeof numberOfTicket)
        const booking = await createBookingService({numberOfTicket, showId, userId})
        return res.status(httpStatusCode.CREATED).json({
            success: true,
            message: "Booking created successfully!",
            data: booking
        })

    }

    async cancelBooking(req, res){
        const bookingId = req.params.id
        const userId = req.user._id
        const booking = await cancelBookingService({bookingId, userId})
        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Booking cancelled successfully!",
            data: booking
        })

    }

    async getAllBookingHistoryByAdmin(req, res){
        const {bookings, source} = await getAllBookingHistoryService()
         return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Booking fetched successfully!",
            data: bookings,
            source: source
        })


    }

     async getAllBookingHistoryByUserId(req, res){
        const userId = req.user._id
        const {bookings, source} = await getBookingHistoryByUserIdService(userId)
         return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Booking fetched successfully!",
            source: source,
            data: bookings
        })


    }


    async getAllBookingHistoryByUserIdEmail(req, res){
        const userId = req.user._id
        const {bookings, source} = await getBookingHistoryByUserIdService(userId)
        await SendMail.sendBookingSummary({user: req.user, bookings: bookings})
         return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Booking fetched successfully!",
            source: source,
            data: bookings
        })


    }
   

}

module.exports = new BookingController()