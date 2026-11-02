const express = require("express");
const router = express.Router();
const asyncHandeler = require("../middleware/asyncHandeler.middleware");
const bookingController = require("../controller/booking.controller");
const validation = require("../validation/index");
const bookingValidation = require("../validation/booking.validation");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/bookings",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("user"),
  validation.validate(bookingValidation.bookingCreation),
  asyncHandeler(bookingController.createBooking),
);

router.patch(
  "/bookings/:id",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("user"),
  validation.validate(bookingValidation.bookingCancel),
  asyncHandeler(bookingController.cancelBooking),
);

router.get(
  "/admin/bookings",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("admin"),
  asyncHandeler(bookingController.getAllBookingHistoryByAdmin),
);

router.get(
  "/user/bookings",
  authMiddleware.verifyToken,
  authMiddleware.rolecheck("user"),
  asyncHandeler(bookingController.getAllBookingHistoryByUserId),
);

module.exports = router;
