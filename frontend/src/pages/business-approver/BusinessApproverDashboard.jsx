import React, { useState } from 'react'
import styles from './BusinessApproverDashboard.module.css'

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_APPROVALS = [
  {
    id:            'APR-0001',
    project:       'SkyLine ERP Migration',
    task:          'Database Schema Design',
    type:          'REQUIREMENT',
    requestedBy:   'Ravi Kumar',
    requestedDate: '2026-05-20T09:15:00.000Z',
    status:        'PENDING',
  },
  {
    id:            'APR-0002',
    project:       'Vertex Mobile App',
    task:          'API Integration — Auth Module',
    type:          'UAT',
    requestedBy:   'Priya Sharma',
    requestedDate: '2026-05-21T11:30:00.000Z',
    status:        'PENDING',
  },
  {
    id:            'APR-0003',
    project:       'CloudNet Infrastructure',
    task:          'Load Balancer Configuration',
    type:          'REQUIREMENT',
    requestedBy:   'James Wilson',
    requestedDate: '2026-05-22T08:45:00.000Z',
    status:        'APPROVED',
  },
  {
    id:            'APR-0004',
    project:       'DataCore Analytics',
    task:          'Dashboard Charts Implementation',
    type:          'UAT',
    requestedBy:   'Sneha Patel',
    requestedDate: '2026-05-22T14:00:00.000Z',
    status:        'REJECTED',
  },
  {
    id:            'APR-0005',
    project:       'Neo Payment Gateway',
    task:          'Payment Processor Integration',
    type:          'PRODUCTION',
    requestedBy:   'Arjun Mehta',
    requestedDate: '2026-05-23T10:20:00.000Z',
    status:        'PENDING',
  },
  {
    id:            'APR-0006',
    project:       'SkyLine ERP Migration',
    task:          'User Role Management',
    type:          'UAT',
    requestedBy:   'Ravi Kumar',
    requestedDate: '2026-05-23T13:10:00.000Z',
    status:        'PENDING',
  },
  {
    id:            'APR-0007',
    project:       'GlobalDev Portal',
    task:          'SSO Implementation',
    type:          'REQUIREMENT',
    requestedBy:   'Elena Gilbert',
    requestedDate: '2026-05-24T09:00:00.000Z',
    status:        'APPROVED',
  },
  {
    id:            'APR-0008',
    project:       'Vertex Mobile App',
    task:          'Push Notification Service',
    type:          'PRODUCTION',
    requestedBy:   'David Miller',
    requestedDate: '2026-05-24T16:45:00.000Z',
    status:        'PENDING',
  },
]

const MOCK_ACTIVITY = [
  { project: 'CloudNet Infrastructure', action: 'Approved REQUIREMENT',  time: '2 hours ago'  },
  { project: 'DataCore Analytics',      action: 'Rejected UAT',          time: '4 hours ago'  },
  { project: 'GlobalDev Portal',        action: 'Approved REQUIREMENT',  time: '6 hours ago'  },
  { project: 'SkyLine ERP Migration',   action: 'Requested REQUIREMENT', time: '8 hours ago'  },
  { project: 'Neo Payment Gateway',     action: 'Requested PRODUCTION',  time: '10 hours ago' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-GB', {
    hour:   '2-digit',
    minute: '2-digit',
  })

// ── StatusBadge ───────────────────────────────────────────────────────────────
const STATUS_CFG = {
  PENDING:  { label: 'Pending',  bg: '#FEF3C7', color: '#D97706' },
  APPROVED: { label: 'Approved', bg: '#D1FAE5', color: '#059669' },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
}

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? { label: status, bg: '#F1F5F9', color: '#64748B' }
  return (
    <span
      className={styles.badge}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className={styles.badgeDot} style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  )
}

// ── TypeBadge ─────────────────────────────────────────────────────────────────
const TYPE_CFG = {
  REQUIREMENT: { bg: '#EDE9FE', color: '#7C3AED' },
  UAT:         { bg: '#DBEAFE', color: '#2563EB' },
  PRODUCTION:  { bg: '#FFF7ED', color: '#EA580C' },
}

const TypeBadge = ({ type }) => {
  const cfg = TYPE_CFG[type] ?? { bg: '#F1F5F9', color: '#64748B' }
  return (
    <span
      className={styles.badge}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {type}
    </span>
  )
}

