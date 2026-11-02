const Redis = require('ioredis')
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})

redis.on("connect", ()=>{
    console.log("Redis connected")
})

redis.on("error", (error)=>{
    console.log("Redis error", error)
})

redis.on("ready", ()=>{
    console.log("Redis ready")
})

redis.on("close", ()=>{
    console.log("Redis closed")
})

module.exports = redis