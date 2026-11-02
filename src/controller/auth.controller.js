const {
  registerService,
  emailVerifyService,
  loginService,
} = require("../service/auth.service");
const httpStatusCode = require("../utils/httpStatusCode");

class AuthController {
  async register(req, res) {
    const { name, email, phone, password } = req.body;
    await registerService({ name, email, password, phone });
    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "User created successfully and send otp to your email",
    });
  }

  async verifyEmail(req, res) {
    const { otp, email } = req.body;
    await emailVerifyService({ otp, email });
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Email verified successfully!",
    });
  }

  
  async login(req, res) {
    const { email, password } = req.body;
    const { token, user } = await loginService({ email, password });
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Login successfully!",
      token: token,
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
      },
    });
  }
}

module.exports = new AuthController();
