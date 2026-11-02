const Theater = require('../models/theater.model')
const httpStatusCode = require('../utils/httpStatusCode')
const { clearTheaterCache, getTheaterCache, setTheaterCache } = require('./theaterCache.service')

const createTheaterService = async({numberOfScreens, theaterName, location })=>{
    const findTheater = await Theater.findOne({theaterName: theaterName, location: location})
    if(findTheater){
        const error = new Error("Theater name with this location already created")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error
    }

    const newTheater = new Theater({
        numberOfScreens: numberOfScreens,
        theaterName: theaterName,
        location: location
    })

    const theater = await newTheater.save()
    await clearTheaterCache()
    return theater


    
}



const getAllTheatersService = async()=>{
    const theaterCache = await getTheaterCache()
    if(theaterCache){
        return {theaters: theaterCache, source: "redis"}
    }
    const theaters = await Theater.aggregate([
        {
            $lookup: {
                from: "shows",
                foreignField: "theaterId",
                localField: "_id",
                as: "shows"

            }
        },
        {
            $lookup: {
                from: "movies",
                foreignField: "_id",
                localField: "shows.movieId",
                as: "movies"

            }

        }
    ])
    if(theaters.length === 0){
        const error = new Error("no theaters found")
        error.statusCode = httpStatusCode.OK
        throw error
    }
    await setTheaterCache(theaters)
    return  {theaters: theaters, source: "mongoDB"}



}
module.exports = {createTheaterService, getAllTheatersService}