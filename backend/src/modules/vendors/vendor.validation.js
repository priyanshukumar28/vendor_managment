const { body, param, query, validationResult } = require("express-validator");

/**
 * Reusable handler — sends 422 if any validation errors exist.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ─── Create Vendor ─────────────────────────────────────────────────────────────

const validateCreateVendor = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Vendor name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Vendor name must be between 2 and 100 characters.")
    .matches(/^[a-zA-Z0-9\s\-_&.,()]+$/)
    .withMessage("Vendor name contains invalid characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Vendor email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  handleValidationErrors,
];

// ─── Update Vendor ─────────────────────────────────────────────────────────────

const validateUpdateVendor = [
  param("id")
    .notEmpty()
    .withMessage("Vendor ID is required.")
    .isString()
    .withMessage("Vendor ID must be a string."),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Vendor name must be between 2 and 100 characters.")
    .matches(/^[a-zA-Z0-9\s\-_&.,()]+$/)
    .withMessage("Vendor name contains invalid characters."),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body()
    .custom((_, { req }) => {
      const allowed = ["name", "email"];
      const received = Object.keys(req.body);
      if (received.length === 0) {
        throw new Error("At least one field (name or email) must be provided for update.");
      }
      const unknown = received.filter((k) => !allowed.includes(k));
      if (unknown.length > 0) {
        throw new Error(`Unknown field(s): ${unknown.join(", ")}.`);
      }
      return true;
    }),

  handleValidationErrors,
];

// ─── Vendor ID param ───────────────────────────────────────────────────────────

const validateVendorId = [
  param("id")
    .notEmpty()
    .withMessage("Vendor ID is required.")
    .isString()
    .withMessage("Vendor ID must be a string."),

  handleValidationErrors,
];

// ─── Get All Vendors (query params) ───────────────────────────────────────────

const validateGetAllVendors = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer.")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100.")
    .toInt(),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term must not exceed 100 characters."),

  query("sortBy")
    .optional()
    .isIn(["name", "email", "createdAt", "updatedAt"])
    .withMessage("sortBy must be one of: name, email, createdAt, updatedAt."),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc."),

  handleValidationErrors,
];

module.exports = {
  validateCreateVendor,
  validateUpdateVendor,
  validateVendorId,
  validateGetAllVendors,
  handleValidationErrors,
};