const { setCache, getCache, delCache } = require("../utils/redisCache")

const key = "shows:all"

const setShowCache = async(shows)=>{
    return await setCache({key: key, data: shows})


}

const getShowCache = async()=>{
    return await getCache(key)

}

const clearShowCache = async()=>{
    return await delCache(key)

}



const setShowCacheById = async(show)=>{
    const key = `show:${show._id}`
    return await setCache({key: key, data: show})


}

const getShowCacheById = async(showId)=>{
      const key = `show:${showId}`
    return await getCache(key)

}

const clearShowCacheById = async(showId)=>{
    const key = `show:${showId}`
    return await delCache(key)

}

module.exports = {setShowCache, getShowCache, clearShowCache, setShowCacheById, getShowCacheById, clearShowCacheById }