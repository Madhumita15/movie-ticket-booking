require('dotenv').config()
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const redis = require('./src/config/redis.config')

const app = require('./src/app');
const dbCon = require('./src/config/dbCon');


const startServer = async()=>{
    const PORT = process.env.PORT
    await dbCon()
    await redis.ping()
    app.listen(PORT, ()=>{
        console.log(`app is listening on http://localhost:${PORT}`)
    })


}
startServer()