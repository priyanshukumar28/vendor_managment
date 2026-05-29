import React from 'react'
import styles from './ProjectPage.module.css'

// ── Status options ────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'PLANNING',     label: 'Planning'     },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD',     label: 'On Hold'     },
  { value: 'DELAYED',     label: 'Delayed'     },
  { value: 'COMPLETED',   label: 'Completed'   },
  { value: 'CANCELLED',   label: 'Cancelled'   },
]

// ── ProjectForm ───────────────────────────────────────────────────────────────
// Controlled form — all state lives in ProjectsPage.
// Props:
//   form      — current form values object
//   setForm   — state setter from parent
//   errors    — validation error map { field: message }
//   isEdit    — boolean, shows Status field when true
// ─────────────────────────────────────────────────────────────────────────────
const ProjectForm = ({ form, setForm, errors = {}, isEdit = false }) => {

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className={styles.formGrid}>

      {/* ── Project Name ──────────────────────────────────────────────── */}
      <div className={styles.formField}>
        <label className={styles.formLabel}>
          Project Name <span className={styles.formRequired}>*</span>
        </label>
        <input
          type="text"
          className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
          placeholder="e.g. SkyLine ERP Migration"
          value={form.name}
          onChange={set('name')}
          autoFocus
        />
        {errors.name && (
          <p className={styles.formError}>{errors.name}</p>
        )}
      </div>

      {/* ── Vendor ID ─────────────────────────────────────────────────── */}
      <div className={styles.formField}>
        <label className={styles.formLabel}>
          Vendor ID
        </label>
        <input
          type="text"
          className={styles.formInput}
          placeholder="e.g. vendor UUID or leave blank"
          value={form.vendorId}
          onChange={set('vendorId')}
        />
        <p className={styles.formHint}>
          Enter the vendor's UUID. Leave blank if unassigned.
        </p>
      </div>

      {/* ── Deadline + Status (side by side) ──────────────────────────── */}
      <div className={styles.formRow}>

        <div className={styles.formField}>
          <label className={styles.formLabel}>
            Deadline <span className={styles.formRequired}>*</span>
          </label>
          <input
            type="date"
            className={`${styles.formInput} ${errors.deadline ? styles.formInputError : ''}`}
            value={form.deadline ? form.deadline.slice(0, 10) : ''}
            onChange={set('deadline')}
            min={!isEdit ? new Date().toISOString().slice(0, 10) : undefined}
          />
          {errors.deadline && (
            <p className={styles.formError}>{errors.deadline}</p>
          )}
        </div>

        {/* Status — only visible in edit mode */}
        {isEdit && (
          <div className={styles.formField}>
            <label className={styles.formLabel}>Status</label>
            <select
              className={styles.formSelect}
              value={form.status}
              onChange={set('status')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* ── Description ───────────────────────────────────────────────── */}
      <div className={styles.formField}>
        <label className={styles.formLabel}>Description</label>
        <textarea
          className={styles.formTextarea}
          placeholder="Describe the project scope, goals, and key deliverables…"
          rows={4}
          value={form.description}
          onChange={set('description')}
        />
      </div>

    </div>
  )
}

export default ProjectForm