const Movie = require("../models/movie.model");
const httpStatusCode = require("../utils/httpStatusCode");
const mongoose = require("mongoose");
const {
  clearMovieCache,
  getMovieCache,
  setMovieCache,
  clearMovieCacheById,
  setMovieCacheById,
  getMovieCacheById,
} = require("./movieCache.Service");
const cloudinary = require("../config/cloudinary.config");

const createMovieService = async ({
  name,
  cast,
  genre,
  releaseDate,
  director,
  file,
  duration,
  language,
}) => {
  const findMovie = await Movie.findOne({
    name: name,
    language: language,
    releaseDate: releaseDate,
  });
  if (findMovie) {
    const error = new Error(
      "Movie with this name, language and release date already exists",
    );
    error.statusCode = httpStatusCode.BAD_REQUEST;
    throw error;
  }

  const newMovie = new Movie({
    name: name,
    cast: cast,
    genre: genre,
    releaseDate: releaseDate,
    director: director,
    duration: duration,
    language: language,
    poster_image: file ? file.path : null,
    poster_public_id: file ? file.filename : null,
  });

  const movie = await newMovie.save();
  await clearMovieCache();
  return movie;
};

const getAllMoviesService = async () => {
  const movieCache = await getMovieCache();
  if (movieCache) {
    return { movies: movieCache, source: "redis" };
  }
  const movies = await Movie.aggregate([
    // 1. Find all shows belonging to each movie
    {
      $lookup: {
        from: "shows",
        localField: "_id",
        foreignField: "movieId",
        as: "shows",
      },
    },

    // 2. Separate each show
    {
      $unwind: {
        path: "$shows",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 3. Find the theater associated with each show
    {
      $lookup: {
        from: "theaters",
        localField: "shows.theaterId",
        foreignField: "_id",
        as: "theater",
      },
    },

    {
      $unwind: {
        path: "$theater",
        preserveNullAndEmptyArrays: true,
      },
    },

    // {
    //   $lookup: {
    //     from: "bookings",
    //     localField: "shows._id",
    //     foreignField: "showId",
    //     pipeline: [
    //       // Only count confirmed bookings
    //       {
    //         $match: {
    //           status: "confirmed",
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           totalBookings: { $sum: 1 },
    //           totalTickets: { $sum: "$numberOfTicket" },
    //         },
    //       },
    //     ],
    //     as: "bookingStats",
    //   },
    // },

    // {
    //   $project: {
    //     name: 1,
    //     showId: "$shows._id",
    //     bookingStats: 1,
    //   },
    // },

    // 4. Group shows by theater
    {
      $group: {
        _id: {
          movieId: "$_id",
          theaterId: "$theater._id",
        },

        movie: {
          $first: {
            _id: "$_id",
            name: "$name",
            duration: "$duration",
            cast: "$cast",
            genre: "$genre",
            director: "$director",
            language: "$language",
            poster_image: "$poster_image",
            releaseDate: "$releaseDate",
          },
        },

        theaterName: { $first: "$theater.theaterName" },
        location: { $first: "$theater.location" },

        shows: {
          $addToSet: {
            $cond: [
              { $ifNull: ["$shows._id", false] },
              {
                _id: "$shows._id",
                screenNumber: "$shows.screenNumber",
                showTiming: "$shows.showTiming",
                availableSeats: "$shows.availableSeats",
                totalSeats: "$shows.totalSeats",
              },
              "$$REMOVE",
            ],
          },
        },
      },
    },

    // 5. Group theaters under their respective movies
    {
      $group: {
        _id: "$movie._id",
        name: { $first: "$movie.name" },
        duration: { $first: "$movie.duration" },
        cast: { $first: "$movie.cast" },
        genre: { $first: "$movie.genre" },
        director: { $first: "$movie.director" },
        language: { $first: "$movie.language" },
        poster_image: { $first: "$movie.poster_image" },
        releaseDate: { $first: "$movie.releaseDate" },

        theaters: {
          $addToSet: {
            $cond: [
              { $ifNull: ["$theaterName", false] },
              {
                theaterName: "$theaterName",
                theaterId: "$_id.theaterId",
                location: "$location",
                shows: "$shows",
              },
              "$$REMOVE",
            ],
          },
        },
      },
    },

    // 6. Calculate total theaters
    {
      $addFields: {
        totalTheaters: { $size: "$theaters" },
      },
    },
  ]);

  await setMovieCache(movies);
  return { movies, source: "mongoDB" };
};

const getMovieByIdService = async (movieId) => {
  const movieCacheId = await getMovieCacheById(movieId);
  if (movieCacheId) {
    return { movie: movieCacheId, source: "redis" };
  }

  const movieById = await Movie.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(movieId) },
    },
    {
      $lookup: {
        from: "shows",
        foreignField: "movieId",
        localField: "_id",
        as: "shows",
      },
    },
    {
      $lookup: {
        from: "theaters",
        foreignField: "_id",
        localField: "shows.theaterId",
        as: "theater",
      },
    },
  ]);
  if (!movieById[0]) {
    const error = new Error("Movie not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }

  await setMovieCacheById(movieById);
  return { movie: movieById[0], source: "mongoDB" };
};

const updateMovieService = async ({
  name,
  cast,
  genre,
  releaseDate,
  director,
  file,
  duration,
  language,
  movieId,
}) => {
  const movie = await Movie.findById(new mongoose.Types.ObjectId(movieId));
  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }
  movie.name = name ?? movie.name;
  movie.cast = cast ?? movie.cast;
  movie.director = director ?? movie.director;
  movie.genre = genre ?? movie.genre;
  movie.releaseDate = releaseDate ?? movie.releaseDate;
  movie.duration = duration ?? movie.duration;
  movie.language = language ?? movie.language;

  let oldPosterImageId = null;
  if (file) {
    if (movie.poster_image) {
      oldPosterImageId = movie.poster_public_id;
    }

    movie.poster_image = file.path;
    movie.poster_public_id = file.filename;
  }

  await movie.save();
  if (oldPosterImageId) {
    await cloudinary.uploader.destroy(oldPosterImageId);
  }
  await clearMovieCache();
  await clearMovieCacheById({ movieId: movie._id });
  return movie;
};

const deleteMovieService = async (id) => {
  const movie = await Movie.findById(new mongoose.Types.ObjectId(id));
  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }

  if (movie.poster_image) {
    await cloudinary.uploader.destroy(movie.poster_public_id);
  }

  await Movie.findByIdAndDelete(id);
  await clearMovieCache();
  await clearMovieCacheById({ movieId: movie._id });
  return;
};

module.exports = {
  createMovieService,
  getAllMoviesService,
  updateMovieService,
  deleteMovieService,
  getMovieByIdService,
};
