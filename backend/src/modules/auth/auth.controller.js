const { registerUser, loginUser, getCurrentUser } = require("./auth.service");

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 *
 * Public endpoint — creates a new user account.
 * If called by an authenticated SUPER_ADMIN the caller's role is forwarded
 * to auth.service so it can unlock SUPER_ADMIN creation.
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, vendorId } = req.body;

    // callerRole is present only when an authenticated user hits this route
    const callerRole = req.user ? req.user.role : null;

    const { user, accessToken, refreshToken } = await registerUser(
      { name, email, password, role, vendorId },
      callerRole
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "An unexpected error occurred during registration.",
    });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * Public endpoint — authenticates credentials and returns JWT tokens.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "An unexpected error occurred during login.",
    });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 *
 * Protected endpoint — returns the profile of the authenticated user.
 * Requires the `authenticate` middleware to have run first.
 */
const getMe = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("GetMe error:", error.message);

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};