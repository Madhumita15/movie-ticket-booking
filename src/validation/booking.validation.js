const Joi = require("joi");

class BookingValidation {
  static bookingCreation = Joi.object({
    showId: Joi.string().length(24).hex().required().messages({
      "string.empty": "Show ID is required",
      "string.length": "Show ID must be a valid MongoDB ObjectId",
      "string.hex": "Show ID must contain hexadecimal characters",
      "any.required": "Show ID is required",
    }),

    numberOfTicket: Joi.number().integer().min(1).required().messages({
      "number.base": "Number of tickets must be a number",
      "number.integer": "Number of tickets must be an integer",
      "number.min": "You must book at least 1 ticket",
      "any.required": "Number of tickets is required",
    }),
  });

  static bookingCancel = Joi.object({
    status: Joi.string().valid("confirmed", "cancelled").required().messages({
      "string.empty": "Booking status is required",
      "any.only": "Status must be either confirmed or cancelled",
      "any.required": "Booking status is required",
    }),
  });
}

module.exports = BookingValidation;
