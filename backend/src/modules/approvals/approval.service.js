const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ── Reusable task+project include block ───────────────────────────────────────
const taskWithProjectInclude = {
  task: {
    include: {
      project: {
        select: {
          id:        true,
          name:      true,
          status:    true,
          deadline:  true,
        },
      },
      assignedTo: {
        select: {
          id:    true,
          name:  true,
          email: true,
          role:  true,
        },
      },
    },
  },
}

// ── Reusable approvedBy include block ─────────────────────────────────────────
const approvedByInclude = {
  approvedBy: {
    select: {
      id:    true,
      name:  true,
      email: true,
      role:  true,
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// createApprovalRequest
// Only SUPER_ADMIN can call this.
// Guards:
//   - task must exist
//   - no existing PENDING approval for same taskId + type
// ─────────────────────────────────────────────────────────────────────────────
const createApprovalRequest = async ({ taskId, type }) => {
  // 1. Verify task exists
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id:     true,
      title:  true,
      status: true,
    },
  })

  if (!task) {
    const error = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  // 2. Guard — no duplicate PENDING approval for same task + type
  const existing = await prisma.approval.findFirst({
    where: {
      taskId,
      type,
      status: 'PENDING',
    },
  })

  if (existing) {
    const error = new Error(
      `A PENDING ${type} approval already exists for this task`
    )
    error.statusCode = 409
    throw error
  }

  // 3. Create
  const approval = await prisma.approval.create({
    data: {
      taskId,
      type,
      status: 'PENDING',
    },
    include: {
      ...taskWithProjectInclude,
      ...approvedByInclude,
    },
  })

  return approval
}

// ─────────────────────────────────────────────────────────────────────────────
// getPendingApprovals
// Accessible by SUPER_ADMIN and BUSINESS_APPROVER.
// Returns task, project, developer, approval details.
// ─────────────────────────────────────────────────────────────────────────────
const getPendingApprovals = async () => {
  const approvals = await prisma.approval.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      ...taskWithProjectInclude,
      ...approvedByInclude,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return approvals
}

// ─────────────────────────────────────────────────────────────────────────────
// approveRequest
// Only BUSINESS_APPROVER can call this.
// Guards:
//   - approval must exist
//   - cannot approve an already APPROVED record
//   - cannot approve a REJECTED record
// ─────────────────────────────────────────────────────────────────────────────
const approveRequest = async ({ approvalId, userId, remarks }) => {
  // 1. Fetch existing approval
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
  })

  if (!approval) {
    const error = new Error('Approval not found')
    error.statusCode = 404
    throw error
  }

  // 2. Guard — cannot approve twice
  if (approval.status === 'APPROVED') {
    const error = new Error('This approval has already been approved')
    error.statusCode = 409
    throw error
  }

  // 3. Guard — cannot approve after rejection
  if (approval.status === 'REJECTED') {
    const error = new Error(
      'This approval has already been rejected and cannot be approved'
    )
    error.statusCode = 409
    throw error
  }

  // 4. Update
  const updated = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status:       'APPROVED',
      approvedById: userId,
      approvedAt:   new Date(),
      remarks:      remarks ?? null,
    },
    include: {
      ...taskWithProjectInclude,
      ...approvedByInclude,
    },
  })

  return updated
}

// ─────────────────────────────────────────────────────────────────────────────
// rejectRequest
// Only BUSINESS_APPROVER can call this.
// Guards:
//   - approval must exist
//   - cannot reject an already APPROVED record
//   - cannot reject twice
// ─────────────────────────────────────────────────────────────────────────────
const rejectRequest = async ({ approvalId, userId, remarks }) => {
  // 1. Fetch existing approval
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
  })

  if (!approval) {
    const error = new Error('Approval not found')
    error.statusCode = 404
    throw error
  }

  // 2. Guard — cannot reject after approval
  if (approval.status === 'APPROVED') {
    const error = new Error(
      'This approval has already been approved and cannot be rejected'
    )
    error.statusCode = 409
    throw error
  }

  // 3. Guard — cannot reject twice
  if (approval.status === 'REJECTED') {
    const error = new Error('This approval has already been rejected')
    error.statusCode = 409
    throw error
  }

  // 4. Update
  const updated = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status:       'REJECTED',
      approvedById: userId,
      approvedAt:   new Date(),
      remarks,
    },
    include: {
      ...taskWithProjectInclude,
      ...approvedByInclude,
    },
  })

  return updated
}

// ─────────────────────────────────────────────────────────────────────────────
// getApprovalHistory
// Accessible by SUPER_ADMIN and BUSINESS_APPROVER.
// Supports filters: taskId, projectId, status, type
// Supports pagination: page, limit
// ─────────────────────────────────────────────────────────────────────────────
const getApprovalHistory = async ({ taskId, projectId, status, type, page, limit }) => {
  const skip = (page - 1) * limit

  // Build where clause
  const where = {}

  if (taskId)  where.taskId = taskId
  if (status)  where.status = status
  if (type)    where.type   = type

  // projectId requires filtering through the task relation
  if (projectId) {
    where.task = {
      projectId,
    }
  }

  const [approvals, total] = await Promise.all([
    prisma.approval.findMany({
      where,
      include: {
        ...taskWithProjectInclude,
        ...approvedByInclude,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.approval.count({ where }),
  ])

  return {
    data:       approvals,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

module.exports = {
  createApprovalRequest,
  getPendingApprovals,
  approveRequest,
  rejectRequest,
  getApprovalHistory,
}