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




/**
 * @swagger
 * /api/v1/movies:
 *   post:
 *     summary: Admin create  movie
 *     tags:
 *       - Admin  
 *     security:
 *       - BearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - genre
 *               - cast
 *               - releaseDate
 *               - duration
 *               - director
 *               - language
 *               - poster_image
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               genre:
 *                 type: string
 *                 description: JSON string representing an array of genres
 *                 example: '["genr1","genr6"]'
 *               cast:
 *                 type: string
 *                 description: JSON string representing an array of cast
 *                 example: '["cast1","cast2"]'
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 required: true
 *               duration:
 *                 type: number
 *                 required: true
 *               director:
 *                 type: string
 *                 required: true
 *               language:
 *                 type: string
 *                 required: true
 *               poster_image:
 *                 type: file
 *     responses:
 *       201:
 *         description: Movie create successfully
 *       400:
 *         description: Validation error / Bad request
 *       401:
 *         description: Invalid or missing JWT
 *       403:
 *         description: User is not an admin
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/movies",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("admin"),
  uploadMiddleware,
  validation.validate(movieValidation.movieCreation),
  asyncHandeler(movieController.createMovie),
);




/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: get all movies
 *     tags:
 *       - Authenticated User
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: Movie gets successfully
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/movies",
  authMiddleware.verifyToken,
  asyncHandeler(movieController.getAllMovie),
);



/**
 * @swagger
 * /api/v1/movies/{id}:
 *   get:
 *     summary: get movie by id
 *     tags:
 *       - Authenticated User
 *     security:
 *       - AccessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true 
 *         description: movieId
 *         schema:
 *           type: string
 *           example: 672abc1234567890abcdef12
 *     responses:
 *       200:
 *         description: Movie get successfully
 *       404:
 *         description: Movie not found  
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/movies/:id",
  authMiddleware.verifyToken,
  asyncHandeler(movieController.getMovieId),
);




/**
 * @swagger
 * /api/v1/movies/{id}:
 *   put:
 *     summary: Admin update movie
 *     tags:
 *       - Admin  
 *     security:
 *       - AccessTokenAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: movieId
 *         schema:
 *           type: string
 *           example: 672abc1234567890abcdef12
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               genre:
 *                 type: string
 *                 description: JSON string representing an array of genres
 *                 example: '["genr1","genr6"]'
 *               cast:
 *                 type: string
 *                 description: JSON string representing an array of cast
 *                 example: '["cast1","cast2"]'
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 required: true
 *               duration:
 *                 type: number
 *                 required: true
 *               director:
 *                 type: string
 *                 required: true
 *               language:
 *                 type: string
 *                 required: true
 *               poster_image:
 *                 type: file
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error / Bad request
 *       401:
 *         description: Invalid or missing JWT
 *       403:
 *         description: User is not an admin
 *       404:
 *         description: User not fund 
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/movies/:id",
  authMiddleware.verifyToken,
  uploadMiddleware,
  validation.validate(movieValidation.movieCreation),
  asyncHandeler(movieController.updateMovie),
);



/**
 * @swagger
 * /api/v1/movies/{id}:
 *   delete:
 *     summary: Admin deleted movie
 *     tags:
 *       - Admin  
 *     security:
 *       - AccessTokenAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: userId
 *         schema:
 *           type: string
 *           example: 672abc1234567890abcdef12
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       401:
 *         description: Invalid or missing JWT
 *       403:
 *         description: User is not an admin
 *       404:
 *         description: User not fund 
 *       500:
 *         description: Internal Server Error
 */
router.delete(
  "/movies/:id",
  authMiddleware.verifyToken,
  asyncHandeler(movieController.deleteMovie),
);
module.exports = router;
