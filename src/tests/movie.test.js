const Movie = require("../models/movie.model");
const User = require("../models/user.model");
const request = require("supertest");
const app = require("../../server");



describe("Movie crud API", () => {
  let accessToken;
  beforeAll(async () => {
    await User.create({
      name: "ticket-admin",
      email: "admin@gmail.com",
      password: "Admin@123",
      role: "admin",
      phone: "8737490284",
    });
    const user = await User.findOne({ email: "admin@gmail.com" });
    user.isEmailVerified = true;
    await user.save();
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "admin@gmail.com",
      password: "Admin@123",
    });
    accessToken = res.body.accessToken;
  });
  it("should create movie", async () => {
    const res = await request(app)
      .post("/api/v1/movies")
      .send({
        name: "movie1",
        cast: ["srk", "kiyara"],
        genre: ["genr1", "genr2"],
        releaseDate: "2026/12/12",
        director: "Madhumita",
        duration: 123,
        language: "Bengali",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("movie1");
    expect(res.body.data.language).toBe("Bengali");
    expect(res.body.data.duration).toBe(123);
    expect(res.body.data.director).toBe("Madhumita");
    expect(res.body.data.genre).toEqual(["genr1", "genr2"]);
    expect(res.body.data.cast).toEqual(["srk", "kiyara"]);
  });

  it("should get all movies", async () => {
    const res = await request(app)
      .get("/api/v1/movies")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should get movies id", async () => {
    const movie = await Movie.create({
      name: "movie1",
      cast: ["srk", "kiyara"],
      genre: ["genr1", "genr2"],
      releaseDate: "2026/12/12",
      director: "Madhumita",
      duration: 123,
      language: "Bengali",
    });
    const res = await request(app)
      .get(`/api/v1/movies/${movie._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update movie byId", async () => {
    const movie = await Movie.create({
      name: "movie1",
      cast: ["srk", "kiyara"],
      genre: ["genr1", "genr2"],
      releaseDate: "2026/12/12",
      director: "Madhumita",
      duration: 123,
      language: "Bengali",
    });
    const res = await request(app)
      .put(`/api/v1/movies/${movie._id}`)
      .send({
        name: "movie1 update",
        cast: ["srk"],
        genre: ["genr1"],
        releaseDate: "2026/12/11",
        director: "Madhumita update",
        duration: 120,
        language: "Hindi",
      })
      .set("Authorization", `Bearer ${accessToken}`);
// .toBe() checks reference equality (whether both are the exact same object).
// .toEqual() checks the actual values inside arrays and objects.
console.log("from update movie", res.body)
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("movie1 update");
    expect(res.body.data.cast).toEqual(["srk"]);
    expect(res.body.data.genre).toEqual(["genr1"]);
    expect(res.body.data.director).toBe("Madhumita update");
    expect(res.body.data.duration).toBe(120);
    expect(res.body.data.language).toBe("Hindi");
  });

  it("should delete movie byId", async () => {
    const movie = await Movie.create({
      name: "movie1",
      cast: ["srk", "kiyara"],
      genre: ["genr1", "genr2"],
      releaseDate: "2026/12/12",
      director: "Madhumita",
      duration: 123,
      language: "Bengali",
    });
    const res = await request(app)
      .delete(`/api/v1/movies/${movie._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
