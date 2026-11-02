const { getCache, setCache, delCache } = require("../utils/redisCache")


const getProfileUserCache = async(userId)=>{
    const key = `profile-user-${userId}`
    return await getCache(key)
   

}


const setProfileUserCache = async(user)=>{
    const key = `profile-user-${user._id}`
    return await setCache({key: key, data: user})
   

}

const clearProfileUserCache = async(userId)=>{
     const key = `profile-user-${userId}`
    return await delCache(key)

}

module.exports = {getProfileUserCache, setProfileUserCache, clearProfileUserCache}