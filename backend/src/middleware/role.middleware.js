const { ROLES } = require("../modules/auth/auth.constants");

/**
 * Factory function — returns middleware that restricts access to the given roles.
 *
 * Usage:
 *   router.get('/admin', authenticate, authorize(ROLES.SUPER_ADMIN), handler)
 *   router.get('/shared', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN), handler)
 *
 * @param {...string} allowedRoles - One or more role strings that may access the route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.user.role}.`,
      });
    }

    next();
  };
};

/**
 * Convenience middleware — allows only SUPER_ADMIN.
 */
const superAdminOnly = authorize(ROLES.SUPER_ADMIN);

/**
 * Convenience middleware — allows SUPER_ADMIN and VENDOR_ADMIN.
 */
const adminOnly = authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN);

/**
 * Middleware that ensures the requesting user can only access resources
 * that belong to their own vendorId, unless they are a SUPER_ADMIN.
 */
const vendorScopeGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // Super admins bypass vendor scoping
  if (req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }

  const requestedVendorId =
    req.params.vendorId || req.body.vendorId || req.query.vendorId;

  if (requestedVendorId && requestedVendorId !== req.user.vendorId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access resources within your vendor.",
    });
  }

  next();
};

module.exports = {
  authorize,
  superAdminOnly,
  adminOnly,
  vendorScopeGuard,
};