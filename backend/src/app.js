
const express = require("express");
const { authRouter, authenticate, authorize, ROLES } = require("./modules/auth");
const { vendorRouter } = require('./modules/vendors');
const { userRouter } = require('./modules/users');

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
// --- Vendor Routes ------//
app.use('/api/vendors', vendorRouter);
// -- User Routes ----//
app.use('/api/users', userRouter);

// ─── Example Protected Routes ─────────────────────────────────────────────────

// Any authenticated user
app.get("/api/dashboard", authenticate, (req, res) => {
  res.json({ success: true, message: `Welcome, ${req.user.name}!` });
});

// SUPER_ADMIN only
app.get(
  "/api/admin/users",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  (req, res) => {
    res.json({ success: true, message: "Super admin area." });
  }
);

// SUPER_ADMIN and VENDOR_ADMIN
app.get(
  "/api/vendor/settings",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN),
  (req, res) => {
    res.json({ success: true, message: "Vendor settings." });
  }
);

// All roles
app.get(
  "/api/projects",
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.VENDOR_ADMIN, ROLES.DEVELOPER),
  (req, res) => {
    res.json({ success: true, message: "Projects list." });
  }
);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Vendor Management API is running.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;