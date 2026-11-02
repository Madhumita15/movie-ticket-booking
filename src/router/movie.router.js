const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const movieController = require("../controller/movie.controller");
const validation = require("../validation/index");
const movieValidation = require("../validation/movie.validation");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../utils/cloudinary");
const httpStatusCode = require("../utils/httpStatusCode");

const uploadMiddleware = (req, res, next) => {
  upload.single("poster_image")(req, res, (err) => {
    if (err) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: err.message || "Failed to upload image",
      });
    }
    next();
  });
};

router.post(
  "/movies",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("admin"),
  uploadMiddleware,
  validation.validate(movieValidation.movieCreation),
  asyncHandeler(movieController.createMovie),
);

router.get(
  "/movies",
  authMiddleware.verifyToken,
  asyncHandeler(movieController.getAllMovie),
);

router.get(
  "/movies/:id",
  authMiddleware.verifyToken,
  asyncHandeler(movieController.getMovieId),
);

router.put(
  "/movies/:id",
  authMiddleware.verifyToken,
  uploadMiddleware,
  validation.validate(movieValidation.movieCreation),
  asyncHandeler(movieController.updateMovie),
);

router.delete(
  "/movies/:id",
  authMiddleware.verifyToken,
  asyncHandeler(movieController.deleteMovie),
);
module.exports = router;
