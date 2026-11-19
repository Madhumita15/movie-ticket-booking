// const mongoose = require("mongoose");
// const redis = require('../config/redis.config')

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGODB_TEST_URI);
// });

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   if(redis){
//     await redis.quit()
//   }
// });




const mongoose = require("mongoose");
const redis = require("../config/redis.config");

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://madhumita2005webskitters_db_user:3Esj8SOsrdkzvla3@cluster0.pehpfev.mongodb.net/movie-ticket-booking-testing");

  // Verify Redis is available before running tests.
  await redis.ping();
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } finally {
    if (redis.status === "ready") {
      await redis.quit();
    } else if (redis.status !== "end") {
      await redis.disconnect();
    }
  }
});



