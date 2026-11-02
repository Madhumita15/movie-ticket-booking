const Joi = require("joi");

class TheaterValidation {
  static theaterCreation = Joi.object({
    theaterName: Joi.string().trim().required().messages({
      "string.empty": "Theater Name is required",
      "any.required": "Theater Name is required",
    }),
    location: Joi.string().trim().required().messages({
      "string.empty": " Location is required",
      "any.required": "Location is required",
    }),
    numberOfScreens: Joi.number().integer().min(1).required().messages({
      "number.base": "Number of screen must be a number",
      "number.integer": "Number must be an integer value",
      "number.min": "Number must be at least 1",
      "any.required": "Number of Screen is required",
    }),
  });
}
module.exports = TheaterValidation;
