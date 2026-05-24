const ROLES = Object.freeze({
  SUPER_ADMIN: "SUPER_ADMIN",
  VENDOR_ADMIN: "VENDOR_ADMIN",
  DEVELOPER: "DEVELOPER",
});

const ROLE_VALUES = Object.values(ROLES);

module.exports = { ROLES, ROLE_VALUES };