const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * SUPER ADMIN ID
 * Format:
 * AA-SA-0001
 */
const generateSuperAdminId = async () => {
  const count = await prisma.user.count({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  return `AA-SA-${String(count + 1).padStart(4, "0")}`;
};

/**
 * VENDOR ADMIN ID
 * Format:
 * AA-VA-0001
 */
const generateVendorAdminId = async () => {
  const count = await prisma.user.count({
    where: {
      role: "VENDOR_ADMIN",
    },
  });

  return `AA-VA-${String(count + 1).padStart(4, "0")}`;
};

/**
 * VENDOR ID
 * Format:
 * AA-VEN-0001
 */
const generateVendorId = async () => {
  const count = await prisma.vendor.count();

  return `AA-VEN-${String(count + 1).padStart(4, "0")}`;
};

/**
 * DEVELOPER ID
 * Format:
 * AA-DEV-INF-001
 */
const generateDeveloperId = async (vendorCode) => {
  const count = await prisma.user.count({
    where: {
      role: "DEVELOPER",
      vendor: {
        vendorCode,
      },
    },
  });

  return `AA-DEV-${vendorCode}-${String(count + 1).padStart(3, "0")}`;
};

module.exports = {
  generateSuperAdminId,
  generateVendorAdminId,
  generateVendorId,
  generateDeveloperId,
};