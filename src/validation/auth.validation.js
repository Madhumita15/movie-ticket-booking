const joi = require("joi");

class AuthSchemaValidation {
  static register = joi.object({
    name: joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    password: joi.string().trim().min(6).max(15).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6",
      "string.max": "Password should not exceed 15",
      "any.required": "Password is required",
    }),
    phone: joi
      .string()
      .trim()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.empty": "Phone No is required",
        "string.pattern.base": "Please provide a 10 digit mobile number",
        "any.required": "Phone No is required",
      }),
    role: joi.string().valid("user", "admin").optional().messages({
      "any.only": "Role must be one of user, admin, writer",
    }),
  });

  static login = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    password: joi.string().trim().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });

  static verifyEmail = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    otp: joi.string().min(4).max(4).required().messages({
      "string.empty": "otp is required",
      "string.min": "otp must be at least 4 digits",
      "string.max": "otp should not exceed 4 digits",
      "any.required": "otp is required",
    }),
  });

  static forgotPasswordLink = joi.object({
    email: joi.string().trim().email().required().messages({
      "string.required": "Email is required",
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
  });

  static forgetPassword = joi.object({
    newPassword: joi.string().trim().min(6).max(15).required().messages({
      "string.required": "New password is required",
      "string.min": "New password must be at least 6 characters",
      "string.max": "New password cannot exceed 15 characters",
      "any.required": "New password is required",
    }),
    confirmPassword: joi.string().trim().required().messages({
      "string.required": "Confirm password is required",
      "any.required": "Confirm password is required",
    }),
  });

  static updateProfile = joi.object({
    name: joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    phone: joi
      .string()
      .trim()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.empty": "Phone No is required",
        "string.pattern.base": "Please provide a 10 digit mobile number",
        "any.required": "Phone No is required",
      }),
  });
}
module.exports = AuthSchemaValidation;
