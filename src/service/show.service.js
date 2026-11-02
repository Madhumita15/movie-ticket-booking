const Theater = require("../models/theater.model");
const Movie = require("../models/movie.model");
const httpStatusCode = require("../utils/httpStatusCode");
const Show = require("../models/shows.model");
const {
  clearShowCache,
  getShowCache,
  setShowCache,
  clearShowCacheById,
} = require("./showCache.service");

const createShowService = async ({
  theaterId,
  movieId,
  screenNumber,
  showTiming,
  totalSeats,
}) => {
  const findMovie = await Movie.findById(movieId);
  if (!findMovie) {
    const error = new Error("Movie not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }

  const findTheater = await Theater.findById(theaterId);
  if (!findTheater) {
    const error = new Error("Theater not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }

  if (Number(screenNumber) > Number(findTheater.numberOfScreens)) {
    const error = new Error("Screen not available in this theater");
    error.statusCode = httpStatusCode.BAD_REQUEST;
    throw error;
  }

  const findShow = await Show.find({
    theaterId: theaterId,
    screenNumber: screenNumber,
  }).populate("movieId", "duration");
  for (const show of findShow) {
    const movieDuration = show.movieId.duration;
    const existingShow = new Date(show.showTiming).getTime();
    const existingShowEndTime = existingShow + movieDuration * 60 * 1000;

    const newMovieStartingShowTime = new Date(showTiming).getTime();
    const newMovieEndingShowTime =
      newMovieStartingShowTime + findMovie.duration * 60 * 1000;
    if (
      newMovieStartingShowTime < existingShowEndTime &&
      newMovieEndingShowTime > existingShow
    ) {
      const error = new Error("not avlialable");
      error.statusCode = httpStatusCode.BAD_REQUEST;
      throw error;
    }
  }

  const newShow = new Show({
    totalSeats: totalSeats,
    theaterId: theaterId,
    movieId: movieId,
    screenNumber: screenNumber,
    showTiming: showTiming,
    avaliableSeats: totalSeats
  });

  const createdShow = await newShow.save();
  await clearShowCache();
  await clearShowCacheById(createdShow._id)
  return createdShow;
};

const getAllShowService = async () => {
  const showCache = await getShowCache();
  if (showCache) {
    return { shows: showCache, source: "redis" };
  }
  const shows = await Show.aggregate([
    {
      $lookup: {
        from: "movies",
        foreignField: "_id",
        localField: "movieId",
        as: "movie",
      },
    },
    {
      $unwind: "$movie"
    },
    {
      $lookup: {
        from: "theaters",
        foreignField: "_id",
        localField: "theaterId",
        as: "theater",
      },
    },
    {
      $unwind: "$theater"
    },
  ]);

  if (shows.length === 0) {
    const error = new Error("No shows found");
    error.statusCode = httpStatusCode.OK;
    throw error;
  }

  console.log("shows", shows)
  await setShowCache(shows);
  return {shows: shows, source: "mongoDB"};
};

module.exports = { createShowService, getAllShowService };
