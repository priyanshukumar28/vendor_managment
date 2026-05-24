const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../../utils/password.utils");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt.utils");
const { ROLES } = require("./auth.constants");

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build the JWT payload from a user record.
 * Keep it small — never include the password hash.
 */
const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  vendorId: user.vendorId || null,
});

/**
 * Strip the password from the user object before returning it to the client.
 */
const sanitizeUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser;
};

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 *
 * Business rules enforced here (not in the controller):
 *  - Duplicate email → 409
 *  - VENDOR_ADMIN / DEVELOPER must supply a vendorId
 *  - Only a SUPER_ADMIN may create another SUPER_ADMIN (pass callerRole when known)
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.password  - Plain-text; will be hashed here
 * @param {string} [data.role]    - Defaults to DEVELOPER
 * @param {string} [data.vendorId]
 * @param {string} [callerRole]   - Role of the user making the request (if authenticated)
 * @returns {{ user: Object, accessToken: string, refreshToken: string }}
 */
const registerUser = async (data, callerRole = null) => {
  const {
    name,
    email,
    password,
    role = ROLES.DEVELOPER,
    vendorId = null,
  } = data;

  // Only SUPER_ADMINs can create another SUPER_ADMIN
  if (role === ROLES.SUPER_ADMIN && callerRole !== ROLES.SUPER_ADMIN) {
    const error = new Error("Only a SUPER_ADMIN can create another SUPER_ADMIN account.");
    error.statusCode = 403;
    throw error;
  }

  // VENDOR_ADMIN and DEVELOPER must belong to a vendor
  if ((role === ROLES.VENDOR_ADMIN || role === ROLES.DEVELOPER) && !vendorId) {
    const error = new Error(`A vendorId is required for the ${role} role.`);
    error.statusCode = 400;
    throw error;
  }

  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Persist
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      vendorId,
    },
  });

  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Authenticate a user with email + password.
 *
 * @param {string} email
 * @param {string} password - Plain-text password submitted by the user
 * @returns {{ user: Object, accessToken: string, refreshToken: string }}
 */
const loginUser = async (email, password) => {
  // Use a generic error for both "not found" and "wrong password"
  // to avoid leaking whether an email exists in the system.
  const invalidError = new Error("Invalid email or password.");
  invalidError.statusCode = 401;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw invalidError;

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw invalidError;

  const payload = buildTokenPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * Fetch the current authenticated user's profile.
 * @param {string} userId
 * @returns {Object} Sanitized user record
 */
const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      vendorId: true,
    },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};