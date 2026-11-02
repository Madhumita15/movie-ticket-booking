const { getCache, setCache, delCache } = require("../utils/redisCache");

const key = "booking:all";

const getBookingCache = async () => {
  return await getCache(key);
};

const setBookingCache = async (bookings) => {
  return await setCache({ key: key, data: bookings});
};

const clearBookingCache = async (key) => {
  return await delCache(key);
};


const getBookingCacheByUserId = async (userId) => {
    const key = `booking:${userId}`;
  return await getCache(key);
};

const setBookingCacheByUserId = async ({userId, bookings}) => {
    const key = `booking:${userId}`;
  return await setCache({ key: key, data: bookings});
};

const clearBookingCacheByUserId = async (userId) => {
    const key = `booking:${userId}`;
  return await delCache(key);
};

module.exports = {getBookingCache, setBookingCache, clearBookingCache, getBookingCacheByUserId, setBookingCacheByUserId, clearBookingCacheByUserId}