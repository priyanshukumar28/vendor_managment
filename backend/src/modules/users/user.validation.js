const { body, param, query, validationResult } = require("express-validator");
const { ROLES } = require("./user.constants");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Create User ──────────────────────────────────────────────────────────────

const validateCreateUser = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters.")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Name can only contain letters, spaces, hyphens, and apostrophes."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/).withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character."),

  body("role")
    .notEmpty().withMessage("Role is required.")
    .isIn([ROLES.VENDOR_ADMIN, ROLES.DEVELOPER])
    .withMessage(`Role must be one of: ${ROLES.VENDOR_ADMIN}, ${ROLES.DEVELOPER}.`),

  body("vendorId")
    .optional({ nullable: true })
    .isString().withMessage("Vendor ID must be a string."),

  handleValidationErrors,
];

// ─── Update User ──────────────────────────────────────────────────────────────

const validateUpdateUser = [
  param("id")
    .notEmpty().withMessage("User ID is required."),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters.")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Name can only contain letters, spaces, hyphens, and apostrophes."),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn([ROLES.VENDOR_ADMIN, ROLES.DEVELOPER])
    .withMessage(`Role must be one of: ${ROLES.VENDOR_ADMIN}, ${ROLES.DEVELOPER}.`),

  body()
    .custom((_, { req }) => {
      const allowed = ["name", "email", "role", "vendorId"];
      const received = Object.keys(req.body);
      if (received.length === 0) throw new Error("At least one field must be provided.");
      const unknown = received.filter((k) => !allowed.includes(k));
      if (unknown.length > 0) throw new Error(`Unknown field(s): ${unknown.join(", ")}.`);
      return true;
    }),

  handleValidationErrors,
];

// ─── User ID param ────────────────────────────────────────────────────────────

const validateUserId = [
  param("id").notEmpty().withMessage("User ID is required."),
  handleValidationErrors,
];

// ─── Get All Users (query params) ─────────────────────────────────────────────

const validateGetAllUsers = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer.").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100.").toInt(),
  query("search").optional().trim().isLength({ max: 100 }).withMessage("Search must not exceed 100 characters."),
  query("role").optional().isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(", ")}.`),
  query("vendorId").optional().isString().withMessage("Vendor ID must be a string."),
  query("sortBy").optional().isIn(["name", "email", "role", "createdAt"]).withMessage("sortBy must be one of: name, email, role, createdAt."),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("sortOrder must be asc or desc."),
  handleValidationErrors,
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  validateGetAllUsers,
  handleValidationErrors,
};