import React from 'react'
import styles from './ProjectTable.module.css'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     bg: '#FEF3C7', color: '#D97706' },
  IN_PROGRESS: { label: 'In Progress', bg: '#DBEAFE', color: '#2563EB' },
  AT_RISK:     { label: 'At Risk',     bg: '#FFF7ED', color: '#EA580C' },
  ON_HOLD:     { label: 'FEF3C7',      bg: '#FEF3C7', color: '#D97706' },
  COMPLETED:   { label: 'Completed',   bg: '#D1FAE5', color: '#059669' },
  CANCELLED:   { label: 'Cancelled',   bg: '#F1F5F9', color: '#64748B' },
}

// ── Priority config ───────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  low:      { label: 'Low',      color: '#059669' },
  medium:   { label: 'Medium',   color: '#D97706' },
  high:     { label: 'High',     color: '#EA580C' },
  critical: { label: 'Critical', color: '#DC2626' },
}

// ── Health dot — derived from status ─────────────────────────────────────────
const HEALTH_COLOR = {
  PENDING:     '#94A3B8',
  IN_PROGRESS: '#10B981',
  AT_RISK:     '#EF4444',
  ON_HOLD:     '#F59E0B',
  COMPLETED:   '#2563EB',
  CANCELLED:   '#CBD5E1',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

const isOverdue = (project) => {
  if (!project.deadline) return false
  if (['COMPLETED', 'CANCELLED'].includes(project.status)) return false
  return new Date(project.deadline) < new Date()
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: '#F1F5F9', color: '#64748B' }
  return (
    <span
      className={styles.badge}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className={styles.badgeDot}
        style={{ background: cfg.color }}
      />
      {cfg.label}
    </span>
  )
}

// ── SkeletonRow ───────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className={styles.skeletonRow}>
    {[120, 90, 80, 70, 90, 80, 90].map((w, i) => (
      <td key={i} className={styles.td}>
        <div className={styles.skeletonCell} style={{ width: w }} />
      </td>
    ))}
    <td className={styles.td}>
      <div className={styles.skeletonActions} />
    </td>
  </tr>
)

// ── EditIcon ──────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

// ── DeleteIcon ────────────────────────────────────────────────────────────────
const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

// ── ProjectTable ──────────────────────────────────────────────────────────────
const ProjectTable = ({ projects = [], loading = false, onEdit, onDelete }) => {

  // Empty state
  if (!loading && projects.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIconWrap}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p className={styles.emptyTitle}>No projects found</p>
        <p className={styles.emptyDesc}>
          Try adjusting your filters or create a new project to get started.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Project ID</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Vendor</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Health</th>
            <th className={styles.th}>Deadline</th>
            <th className={styles.th}>Created</th>
            <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} />)
            : projects.map((project) => {
                const overdue      = isOverdue(project)
                const healthColor  = HEALTH_COLOR[project.status] ?? '#94A3B8'

                return (
                  <tr key={project.id} className={styles.tr}>

                    {/* Project ID */}
                    <td className={styles.td}>
                      <span className={styles.projectId}>
                        {project.projectDisplayId ?? '—'}
                      </span>
                    </td>

                    {/* Name */}
                    <td className={styles.td}>
                      <p className={styles.projectName}>{project.name}</p>
                      {project.description && (
                        <p className={styles.projectDesc}>
                          {project.description.length > 48
                            ? project.description.slice(0, 48) + '…'
                            : project.description}
                        </p>
                      )}
                    </td>

                    {/* Vendor */}
                    <td className={styles.td}>
                      <span className={styles.vendorTag}>
                        {project.vendor?.name ?? project.vendor?.company_name ?? '—'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className={styles.td}>
                      <StatusBadge status={project.status} />
                    </td>

                    {/* Health dot */}
                    <td className={styles.td} style={{ textAlign: 'center' }}>
                      <span
                        className={styles.healthDot}
                        style={{ background: healthColor }}
                        title={project.status?.replace('_', ' ')}
                      />
                    </td>

                    {/* Deadline */}
                    <td className={styles.td}>
                      <span
                        className={styles.dateText}
                        style={overdue ? { color: '#DC2626', fontWeight: 700 } : {}}
                      >
                        {overdue && '⚠ '}
                        {formatDate(project.deadline)}
                      </span>
                    </td>

                    {/* Created */}
                    <td className={styles.td}>
                      <span className={styles.dateText}>
                        {formatDate(project.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          title="Edit project"
                          onClick={() => onEdit?.(project)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          title="Delete project"
                          onClick={() => onDelete?.(project)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })
          }
        </tbody>
      </table>
    </div>
  )
}

export default ProjectTable