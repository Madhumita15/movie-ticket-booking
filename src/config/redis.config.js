// const Redis = require('ioredis')
// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
// })

// redis.on("connect", ()=>{
//     console.log("Redis connected")
// })

// redis.on("error", (error)=>{
//     console.log("Redis error", error)
// })

// redis.on("ready", ()=>{
//     console.log("Redis ready")
// })

// redis.on("close", ()=>{
//     console.log("Redis closed")
// })

// module.exports = redis





const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,

  connectTimeout: 10000,

  retryStrategy(times) {
    if (times > 5) {
      return null;
    }

    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

// redis.on("close", () => {
//   console.log("Redis closed");
// });

module.exports = redis;