// ── ViewModal ─────────────────────────────────────────────────────────────────
const ViewModal = ({ approval, onClose }) => {
  if (!approval) return null
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Approval Details</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Approval ID</p>
              <p className={styles.detailValue}>{approval.id}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Status</p>
              <StatusBadge status={approval.status} />
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Project</p>
              <p className={styles.detailValue}>{approval.project}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Task</p>
              <p className={styles.detailValue}>{approval.task}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Approval Type</p>
              <TypeBadge type={approval.type} />
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Requested By</p>
              <p className={styles.detailValue}>{approval.requestedBy}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>Requested Date</p>
              <p className={styles.detailValue}>
                {formatDate(approval.requestedDate)} at {formatTime(approval.requestedDate)}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── ConfirmModal ──────────────────────────────────────────────────────────────
const ConfirmModal = ({ action, approval, onConfirm, onClose }) => {
  const [remarks, setRemarks] = useState('')
  if (!approval || !action) return null

  const isReject  = action === 'REJECT'
  const title     = isReject ? 'Reject Approval' : 'Approve Request'
  const btnClass  = isReject ? styles.btnDanger : styles.btnSuccess
  const btnLabel  = isReject ? 'Reject' : 'Approve'

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modalBox} ${styles.modalSm}`}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.confirmMsg}>
            {isReject
              ? <>Are you sure you want to <strong>reject</strong> approval <strong>{approval.id}</strong> for task "<strong>{approval.task}</strong>"?</>
              : <>Are you sure you want to <strong>approve</strong> approval <strong>{approval.id}</strong> for task "<strong>{approval.task}</strong>"?</>
            }
          </p>
          <div className={styles.remarksWrap}>
            <label className={styles.remarksLabel}>
              Remarks {isReject && <span className={styles.required}>*</span>}
            </label>
            <textarea
              className={styles.remarksInput}
              rows={3}
              placeholder={isReject ? 'Reason for rejection is required…' : 'Optional remarks…'}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button
            className={btnClass}
            onClick={() => {
              if (isReject && !remarks.trim()) return
              onConfirm(approval.id, action, remarks)
            }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── BusinessApproverDashboard ─────────────────────────────────────────────────
const BusinessApproverDashboard = () => {
  const [approvals, setApprovals]     = useState(MOCK_APPROVALS)
  const [viewTarget, setViewTarget]   = useState(null)
  const [confirmData, setConfirmData] = useState({ action: null, approval: null })
  const [filterStatus, setFilter]     = useState('ALL')

  // ── Derived stats ───────────────────────────────────────────────────────
  const pending      = approvals.filter((a) => a.status === 'PENDING').length
  const approvedToday = approvals.filter((a) => a.status === 'APPROVED').length
  const rejectedToday = approvals.filter((a) => a.status === 'REJECTED').length
  const avgTime       = '3.2 hrs'

  const requirementPending = approvals.filter(
    (a) => a.status === 'PENDING' && a.type === 'REQUIREMENT'
  ).length
  const uatPending = approvals.filter(
    (a) => a.status === 'PENDING' && a.type === 'UAT'
  ).length

  // ── Filtered table data ─────────────────────────────────────────────────
  const tableData = filterStatus === 'ALL'
    ? approvals
    : approvals.filter((a) => a.status === filterStatus)

  // ── Action handler ──────────────────────────────────────────────────────
  const handleConfirm = (id, action, remarks) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' }
          : a
      )
    )
    setConfirmData({ action: null, approval: null })
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Business Approver Dashboard</h1>
          <p className={styles.pageSub}>Review and action pending approval requests</p>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.liveTag}>● Live</span>
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statOrange}`}>
          <div className={styles.statTop}>
            <span className={styles.statIcon}>⏳</span>
          </div>
          <p className={styles.statValue}>{pending}</p>
          <p className={styles.statLabel}>Pending Approvals</p>
        </div>

        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statTop}>
            <span className={styles.statIcon}>✓</span>
          </div>
          <p className={styles.statValue}>{approvedToday}</p>
          <p className={styles.statLabel}>Approved Today</p>
        </div>

        <div className={`${styles.statCard} ${styles.statRed}`}>
          <div className={styles.statTop}>
            <span className={styles.statIcon}>✕</span>
          </div>
          <p className={styles.statValue}>{rejectedToday}</p>
          <p className={styles.statLabel}>Rejected Today</p>
        </div>

        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statTop}>
            <span className={styles.statIcon}>⏱</span>
          </div>
          <p className={styles.statValue}>{avgTime}</p>
          <p className={styles.statLabel}>Avg Approval Time</p>
        </div>
      </div>

      {/* ── Body — table + sidebar ─────────────────────────────────────── */}
      <div className={styles.bodyGrid}>

        {/* ── Main table ──────────────────────────────────────────────── */}
        <div className={styles.mainCol}>
          <div className={styles.tableCard}>

            {/* Table toolbar */}
            <div className={styles.tableToolbar}>
              <h2 className={styles.tableTitle}>Pending Approvals</h2>
              <div className={styles.filterGroup}>
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
                  <button
                    key={s}
                    className={`${styles.filterTab} ${filterStatus === s ? styles.filterTabActive : ''}`}
                    onClick={() => setFilter(s)}
                  >
                    {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                    {s === 'PENDING' && pending > 0 && (
                      <span className={styles.filterBadge}>{pending}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Approval ID</th>
                    <th className={styles.th}>Project</th>
                    <th className={styles.th}>Task</th>
                    <th className={styles.th}>Type</th>
                    <th className={styles.th}>Requested By</th>
                    <th className={styles.th}>Requested Date</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.emptyRow}>
                        <div className={styles.emptyState}>
                          <span className={styles.emptyIcon}>✅</span>
                          <p className={styles.emptyTitle}>No approvals found</p>
                          <p className={styles.emptyDesc}>
                            There are no approval requests matching the current filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {tableData.map((approval) => (
                    <tr key={approval.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles.approvalId}>{approval.id}</span>
                      </td>
                      <td className={styles.td}>
                        <p className={styles.projectName}>{approval.project}</p>
                      </td>
                      <td className={styles.td}>
                        <p className={styles.taskName}>{approval.task}</p>
                      </td>
                      <td className={styles.td}>
                        <TypeBadge type={approval.type} />
                      </td>
                      <td className={styles.td}>
                        <div className={styles.requesterCell}>
                          <div className={styles.requesterAvatar}>
                            {approval.requestedBy.charAt(0)}
                          </div>
                          <span className={styles.requesterName}>
                            {approval.requestedBy}
                          </span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateText}>
                          {formatDate(approval.requestedDate)}
                        </span>
                        <span className={styles.timeText}>
                          {formatTime(approval.requestedDate)}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <StatusBadge status={approval.status} />
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actions}>
                          <button
                            className={styles.actionBtn}
                            title="View details"
                            onClick={() => setViewTarget(approval)}
                          >
                            👁
                          </button>
                          {approval.status === 'PENDING' && (
                            <>
                              <button
                                className={`${styles.actionBtn} ${styles.actionApprove}`}
                                title="Approve"
                                onClick={() =>
                                  setConfirmData({ action: 'APPROVE', approval })
                                }
                              >
                                ✓
                              </button>
                              <button
                                className={`${styles.actionBtn} ${styles.actionReject}`}
                                title="Reject"
                                onClick={() =>
                                  setConfirmData({ action: 'REJECT', approval })
                                }
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Row count footer */}
            <div className={styles.tableFooter}>
              <span className={styles.rowCount}>
                Showing {tableData.length} of {approvals.length} approvals
              </span>
            </div>

          </div>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────── */}
        <div className={styles.sidebar}>

          {/* Recent Activity */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Recent Approval Activity</h3>
            <div className={styles.activityList}>
              {MOCK_ACTIVITY.map((item, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityBody}>
                    <p className={styles.activityProject}>{item.project}</p>
                    <p className={styles.activityAction}>{item.action}</p>
                    <p className={styles.activityTime}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Queue Summary */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Approval Queue Summary</h3>
            <div className={styles.queueList}>
              <div className={styles.queueItem}>
                <span className={styles.queueLabel}>Total Pending</span>
                <span className={`${styles.queueValue} ${styles.queueOrange}`}>
                  {pending}
                </span>
              </div>
              <div className={styles.queueDivider} />
              <div className={styles.queueItem}>
                <span className={styles.queueLabel}>Development Approvals</span>
                <span className={`${styles.queueValue} ${styles.queuePurple}`}>
                  {requirementPending}
                </span>
              </div>
              <div className={styles.queueDivider} />
              <div className={styles.queueItem}>
                <span className={styles.queueLabel}>UAT Approvals</span>
                <span className={`${styles.queueValue} ${styles.queueBlue}`}>
                  {uatPending}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── View Modal ────────────────────────────────────────────────── */}
      <ViewModal
        approval={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {/* ── Confirm Modal ─────────────────────────────────────────────── */}
      <ConfirmModal
        action={confirmData.action}
        approval={confirmData.approval}
        onConfirm={handleConfirm}
        onClose={() => setConfirmData({ action: null, approval: null })}
      />

    </div>
  )
}

export default BusinessApproverDashboard