const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const authController = require("../controller/auth.controller");
const validation = require("../validation/index");
const authValidation = require("../validation/auth.validation");
const authMiddleware = require('../middleware/auth.middleware')

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Sign Up
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Madhumita Das
 *               email:
 *                 type: string
 *                 format: email
 *                 example: madhumita@gmail.com
 *               phone:
 *                 type: string
 *                 example: 8739274938
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Madhumita@123
 *     responses:
 *       201:
 *         description: User Registerd successfully And otp send to your email
 *       400:
 *         description: Validation error / Bad request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/register",
  validation.validate(authValidation.register),
  asyncHandeler(authController.register),
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "madhumita@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Madhumita@123"
 *     responses:
 *       200:
 *         description: login successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad Request/Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/login",
  validation.validate(authValidation.login),
  asyncHandeler(authController.login),
);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: verify-email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "madhumita@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "8394"
 *     responses:
 *       200:
 *         description: login successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/verify-email",
  validation.validate(authValidation.verifyEmail),
  asyncHandeler(authController.verifyEmail),
);




/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: refresh-token
 *     tags:
 *       - Authentication
 *     security:
 *       - RefreshTokenAuth: []
 *     responses:
 *       200:
 *         description: New Access Token generate successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/refresh-token", asyncHandeler(authController.refreshToken))

module.exports = router;
