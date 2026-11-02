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

router.get(
  "/user/profile",
  AuthMiddleware.verifyToken,
  asyncHandeler(userController.getProfile),
);
router.patch(
  "/user/profile",
  AuthMiddleware.verifyToken,
  uploadMiddleware,
  validation.validate(userValidation.updateProfile),
  asyncHandeler(userController.updateProfile),
);

module.exports = router;
