const userService = require("./user.service");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const handleError = (res, error, context) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[UserController] ${context}:`, error);
  }
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "An unexpected error occurred.",
  });
};

// ─── Create User ──────────────────────────────────────────────────────────────

/**
 * POST /api/users
 *
 * SUPER_ADMIN  → create VENDOR_ADMIN or DEVELOPER (any vendor)
 * VENDOR_ADMIN → create DEVELOPER (own vendor only, auto-scoped)
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, vendorId } = req.body;
    const user = await userService.createUser(
      { name, email, password, role, vendorId },
      req.user
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: { user },
    });
  } catch (error) {
    return handleError(res, error, "createUser");
  }
};

// ─── Get All Users ────────────────────────────────────────────────────────────

/**
 * GET /api/users
 *
 * SUPER_ADMIN  → all users, filterable by vendorId / role / search
 * VENDOR_ADMIN → only DEVELOPERs in their own vendor
 *
 * Query: page, limit, search, role, vendorId, sortBy, sortOrder
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role,
      vendorId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const result = await userService.getAllUsers(
      { page: Number(page), limit: Number(limit), search, role, vendorId, sortBy, sortOrder },
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: {
        users: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      },
    });
  } catch (error) {
    return handleError(res, error, "getAllUsers");
  }
};

// ─── Get User By ID ───────────────────────────────────────────────────────────

/**
 * GET /api/users/:id
 *
 * SUPER_ADMIN  → any user
 * VENDOR_ADMIN → only DEVELOPERs in their own vendor
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: { user },
    });
  } catch (error) {
    return handleError(res, error, "getUserById");
  }
};

// ─── Update User ──────────────────────────────────────────────────────────────

/**
 * PUT /api/users/:id
 *
 * SUPER_ADMIN  → update any VENDOR_ADMIN or DEVELOPER
 * VENDOR_ADMIN → update only DEVELOPERs in their own vendor
 */
const updateUser = async (req, res) => {
  try {
    const updateData = {};
    const { name, email, role, vendorId } = req.body;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (vendorId !== undefined) updateData.vendorId = vendorId;

    const user = await userService.updateUser(req.params.id, updateData, req.user);

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: { user },
    });
  } catch (error) {
    return handleError(res, error, "updateUser");
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────

/**
 * DELETE /api/users/:id
 *
 * SUPER_ADMIN  → delete any VENDOR_ADMIN or DEVELOPER
 * VENDOR_ADMIN → delete only DEVELOPERs in their own vendor
 */
const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data: { user },
    });
  } catch (error) {
    return handleError(res, error, "deleteUser");
  }
};

// ─── Get Users By Vendor ──────────────────────────────────────────────────────

/**
 * GET /api/users/vendor/:vendorId
 *
 * SUPER_ADMIN  → users for any vendor
 * VENDOR_ADMIN → only their own vendor (auto-enforced in service)
 */
const getUsersByVendor = async (req, res) => {
  try {
    const users = await userService.getUsersByVendor(req.params.vendorId, req.user);

    return res.status(200).json({
      success: true,
      message: "Vendor users retrieved successfully.",
      data: { users },
    });
  } catch (error) {
    return handleError(res, error, "getUsersByVendor");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByVendor,
};
