/**
 * Vendor module barrel — import everything from one place.
 *
 * Usage in app.js:
 *   const { vendorRouter } = require('./src/modules/vendor');
 *   app.use('/api/vendors', vendorRouter);
 */

const vendorRouter = require("./vendor.routes");
const vendorService = require("./vendor.service");
const vendorController = require("./vendor.controller");

module.exports = {
  vendorRouter,
  vendorService,
  vendorController,
};