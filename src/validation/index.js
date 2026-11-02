const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinary.config");

class Validation {
  static validate(schema) {
    return async (req, res, next) => {
      // Parse JSON fields only when they are provided
      req.body = req.body || {}
      if (req.body.genre || req.body.cast) {
        try {
          if (typeof req.body.genre === "string") {
            req.body.genre = JSON.parse(req.body.genre);
          }

          if (typeof req.body.cast === "string") {
            req.body.cast = JSON.parse(req.body.cast);
          }
        } catch {
          return res.status(400).json({
            success: false,
            message: "genre or cast must be an array of string",
          });
        }
      }
      const { error, value } = schema.validate(req.body, {
        abortEarly: true,
        stripUnknown: false,
      });
      if (error) {
        try {
          console.log("validation error");
          if (req.file) {
            console.log(req.file.filename);
            await cloudinary.uploader.destroy(req.file.filename);
          }
        } catch (error) {
          console.log(error);
        }

        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          errors: error.details.map((err) => ({
            field: err.path.join("."),
            error: err.message,
          })),
        });
      }

      req.body = value;
      next();
    };
  }
}

module.exports = Validation;
