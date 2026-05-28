const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../../utils/password.utils");
const { ROLES, CREATABLE_ROLES } = require("./user.constants");

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const sanitizeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

const findUserOrFail = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw createError(`User with ID "${id}" not found.`, 404);
  return user;
};

/**
 * Core permission check — can `caller` manage `targetRole`?
 *
 * Rules enforced:
 *  - SUPER_ADMIN can manage VENDOR_ADMIN and DEVELOPER (anyone except other SUPER_ADMINs)
 *  - VENDOR_ADMIN can only manage DEVELOPERs inside their own vendor
 *  - DEVELOPER cannot manage anyone
 *
 * @param {Object} caller      - req.user (authenticated user)
 * @param {string} targetRole  - Role of the user being created / edited / deleted
 * @param {string} targetVendorId - vendorId of the user being affected
 */
const assertCanManage = (caller, targetRole, targetVendorId = null) => {
  const allowed = CREATABLE_ROLES[caller.role] || [];

  if (!allowed.includes(targetRole)) {
    throw createError(
      `Your role (${caller.role}) is not permitted to manage users with role ${targetRole}.`,
      403
    );
  }

  // VENDOR_ADMIN can only manage users within their own vendor
  if (caller.role === ROLES.VENDOR_ADMIN) {
    if (!caller.vendorId) {
      throw createError("Your account is not associated with a vendor.", 403);
    }
    if (targetVendorId && targetVendorId !== caller.vendorId) {
      throw createError("You can only manage users within your own vendor.", 403);
    }
  }
};

// ─── Create User ──────────────────────────────────────────────────────────────

/**
 * Create a new user.
 *
 * Business rules:
 *  - Caller's role must permit creating `role` (see CREATABLE_ROLES)
 *  - VENDOR_ADMIN can only create DEVELOPERs in their own vendor
 *  - DEVELOPER role required a vendorId
 *  - Email must be unique
 *
 * @param {Object} data   - { name, email, password, role, vendorId }
 * @param {Object} caller - req.user
 */
const createUser = async ({ name, email, password, role, vendorId }, caller) => {
  // Resolve vendorId: VENDOR_ADMIN always scopes to their own vendor
  const resolvedVendorId =
    caller.role === ROLES.VENDOR_ADMIN ? caller.vendorId : vendorId || null;

  assertCanManage(caller, role, resolvedVendorId);

  // VENDOR_ADMIN and DEVELOPER must belong to a vendor
  if ((role === ROLES.VENDOR_ADMIN || role === ROLES.DEVELOPER) && !resolvedVendorId) {
    throw createError(`A vendorId is required when creating a ${role}.`, 400);
  }

  // Unique email check
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw createError("A user with this email already exists.", 409);

  const hashedPassword = await hashPassword(password);

  let employeeId = null;

// SUPER ADMIN
if (role === "SUPER_ADMIN") {

  const count = await prisma.user.count({
    where: {
      role: "SUPER_ADMIN"
    }
  });

  employeeId =
    `AA-SA-${String(count + 1).padStart(4, "0")}`;
}

// VENDOR ADMIN
if (role === "VENDOR_ADMIN") {

  const count = await prisma.user.count({
    where: {
      role: "VENDOR_ADMIN"
    }
  });

  employeeId =
    `AA-VA-${String(count + 1).padStart(4, "0")}`;
}

// DEVELOPER
if (role === "DEVELOPER") {

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorId
    }
  });

  const count = await prisma.user.count({
    where: {
      role: "DEVELOPER",
      vendorId
    }
  });

  employeeId =
    `AA-DEV-${vendor.vendorCode}-${String(count + 1).padStart(3, "0")}`;
}

const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role,
    vendorId,
    employeeId
  }
});

  return sanitizeUser(user);
};

// ─── Get All Users ────────────────────────────────────────────────────────────

/**
 * List users with pagination, filtering, and sorting.
 *
 * Scoping rules:
 *  - SUPER_ADMIN sees all users (can optionally filter by vendorId / role)
 *  - VENDOR_ADMIN sees only users in their own vendor
 *  - DEVELOPER has no access (blocked at route level)
 *
 * @param {Object} options
 * @param {Object} caller - req.user
 */
