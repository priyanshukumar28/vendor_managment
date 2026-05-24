/**
 * Auth module barrel — import everything from one place.
 *
 * Usage:
 *   const { authRouter, authenticate, authorize, ROLES } = require('./modules/auth');
 */

const authRouter = require("./auth.routes");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize, superAdminOnly, adminOnly, vendorScopeGuard } = require("../../middleware/role.middleware");
const { ROLES, ROLE_VALUES } = require("./auth.constants");
const authService = require("./auth.service");

module.exports = {
  authRouter,
  authenticate,
  authorize,
  superAdminOnly,
  adminOnly,
  vendorScopeGuard,
  ROLES,
  ROLE_VALUES,
  authService,
};