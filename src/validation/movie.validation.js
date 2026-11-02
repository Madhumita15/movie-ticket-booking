const Joi = require("joi");

class MovieValidation {
  static movieCreation = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    director: Joi.string().trim().required().messages({
      "string.empty": "Director is required",
      "any.required": "Director is required",
    }),
    language: Joi.string().trim().required().messages({
      "string.empty": "Language is required",
      "any.required": "Language is required",
    }),
    duration: Joi.number().integer().min(1).required().messages({
      "number.base": "Duration is required",
      "number.integer": "Duration must be an integer value",
      "number.min": "Duration must be at least 1 minutes",
      "any.required": "Duration is required",
    }),
    releaseDate: Joi.date().required().messages({
      "date.base": "Release date must be a valid date",
      "any.required": "Release date is required",
    }),
    genre: Joi.array()
      .items(Joi.string().trim().required())
      .min(1)
      .required()
      .messages({
        "array.base": "Genre must be an array",
        "array.min": "At least one genre is required",
        "any.required": "Genre is required",
      }),
    cast: Joi.array()
      .items(Joi.string().trim().required())
      .min(1)
      .required()
      .messages({
        "array.base": "Cast must be an array",
        "array.min": "At least one cast is required",
        "any.required": "Cast is required",
      }),
  });
}

module.exports = MovieValidation;
