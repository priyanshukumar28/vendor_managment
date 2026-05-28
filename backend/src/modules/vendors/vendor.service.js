const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Throw a shaped error that the controller can forward as-is.
 * @param {string} message
 * @param {number} statusCode
 */
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Assert the vendor exists; throw 404 if not.
 * @param {string} id
 * @returns {Promise<Object>} Prisma vendor record
 */
const findVendorOrFail = async (id) => {
  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) {
    throw createError(`Vendor with ID "${id}" not found.`, 404);
  }
  return vendor;
};

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Create a new vendor.
 * Enforces unique email constraint at the service layer so we can return
 * a human-friendly 409 instead of a raw Prisma error.
 *
 * @param {{ name: string, email: string }} data
 * @returns {Promise<Object>} Created vendor
 */
const createVendor = async ({ name, email }) => {

  //Check existing vendor
  const existing = await prisma.vendor.findFirst({ where: {
     email 
    } 
  });

  if (existing) {
    throw createError("A vendor with this email already exists.", 409);
  }

  // Generate Vendor Display ID
  const vendorCount = await prisma.vendor.count();

  const vendorDisplayID =
    `AA-VEN-${String(vendorCount + 1).padStart(4, "0")}`;

  // Generate Vendor Code
  const vendorCode = name
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();

    // Create Vendor
  
  const vendor = await prisma.vendor.create({
    data: { 
      name, 
      email,

      vendorDisplayID,
      vendorCode,
     },
  });

  return vendor;
};

// ─── Get All ──────────────────────────────────────────────────────────────────

/**
 * Retrieve a paginated, optionally filtered list of vendors.
 *
 * @param {Object} options
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string} [options.search]       - Partial match on name or email
 * @param {string} [options.sortBy='createdAt']
 * @param {string} [options.sortOrder='desc']
 * @returns {Promise<{ vendors: Object[], total: number, page: number, limit: number, totalPages: number }>}
 */
const getAllVendors = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.vendor.count({ where }),
  ]);

  return {
    vendors,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// ─── Get By ID ────────────────────────────────────────────────────────────────

/**
 * Retrieve a single vendor by ID.
 *
 * @param {string} id
 * @returns {Promise<Object>} Vendor record
 */
const getVendorById = async (id) => {
  return findVendorOrFail(id);
};

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update a vendor's name and/or email.
 * Checks for email uniqueness if a new email is supplied.
 *
 * @param {string} id
 * @param {{ name?: string, email?: string }} data
 * @returns {Promise<Object>} Updated vendor
 */
const updateVendor = async (id, data) => {
  // Will throw 404 if the vendor doesn't exist
  await findVendorOrFail(id);

  // If a new email is supplied, ensure it's not already taken by another vendor
  if (data.email) {
    const conflict = await prisma.vendor.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });
    if (conflict) {
      throw createError("Another vendor with this email already exists.", 409);
    }
  }

  const updated = await prisma.vendor.update({
    where: { id },
    data,
  });

  return updated;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Soft-delete is not implemented in the current schema, so this is a hard delete.
 * Will throw 404 if the vendor doesn't exist.
 *
 * @param {string} id
 * @returns {Promise<Object>} Deleted vendor record
 */
const deleteVendor = async (id) => {
  await findVendorOrFail(id);

  const deleted = await prisma.vendor.delete({ where: { id } });
  return deleted;
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};