const User = require('../models/user.model')
const httpStatusCode = require('../utils/httpStatusCode')
const sendEmail = require('../utils/sendMail')
const { getCache } = require('../utils/redisCache')
const {generateAccessToken, generateRefreshToken} = require('../utils/generateToken')
const JWT = require('jsonwebtoken')



const registerService = async({name, email, phone, password})=>{
    const existingEmail = await User.findOne({email: email})
    if(existingEmail){
        const error = new Error("Email already exist")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error
    }

    const newUser = new User({
        name: name,
        email: email,
        phone: phone,
        password: password
    })

    const user = await newUser.save()
    console.log("user1")
    await sendEmail.verifyEmail(user)
     console.log("user2")
    return user
}


const emailVerifyService = async({email, otp})=>{
    const user = await User.findOne({email: email})
    if(!user){
        const error = new Error("User not found")
        error.statusCode = httpStatusCode.NOT_FOUND
        throw error
    }

    if(user.isEmailVerified){
        const error = new Error("Email already verified")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error
    }

    const key = `verify-email-otp-${user._id}`
    const findotp = await getCache(key)

    if(findotp === null){
        await sendEmail.verifyEmail(user)
        const error = new Error("OTP expired! try again later")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error

    }

    if(String(findotp) !== String(otp)){
        const error = new Error("Incorrect otp, Please Try again")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error


    }
    user.isEmailVerified = true
    await user.save()
    return user
}

const loginService = async({password, email})=>{
    const user = await User.findOne({email: email})
    if(!user){
        const error = new Error("User not found")
        error.statusCode = httpStatusCode.NOT_FOUND
        throw error
    }

    if(!user.isEmailVerified){
        const error = new Error("Email not verified")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
         const error = new Error("Invalid credentials")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error

    }
    

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    user.refreshToken= refreshToken
    await user.save()
    return {accessToken, refreshToken, user}


}


const refreshTokenService = async(refreshToken)=>{
    console.log("refresh", refreshToken)
    if(!refreshToken){
        const error = new Error("Refresh token not provided")
        error.statusCode = httpStatusCode.BAD_REQUEST
        throw error
    }
    
    const cleanToken = refreshToken.split(" ")[1]
    const decode = JWT.verify(cleanToken, process.env.JWT_REFRESH_SECRET_KEY)
    const user = await User.findById(decode._id)
    if(!user){
        const error = new Error("User not found")
        error.statusCode = httpStatusCode.NOT_FOUND
        throw error

    }

    const newAccessToken = generateAccessToken(user)
    return newAccessToken


}


module.exports = {registerService, loginService, emailVerifyService, refreshTokenService}
