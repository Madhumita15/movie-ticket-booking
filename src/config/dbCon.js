const mongoose = require('mongoose')
const dbCon = async()=>{
    const connection = await mongoose.connect(process.env.MONGO_URL)
    if(connection){
        console.log('MongoDB connected successfully!')
    }else{
        console.log('MongoDB not connected')
    }


}

module.exports = dbCon