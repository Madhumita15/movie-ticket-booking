const {
  registerService,
  emailVerifyService,
  loginService,
  refreshTokenService,
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
    const { accessToken, refreshToken, user } = await loginService({ email, password });
    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Login successfully!",
      accessToken: accessToken,
      refreshToken:refreshToken,
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
      },
    });
  }


  async refreshToken(req, res){
    const refreshToken = req.headers.authorization
    const accessToken = await refreshTokenService(refreshToken)
    return res.status(httpStatusCode.OK).json({
      success: true,
      accessToken: accessToken,
      message: "New accessToken generate successfully!"


    })
    
  }
}

module.exports = new AuthController();
