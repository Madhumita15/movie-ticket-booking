const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const userController = require("../controller/user.controller");
const validation = require("../validation/index");
const userValidation = require("../validation/auth.validation");
const AuthMiddleware = require("../middleware/auth.middleware");
const upload = require('../utils/cloudinary')
const httpStatusCode = require("../utils/httpStatusCode");


const uploadMiddleware = (req, res, next)=>{
    upload.single('profile_image')(req, res, (err)=>{
        if(err){
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                message: err.message || "Failed to upload image"
            })

        }
        next()
    })
}


/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: get user profile
 *     tags:
 *       - Authenticated User
 *     security:
 *       - AccessTokenAuth: []
 *     responses:
 *       200:
 *         description: User get successfully
 *       500:
 *         description: Internal Server Error
 */
router.get(
  "/user/profile",
  AuthMiddleware.verifyToken,
  asyncHandeler(userController.getProfile),
);



/**
 * @swagger
 * /api/v1/user/profile:
 *   patch:
 *     summary: Update User Profile
 *     tags:
 *       - Authenticated User  
 *     security:
 *       - AccessTokenAuth: []  
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
 *               phone:
 *                 type: string
 *                 required: true
 *               profile_image:
 *                 type: file
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error / Bad request
 *       401:
 *         description: Invalid or missing JWT
 *       404:
 *         description: User not fund 
 *       500:
 *         description: Internal Server Error
 */
router.patch(
  "/user/profile",
  AuthMiddleware.verifyToken,
  uploadMiddleware,
  validation.validate(userValidation.updateProfile),
  asyncHandeler(userController.updateProfile),
);

module.exports = router;
