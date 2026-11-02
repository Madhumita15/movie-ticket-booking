const { setCache } = require('./redisCache')

const generateOtp = async(userId)=>{
    const otp = Math.ceil(1000 + Math.random() * 9000)
    console.log("log3")
    const key = `verify-email-otp-${userId}`
    const isSaved = await setCache({key: key, data: otp})
    console.log("log4")
    if(!isSaved){
        throw new Error("Failed to store otp")
    }
    console.log("log5")
    return otp

}

module.exports = generateOtp