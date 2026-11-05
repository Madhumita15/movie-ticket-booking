const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://madhumita2005webskitters_db_user:3Esj8SOsrdkzvla3@cluster0.pehpfev.mongodb.net/movie-ticket-booking-testing");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});