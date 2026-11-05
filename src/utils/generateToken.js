const jwt = require('jsonwebtoken')

const generateAccessToken = (user)=>{
    const accessToken = jwt.sign({
        _id: user._id,
        role: user.role
    }, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: '15m'})
    return accessToken


}

const generateRefreshToken = (user)=>{
    const refreshToken = jwt.sign({
        _id: user._id,
        role: user.role
    }, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '30d'})
    return refreshToken


}
module.exports = {generateAccessToken, generateRefreshToken}