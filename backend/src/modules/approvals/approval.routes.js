const express = require('express')

const router = express.Router()

const {
  createApprovalRequest,
  getPendingApprovals,
  approveRequest,
  rejectRequest,
  getApprovalHistory,
} = require('./approval.controller')

const { authenticate} = require('../../middleware/auth.middleware')
const { authorize } = require("../../middleware/role.middleware");

// ─────────────────────────────────────────────────────────────────────────────
// All routes require a valid JWT
// ─────────────────────────────────────────────────────────────────────────────
router.use(authenticate)

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/approvals
// Create a new approval request
// Access: SUPER_ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  authorize('SUPER_ADMIN'),
  createApprovalRequest
)

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/approvals/pending
// Get all pending approvals with task, project and developer details
// Access: SUPER_ADMIN, BUSINESS_APPROVER
// NOTE: must be registered before /:id routes to avoid param collision
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/pending',
  authorize('SUPER_ADMIN', 'BUSINESS_APPROVER'),
  getPendingApprovals
)

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/approvals/history
// Get approval history with optional filters
// Access: SUPER_ADMIN, BUSINESS_APPROVER
// NOTE: must be registered before /:id routes to avoid param collision
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/history',
  authorize('SUPER_ADMIN', 'BUSINESS_APPROVER'),
  getApprovalHistory
)

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/approvals/:id/approve
// Approve a pending approval request
// Access: BUSINESS_APPROVER only
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/:id/approve',
  authorize('BUSINESS_APPROVER'),
  approveRequest
)

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/approvals/:id/reject
// Reject a pending approval request
// Access: BUSINESS_APPROVER only
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/:id/reject',
  authorize('BUSINESS_APPROVER'),
  rejectRequest
)

module.exports = router