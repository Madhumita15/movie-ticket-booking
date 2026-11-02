const { getCache, setCache, delCache } = require("../utils/redisCache");

const key = "movies:all";

const getMovieCache = async () => {
  return await getCache(key);
};

const setMovieCache = async (movies) => {
  return await setCache({ key: key, data: movies});
};

const clearMovieCache = async (key) => {
  return await delCache(key);
};

const getMovieCacheById = async (movieId) => {
  const key = `movie-byid-:${movieId}`;
  return await getCache(key);
};

const setMovieCacheById = async (movieById) => {
  const key = `movie-byid-:${movieById[0]._id}`;
  return await setCache({ key: key, data: movieById[0] });
};

const clearMovieCacheById = async ({movieId}) => {
  const key = `movie-byid-:${movieId}`;
  return await delCache(key);
};

module.exports = {
  getMovieCache,
  setMovieCache,
  clearMovieCache,
  getMovieCacheById,
  setMovieCacheById,
  clearMovieCacheById,
};
