const approvalService = require('./approval.service')
const {
  createApproval,
  approveApproval,
  rejectApproval,
  approvalHistory,
} = require('./approval.validation')

// ─────────────────────────────────────────────────────────────────────────────
// createApprovalRequest
// POST /api/approvals
// Access: SUPER_ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const createApprovalRequest = async (req, res) => {
  try {
    const { error, value } = createApproval.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:  error.details.map((d) => d.message),
      })
    }

    const approval = await approvalService.createApprovalRequest({
      taskId: value.taskId,
      type:   value.type,
    })

    return res.status(201).json({
      success: true,
      message: 'Approval request created successfully',
      data:    approval,
    })
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({
      success: false,
      message: err.message ?? 'Internal server error',
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getPendingApprovals
// GET /api/approvals/pending
// Access: SUPER_ADMIN, BUSINESS_APPROVER
// ─────────────────────────────────────────────────────────────────────────────
const getPendingApprovals = async (req, res) => {
  try {
    const approvals = await approvalService.getPendingApprovals()

    return res.status(200).json({
      success: true,
      message: 'Pending approvals fetched successfully',
      count:   approvals.length,
      data:    approvals,
    })
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({
      success: false,
      message: err.message ?? 'Internal server error',
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// approveRequest
// PATCH /api/approvals/:id/approve
// Access: BUSINESS_APPROVER only
// ─────────────────────────────────────────────────────────────────────────────
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Approval ID is required',
      })
    }

    const { error, value } = approveApproval.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:  error.details.map((d) => d.message),
      })
    }

    const approval = await approvalService.approveRequest({
      approvalId: id,
      userId:     req.user.id,
      remarks:    value.remarks,
    })

    return res.status(200).json({
      success: true,
      message: 'Approval request approved successfully',
      data:    approval,
    })
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({
      success: false,
      message: err.message ?? 'Internal server error',
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rejectRequest
// PATCH /api/approvals/:id/reject
// Access: BUSINESS_APPROVER only
// ─────────────────────────────────────────────────────────────────────────────
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Approval ID is required',
      })
    }

    const { error, value } = rejectApproval.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:  error.details.map((d) => d.message),
      })
    }

    const approval = await approvalService.rejectRequest({
      approvalId: id,
      userId:     req.user.id,
      remarks:    value.remarks,
    })

    return res.status(200).json({
      success: true,
      message: 'Approval request rejected successfully',
      data:    approval,
    })
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({
      success: false,
      message: err.message ?? 'Internal server error',
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getApprovalHistory
// GET /api/approvals/history
// Access: SUPER_ADMIN, BUSINESS_APPROVER
// ─────────────────────────────────────────────────────────────────────────────
const getApprovalHistory = async (req, res) => {
  try {
    const { error, value } = approvalHistory.validate(req.query, {
      abortEarly:   false,
      allowUnknown: false,
    })

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors:  error.details.map((d) => d.message),
      })
    }

    const result = await approvalService.getApprovalHistory({
      taskId:    value.taskId,
      projectId: value.projectId,
      status:    value.status,
      type:      value.type,
      page:      value.page,
      limit:     value.limit,
    })

    return res.status(200).json({
      success:    true,
      message:    'Approval history fetched successfully',
      data:       result.data,
      total:      result.total,
      page:       result.page,
      limit:      result.limit,
      totalPages: result.totalPages,
    })
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({
      success: false,
      message: err.message ?? 'Internal server error',
    })
  }
}

module.exports = {
  createApprovalRequest,
  getPendingApprovals,
  approveRequest,
  rejectRequest,
  getApprovalHistory,
}