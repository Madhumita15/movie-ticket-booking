const { createTheaterService, getAllTheatersService } = require("../service/theater.service")
const httpStatusCode = require("../utils/httpStatusCode")

class TheaterController{
    async createTheater(req, res){
        const {numberOfScreens, theaterName, location} = req.body
        const theater = await createTheaterService({numberOfScreens, theaterName, location})
        return res.status(httpStatusCode.CREATED).json({
            success: true,
            message: "Theater created successfully!",
            data: theater
        })

    }

    async getAllTheater(req, res){
        const {theaters, source} = await getAllTheatersService()
        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Theaters fetched successfully!",
            data: theaters,
            source: source
        })

    }

}




module.exports = new TheaterController()