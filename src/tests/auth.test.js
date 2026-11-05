const User = require("../models/user.model");
const request = require("supertest");
const app = require("../../server");
const { getCache } = require("../utils/redisCache");
const SendMail = require("../utils/sendMail");





describe("Ticket Booking Authintication API", () => {
  let accessToken;
  let refreshToken;
  it("should register user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Madhumita",
      password: "madhumita@123",
      email: "madhumita@yopmail.com",
      phone: "6278936478",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("shoud verify email", async () => {
    await User.create({
      name: "Madhumita",
      email: "madhumita1@yopmail.com",
      password: "Madhumita@123",
      phone: "8273648918",
    });
    const user = await User.findOne({ email: "madhumita1@yopmail.com" });
    await SendMail.verifyEmail(user);
    const key = `verify-email-otp-${user._id}`;
    const otp = await getCache(key);
    console.log("otp", otp);
    const res = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({
        email: "madhumita1@yopmail.com",
        otp: String(otp),
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should user login", async () => {
    await User.create({
      name: "Madhumita",
      email: "madhumita2@yopmail.com",
      password: "Madhumita@123",
      phone: "8273648918",
    });
    const user = await User.findOne({ email: "madhumita2@yopmail.com" });
    user.isEmailVerified = true;
    await user.save();
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "madhumita2@yopmail.com",
      password: "Madhumita@123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken
  });

  it("should get user profile", async () => {
    const res = await request(app)
      .get("/api/v1/user/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update profile", async () => {
    const res = await request(app)
      .patch("/api/v1/user/profile")
      .send({
        name: "Madhumita update",
        phone: "8029384794"
      })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should create new accesstoken by refreshtoken", async()=>{
    const res = await request(app).post("/api/v1/auth/refresh-token").set("Authorization", `Bearer ${refreshToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    accessToken = res.body.accessToken

  })
});
