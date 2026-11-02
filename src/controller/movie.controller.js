const {
  createMovieService,
  getAllMoviesService,
  getMovieByIdService,
  deleteMovieService,
  updateMovieService,
} = require("../service/movie.service");
const httpStatusCode = require("../utils/httpStatusCode");

class MovieControler {
  async createMovie(req, res) {
    const { name, cast, genre, releaseDate, director, duration, language } =
      req.body;
    const file = req.file;
    console.log("name", name, cast, genre);
    const movie = await createMovieService({
      name,
      cast,
      genre,
      releaseDate,
      director,
      file,
      duration,
      language,
      file,
    });
    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "Movie created successfully!",
      data: movie,
    });
  }

  async getAllMovie(req, res) {
    const movies = await getAllMoviesService();
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Movie fetched successfully!",
      data: movies,
    });
  }

  async getMovieId(req, res) {
    const movieId = req.params.id;
    const { movie, source } = await getMovieByIdService(movieId);
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Movie fetched successfully!",
      data: movie,
      source: source,
    });
  }

  async updateMovie(req, res) {
    const movieId = req.params.id;
    const { name, cast, genre, releaseDate, director, duration, language } =
      req.body;
    const file = req.file;
    console.log("log1")

    const movie = await updateMovieService({
      name,
      cast,
      genre,
      releaseDate,
      director,
      duration,
      language,
      file,
      movieId,
    });
    console.log("log2")
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Movie updated sucessfully!",
      data: movie
    });
  }

  async deleteMovie(req, res) {
    const id = req.params.id;
    await deleteMovieService(id);
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Movie deleted sucessfully!",
    });
  }
}

module.exports = new MovieControler();
