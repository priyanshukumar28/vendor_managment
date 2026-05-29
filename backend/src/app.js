const cors = require("cors");
const express = require("express");

const { authRouter, authenticate, authorize, ROLES } = require("./modules/auth");
const { vendorRouter } = require("./modules/vendors");
const { userRouter } = require("./modules/users");
const { projectRouter } = require('./modules/projects');
const approvalRoutes = require('./modules/approvals/approval.routes')

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();


// ─── Global Middleware ─────────────────────────────

app.use(
  cors({
    origin:[
    process.env.FRONTEND_URL,
    "http://localhost:5173"
  ], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/projects', projectRouter);
app.use('/api/approvals', approvalRoutes);

// ─── Swagger ───────────────────────────────────────

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ─── API Routes ────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/users", userRouter);


// ─── Example Protected Routes ──────────────────────

// Any authenticated user
app.get("/api/dashboard", authenticate, (req, res) => {
  res.json({
    success: true,
    message: `Welcome, ${req.user.name}!`,
  });
});

// SUPER_ADMIN only
app.get(
  "/api/admin/users",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: "Super admin area.",
    });
  }
);

// SUPER_ADMIN + VENDOR_ADMIN
app.get(
  "/api/vendor/settings",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.VENDOR_ADMIN
  ),
  (req, res) => {
    res.json({
      success: true,
      message: "Vendor settings.",
    });
  }
);

// All roles
app.get(
  "/api/projects",
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.VENDOR_ADMIN,
    ROLES.DEVELOPER
  ),
  (req, res) => {
    res.json({
      success: true,
      message: "Projects list.",
    });
  }
);


// ─── Root Route ────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vendor Management API is running."
  });
});


// ─── Error Handler ─────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});


// ─── Server ────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;