const express = require("express");
const userController = require("./user.controller");
const {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  validateGetAllUsers,
} = require("./user.validation");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");
const { ROLES } = require("./user.constants");

const router = express.Router();

// All user-management routes require a valid JWT
router.use(authenticate);

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @route  POST /api/users
 * @desc   Create a new user (VENDOR_ADMIN or DEVELOPER)
 * @access SUPER_ADMIN → VENDOR_ADMIN or DEVELOPER
 *         VENDOR_ADMIN → DEVELOPER only (own vendor, auto-scoped)
 */
router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateCreateUser,
  userController.createUser
);

/**
 * @route  GET /api/users
 * @desc   List users (scoped by caller's role)
 * @access SUPER_ADMIN → all users
 *         VENDOR_ADMIN → DEVELOPERs in own vendor only
 */
router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateGetAllUsers,
  userController.getAllUsers
);

/**
 * @route  GET /api/users/vendor/:vendorId
 * @desc   Get all users belonging to a specific vendor
 * @access SUPER_ADMIN → any vendor
 *         VENDOR_ADMIN → own vendor only
 *
 * NOTE: must be declared BEFORE /:id to avoid "vendor" being matched as an ID
 */
router.get(
  "/vendor/:vendorId",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  userController.getUsersByVendor
);

/**
 * @route  GET /api/users/:id
 * @desc   Get a single user by ID
 * @access SUPER_ADMIN → any user
 *         VENDOR_ADMIN → DEVELOPERs in own vendor only
 */
router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateUserId,
  userController.getUserById
);

/**
 * @route  PUT /api/users/:id
 * @desc   Update a user's name, email, or role
 * @access SUPER_ADMIN → any VENDOR_ADMIN or DEVELOPER
 *         VENDOR_ADMIN → DEVELOPERs in own vendor only
 */
router.put(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateUpdateUser,
  userController.updateUser
);

/**
 * @route  DELETE /api/users/:id
 * @desc   Delete a user
 * @access SUPER_ADMIN → any VENDOR_ADMIN or DEVELOPER
 *         VENDOR_ADMIN → DEVELOPERs in own vendor only
 */
router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateUserId,
  userController.deleteUser
);

module.exports = router;