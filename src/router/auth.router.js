const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const authController = require("../controller/auth.controller");
const validation = require("../validation/index");
const authValidation = require("../validation/auth.validation");

router.post(
  "/register",
  validation.validate(authValidation.register),
  asyncHandeler(authController.register),
);
router.post(
  "/login",
  validation.validate(authValidation.login),
  asyncHandeler(authController.login),
);
router.post(
  "/verify-email",
  validation.validate(authValidation.verifyEmail),
  asyncHandeler(authController.verifyEmail),
);

module.exports = router;
