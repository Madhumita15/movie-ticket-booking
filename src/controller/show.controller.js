const { createShowService, getAllShowService } = require("../service/show.service");
const httpStatusCode = require("../utils/httpStatusCode");

class ShowController {
  async createShow(req, res) {
    const { theaterId, movieId, screenNumber, showTiming, totalSeats } =
      req.body;

      const show = await createShowService({theaterId, movieId, screenNumber, showTiming, totalSeats})
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Show created successfully!",
        data: show
      })
  }


  async getAllShow(req, res){
    const {shows, source} = await getAllShowService()
    console.log("shows from database", shows)
    return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Show fetched sucessfully!",
        source: source,
        data: shows
    })
  }


}

module.exports = new ShowController();
