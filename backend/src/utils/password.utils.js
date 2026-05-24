const bcrypt = require("bcrypt");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

/**
 * Hash a plain-text password
 * @param {string} plainPassword - The raw password to hash
 * @returns {Promise<string>} The hashed password
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compare a plain-text password against a hashed password
 * @param {string} plainPassword - The raw password to check
 * @param {string} hashedPassword - The stored hash to compare against
 * @returns {Promise<boolean>} True if the passwords match
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Validate password strength
 * Returns an array of error messages; empty array means the password is valid.
 * @param {string} password - Password to validate
 * @returns {string[]} Array of validation error messages
 */
const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
};