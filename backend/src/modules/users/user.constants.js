const ROLES = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
  VENDOR_ADMIN: "VENDOR_ADMIN",
  DEVELOPER: "DEVELOPER",
  BUSINESS_APPROVER: "BUSINESS_APPROVER",
});

/**
 * Defines which roles a given caller is allowed to create.
 *
 * SUPER_ADMIN  → can create VENDOR_ADMIN and DEVELOPER
 * VENDOR_ADMIN → can create DEVELOPER only (within own vendor)
 * DEVELOPER    → cannot create any user
 */
const CREATABLE_ROLES = Object.freeze({
  [ROLES.SUPER_ADMIN]: [
    ROLES.SUPER_ADMIN,
    ROLES.VENDOR_ADMIN,
    ROLES.DEVELOPER,
    ROLES.BUSINESS_APPROVER,
  ],

  [ROLES.VENDOR_ADMIN]: [
    ROLES.DEVELOPER,
  ],

  [ROLES.DEVELOPER]: [],

  [ROLES.BUSINESS_APPROVER]: [],
});

module.exports = { ROLES, CREATABLE_ROLES };