const getAllUsers = async (
  { page = 1, limit = 10, search = "", role, vendorId, sortBy = "createdAt", sortOrder = "desc" } = {},
  caller
) => {
  const skip = (page - 1) * limit;

  // Build the base "where" according to caller role
  let where = {};

  if (caller.role === ROLES.VENDOR_ADMIN) {
    // Hard-scope to caller's vendor; ignore any vendorId query param
    where.vendorId = caller.vendorId;
    // VENDOR_ADMIN should not see other VENDOR_ADMINs or SUPER_ADMINs
    where.role = ROLES.DEVELOPER;
  } else {
    // SUPER_ADMIN — optional filters
    if (vendorId) where.vendorId = vendorId;
    if (role) where.role = role;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        vendorId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ─── Get User By ID ───────────────────────────────────────────────────────────

/**
 * Get a single user by ID.
 *
 * Scoping rules:
 *  - SUPER_ADMIN can view any user
 *  - VENDOR_ADMIN can only view DEVELOPERs within their own vendor
 *
 * @param {string} id
 * @param {Object} caller - req.user
 */
const getUserById = async (id, caller) => {
  const user = await findUserOrFail(id);

  if (caller.role === ROLES.VENDOR_ADMIN) {
    if (user.vendorId !== caller.vendorId || user.role !== ROLES.DEVELOPER) {
      throw createError("You are not permitted to view this user.", 403);
    }
  }

  return sanitizeUser(user);
};

// ─── Update User ──────────────────────────────────────────────────────────────

/**
 * Update a user's name, email, or role.
 *
 * Permission checks:
 *  - Caller must be able to manage the target's current role
 *  - If role is being changed, caller must also be able to assign the new role
 *  - VENDOR_ADMIN can only update users within their own vendor
 *
 * @param {string} id
 * @param {Object} data   - Partial { name, email, role, vendorId }
 * @param {Object} caller - req.user
 */
const updateUser = async (id, data, caller) => {
  const target = await findUserOrFail(id);

  // Verify caller can manage the target's current role
  assertCanManage(caller, target.role, target.vendorId);

  // If role is changing, also verify caller can assign the new role
  if (data.role && data.role !== target.role) {
    assertCanManage(caller, data.role, target.vendorId);
  }

  // Prevent email conflicts
  if (data.email && data.email !== target.email) {
    const conflict = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (conflict) throw createError("Another user with this email already exists.", 409);
  }

  // VENDOR_ADMIN cannot change a user's vendorId
  if (caller.role === ROLES.VENDOR_ADMIN && data.vendorId) {
    throw createError("You are not permitted to change a user's vendor.", 403);
  }

  const updated = await prisma.user.update({ where: { id }, data });
  return sanitizeUser(updated);
};

// ─── Delete User ──────────────────────────────────────────────────────────────

/**
 * Delete a user.
 *
 * Permission checks:
 *  - SUPER_ADMIN can delete VENDOR_ADMIN and DEVELOPER
 *  - VENDOR_ADMIN can only delete DEVELOPERs within their own vendor
 *  - A user cannot delete themselves
 *
 * @param {string} id
 * @param {Object} caller - req.user
 */
const deleteUser = async (id, caller) => {
  const target = await findUserOrFail(id);

  if (target.id === caller.id) {
    throw createError("You cannot delete your own account.", 400);
  }

  assertCanManage(caller, target.role, target.vendorId);

  const deleted = await prisma.user.delete({ where: { id } });
  return sanitizeUser(deleted);
};

// ─── Get Users By Vendor ──────────────────────────────────────────────────────

/**
 * Get all users belonging to a specific vendor.
 * VENDOR_ADMIN is hard-scoped to their own vendorId.
 *
 * @param {string} vendorId
 * @param {Object} caller - req.user
 */
const getUsersByVendor = async (vendorId, caller) => {
  if (caller.role === ROLES.VENDOR_ADMIN && caller.vendorId !== vendorId) {
    throw createError("You can only view users within your own vendor.", 403);
  }

  const users = await prisma.user.findMany({
    where: { vendorId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      vendorId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByVendor,
};