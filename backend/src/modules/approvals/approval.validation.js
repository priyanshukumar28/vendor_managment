const Joi = require('joi')

// ── Create Approval Request ───────────────────────────────────────────────────
const createApproval = Joi.object({
  taskId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.guid': 'taskId must be a valid UUID',
      'any.required': 'taskId is required',
    }),

  type: Joi.string()
    .valid('REQUIREMENT', 'UAT', 'PRODUCTION')
    .required()
    .messages({
      'any.only': 'type must be one of REQUIREMENT, UAT, PRODUCTION',
      'any.required': 'type is required',
    }),
})

// ── Approve Request ───────────────────────────────────────────────────────────
const approveApproval = Joi.object({
  remarks: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .optional()
    .messages({
      'string.min': 'remarks cannot be empty',
      'string.max': 'remarks cannot exceed 1000 characters',
    }),
})

// ── Reject Request ────────────────────────────────────────────────────────────
const rejectApproval = Joi.object({
  remarks: Joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min':   'remarks cannot be empty',
      'string.max':   'remarks cannot exceed 1000 characters',
      'any.required': 'remarks are required when rejecting',
    }),
})

// ── History Query Filters ─────────────────────────────────────────────────────
const approvalHistory = Joi.object({
  taskId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.guid': 'taskId must be a valid UUID',
    }),

  projectId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .optional()
    .messages({
      'string.guid': 'projectId must be a valid UUID',
    }),

  status: Joi.string()
    .valid('PENDING', 'APPROVED', 'REJECTED', 'CHANGE_REQUESTED')
    .optional()
    .messages({
      'any.only': 'status must be one of PENDING, APPROVED, REJECTED, CHANGE_REQUESTED',
    }),

  type: Joi.string()
    .valid('REQUIREMENT', 'UAT', 'PRODUCTION')
    .optional()
    .messages({
      'any.only': 'type must be one of REQUIREMENT, UAT, PRODUCTION',
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional()
    .messages({
      'number.min': 'page must be at least 1',
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      'number.min': 'limit must be at least 1',
      'number.max': 'limit cannot exceed 100',
    }),
})

module.exports = {
  createApproval,
  approveApproval,
  rejectApproval,
  approvalHistory,
}