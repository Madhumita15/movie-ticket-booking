const { setCache, getCache, delCache } = require("../utils/redisCache");

const key = "theaters:all";

const setTheaterCache = async (theaters) => {
  return await setCache({ key: key, data: theaters });
};

const getTheaterCache = async () => {
  return await getCache(key);
};

const clearTheaterCache = async () => {
  return await delCache(key);
};

const getTheaterByIdCache = async (user) => {
  const key = `theaterById:${user._id}`;
  return await getCache(key);
};

const setTheaterByIdCache = async (user) => {
  const key = `theaterById:${user._id}`;
  return await setCache({ key: key, data: user });
};

const clearTheaterByIdCache = async (user) => {
  const key = `theaterById:${user._id}`;
  return await setCache(key);
};

module.exports = {
  setTheaterCache,
  getTheaterCache,
  clearTheaterCache,
  setTheaterByIdCache,
  getTheaterByIdCache,
  clearTheaterByIdCache,
};
