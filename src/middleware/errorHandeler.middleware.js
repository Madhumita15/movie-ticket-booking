const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinary.config");


const errorHandeler = async (err, req, res, next) => {
  console.log("err", err)
  const statusCode = err.statusCode || httpStatusCode.SERVER_ERROR;
  if (err) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandeler;
