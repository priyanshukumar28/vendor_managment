const vendorService = require("./vendor.service");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Central error responder — reads statusCode off the error if present,
 * falls back to 500, and logs the full error in non-production environments.
 */
const handleError = (res, error, context) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[VendorController] ${context}:`, error);
  }
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || "An unexpected error occurred.",
  });
};

// ─── Create Vendor ─────────────────────────────────────────────────────────────

/**
 * POST /api/vendors
 * Access: SUPER_ADMIN only
 */
const createVendor = async (req, res) => {
  try {
    const { name, email } = req.body;
    const vendor = await vendorService.createVendor({ name, email });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully.",
      data: { vendor },
    });
  } catch (error) {
    return handleError(res, error, "createVendor");
  }
};

// ─── Get All Vendors ───────────────────────────────────────────────────────────

/**
 * GET /api/vendors
 * Access: SUPER_ADMIN, VENDOR_ADMIN
 *
 * Query params:
 *   page       {number}  default 1
 *   limit      {number}  default 10, max 100
 *   search     {string}  partial match on name / email
 *   sortBy     {string}  name | email | createdAt | updatedAt  (default createdAt)
 *   sortOrder  {string}  asc | desc  (default desc)
 */
const getAllVendors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const result = await vendorService.getAllVendors({
      page: Number(page),
      limit: Number(limit),
      search,
      sortBy,
      sortOrder,
    });

    return res.status(200).json({
      success: true,
      message: "Vendors retrieved successfully.",
      data: {
        vendors: result.vendors,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    });
  } catch (error) {
    return handleError(res, error, "getAllVendors");
  }
};

// ─── Get Vendor By ID ──────────────────────────────────────────────────────────

/**
 * GET /api/vendors/:id
 * Access: SUPER_ADMIN, VENDOR_ADMIN
 */
const getVendorById = async (req, res) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Vendor retrieved successfully.",
      data: { vendor },
    });
  } catch (error) {
    return handleError(res, error, "getVendorById");
  }
};

// ─── Update Vendor ─────────────────────────────────────────────────────────────

/**
 * PUT /api/vendors/:id
 * Access: SUPER_ADMIN only
 */
const updateVendor = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Build the update payload from only fields that were provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const vendor = await vendorService.updateVendor(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully.",
      data: { vendor },
    });
  } catch (error) {
    return handleError(res, error, "updateVendor");
  }
};

// ─── Delete Vendor ─────────────────────────────────────────────────────────────

/**
 * DELETE /api/vendors/:id
 * Access: SUPER_ADMIN only
 */
const deleteVendor = async (req, res) => {
  try {
    const vendor = await vendorService.deleteVendor(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully.",
      data: { vendor },
    });
  } catch (error) {
    return handleError(res, error, "deleteVendor");
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};