const redis = require("../config/redis.config");

const setCache = async ({ key, data, expiry = 300 }) => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", expiry);
    return true;
  } catch (error) {
    console.log("error from setcache", error);
    return null;
  }
};

const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.log("error from getcache", error);
    return null;
  }
};

const delCache = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.log("error from delcache", error);
    return null;
  }
};

module.exports = { setCache, getCache, delCache };
