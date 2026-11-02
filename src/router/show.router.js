const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const showController = require("../controller/show.controller");
const validation = require("../validation/index");
const showValidation = require("../validation/show.validation");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/shows",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("admin"),
  validation.validate(showValidation.showCreation),
  asyncHandeler(showController.createShow),
);


router.get(
  "/shows",
  authMiddleware.verifyToken,
  asyncHandeler(showController.getAllShow),
);

module.exports = router;
