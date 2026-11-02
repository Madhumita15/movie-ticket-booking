const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const theaterController = require("../controller/theater.controller");
const validation = require("../validation/index");
const theaterValidation = require("../validation/theater.validation");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/theaters",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("admin"),
  validation.validate(theaterValidation.theaterCreation),
  asyncHandeler(theaterController.createTheater),
);



router.get(
  "/theaters",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("admin"),
  asyncHandeler(theaterController.getAllTheater),
);
module.exports = router;