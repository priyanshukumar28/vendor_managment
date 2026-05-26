const express = require("express");
const { register, login, getMe } = require("./auth.controller");
const { validateLogin, validateRegister } = require("./auth.validation");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/role.middleware");
const { ROLES } = require("./auth.constants");

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * @route  POST /api/auth/register
 * @desc   Register a new user (DEVELOPER role by default)
 * @access Public
 */
router.post("/register", validateRegister, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@test.com
 *
 *               password:
 *                 type: string
 *                 example: admin123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid credentials
 */




/**
 * @route  POST /api/auth/login
 * @desc   Authenticate credentials and receive JWT tokens
 * @access Public
 */
router.post("/login", validateLogin, login);

// ─── Protected Routes ─────────────────────────────────────────────────────────

/**
 * @route  GET /api/auth/me
 * @desc   Get the currently authenticated user's profile
 * @access Private — any authenticated user
 */
router.get("/me", authenticate, getMe);

// ─── Admin-Only Protected Routes ─────────────────────────────────────────────

/**
 * @route  POST /api/auth/register/admin
 * @desc   Create a privileged user (VENDOR_ADMIN or SUPER_ADMIN)
 *         Only an existing SUPER_ADMIN may call this route.
 * @access Private — SUPER_ADMIN only
 */
router.post(
  "/register/admin",
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  validateRegister,
  register
);

module.exports = router;