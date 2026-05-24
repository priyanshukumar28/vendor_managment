const express = require("express");
const vendorController = require("./vendor.controller");
const {
  validateCreateVendor,
  validateUpdateVendor,
  validateVendorId,
  validateGetAllVendors,
} = require("./vendor.validation");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");
const { ROLES } = require("../auth/auth.constants");

const router = express.Router();

// All vendor routes require a valid JWT — apply once at the top
router.use(authenticate);

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @route  POST /api/vendors
 * @desc   Create a new vendor
 * @access SUPER_ADMIN only
 */
router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validateCreateVendor,
  vendorController.createVendor
);

/**
 * @route  GET /api/vendors
 * @desc   Get all vendors (paginated, searchable, sortable)
 * @access SUPER_ADMIN, VENDOR_ADMIN
 */
router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateGetAllVendors,
  vendorController.getAllVendors
);

/**
 * @route  GET /api/vendors/:id
 * @desc   Get a single vendor by ID
 * @access SUPER_ADMIN, VENDOR_ADMIN
 */
router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  validateVendorId,
  vendorController.getVendorById
);

/**
 * @route  PUT /api/vendors/:id
 * @desc   Update a vendor's name and/or email
 * @access SUPER_ADMIN only
 */
router.put(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validateUpdateVendor,
  vendorController.updateVendor
);

/**
 * @route  DELETE /api/vendors/:id
 * @desc   Permanently delete a vendor
 * @access SUPER_ADMIN only
 */
router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validateVendorId,
  vendorController.deleteVendor
);

module.exports = router;