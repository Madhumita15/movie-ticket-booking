const Joi = require("joi");

class ShowValidation {
  static showCreation = Joi.object({
    movieId: Joi.string().required().messages({
      "string.empty": "Movie id is required",
      "any.required": "Movie id is required",
    }),
    theaterId: Joi.string().required().messages({
      "string.empty": "Movie id is required",
      "any.required": "Movie id is required",
    }),
    screenNumber: Joi.number().integer().min(1).required().messages({
      "number.base": "Screen Number must be a number",
      "number.integer": "Number must be an integer value",
      "number.min": "Number must be at least 1",
      "any.required": "Number of Screen is required",
    }),
    showTiming: Joi.date().required().messages({
      "date.base": "showTiming must be a valid date",
      "any.required": "showTiming date is required",
    }),
    totalSeats: Joi.number().integer().min(1).required().messages({
      "number.base": "TotalSeats must be a number",
      "number.integer": "TotalSeats must be an integer value",
      "number.min": "TotalSeats must be at least 1",
      "any.required": "TotalSeats is required",
    }),
  });
}

module.exports = ShowValidation;
