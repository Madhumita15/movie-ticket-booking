const httpStatusCode = require("../utils/httpStatusCode");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

class AuthMiddleware {
  static async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer ")) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Token not provided",
        });
      }
      const cleanToken = token.split(" ")[1];
      const decode = jwt.verify(cleanToken, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decode._id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = {
        role: user.role,
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      next();
    } catch (error) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Expire or invalid token",
      });
    }
  }

  static rolecheck(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(httpStatusCode.FORBIDDEN).json({
          success: false,
          message: "Access Denied",
        });
      }

      next()
    };
  }
}

module.exports = AuthMiddleware;
