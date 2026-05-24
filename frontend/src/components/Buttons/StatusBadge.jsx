import React from 'react'

const BADGE_CONFIG = {
  // SLA Status
  compliant: { bg: '#D1FAE5', color: '#059669', label: 'Compliant' },
  warning: { bg: '#FEF3C7', color: '#D97706', label: 'Warning' },
  breach: { bg: '#FEE2E2', color: '#DC2626', label: 'Breach' },

  // Vendor Status
  active: { bg: '#D1FAE5', color: '#059669', label: 'Active' },
  disabled: { bg: '#F3F4F6', color: '#6B7280', label: 'Disabled' },
  inactive: { bg: '#F3F4F6', color: '#6B7280', label: 'Inactive' },

  // Project Status
  'at-risk': { bg: '#FEE2E2', color: '#DC2626', label: 'At Risk' },
  'at_risk': { bg: '#FEE2E2', color: '#DC2626', label: 'At Risk' },
  pending: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
  completed: { bg: '#D1FAE5', color: '#059669', label: 'Completed' },
  review: { bg: '#FEF3C7', color: '#D97706', label: 'Review' },
  final: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Final' },
  testing: { bg: '#E0E7FF', color: '#4F46E5', label: 'Testing' },

  // Approval
  approved: { bg: '#D1FAE5', color: '#059669', label: 'Approved' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },

  // Roles
  super_admin: { bg: '#EDE9FE', color: '#7C3AED', label: 'Super Admin' },
  vendor_admin: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Vendor Admin' },
  developer: { bg: '#D1FAE5', color: '#059669', label: 'Developer' },

  // Invoice
  paid: { bg: '#D1FAE5', color: '#059669', label: 'Paid' },
  overdue: { bg: '#FEE2E2', color: '#DC2626', label: 'Overdue' },
  open: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Open' },
  resolved: { bg: '#D1FAE5', color: '#059669', label: 'Resolved' },
}

const StatusBadge = ({ status, label: customLabel }) => {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_')
  const config = BADGE_CONFIG[key] || { bg: '#F3F4F6', color: '#6B7280', label: status || '—' }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: config.bg,
      color: config.color,
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: config.color, display: 'inline-block', flexShrink: 0
      }} />
      {customLabel || config.label}
    </span>
  )
}

export default StatusBadge
