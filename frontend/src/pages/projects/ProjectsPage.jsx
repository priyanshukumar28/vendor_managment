import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import projectService from '../../services/project.service'
import ProjectTable from './ProjectTable'
import ProjectForm from './ProjectForm'
import styles from './ProjectPage.module.css'

const INIT_FORM = {
  name: '',
  description: '',
  vendorId: '',
  status: 'PLANNING',
  deadline: '',
}

const ProjectsPage = () => {
  // ── Data state ────────────────────────────────────────────────────────────
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]         = useState(0)
  const LIMIT = 10

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen]     = useState(false)
  const [editTarget, setEditTarget]   = useState(null)   // null = create mode
  const [form, setForm]               = useState(INIT_FORM)
  const [formErrors, setFormErrors]   = useState({})
  const [submitting, setSubmitting]   = useState(false)

  // ── Delete confirm state ──────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null)  // project object
  const [deleting, setDeleting]         = useState(false)

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch projects
  // ─────────────────────────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: LIMIT }
      if (search)       params.search = search
      if (statusFilter) params.status = statusFilter

      const res = await projectService.getAll(params)
      const body = res.data

      // Support both paginated { data, total, totalPages } and plain array
      if (Array.isArray(body.data)) {
        setProjects(body.data)
        setTotal(body.total ?? body.data.length)
        setTotalPages(body.totalPages ?? (Math.ceil((body.total ?? body.data.length) / LIMIT) || 1))
      } else if (Array.isArray(body)) {
        setProjects(body)
        setTotal(body.length)
        setTotalPages(1)
      } else {
        setProjects([])
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load projects'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // ─────────────────────────────────────────────────────────────────────────
  // Search — debounced on Enter or 600 ms idle
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 600)
    return () => clearTimeout(t)
  }, [searchInput])

  // ─────────────────────────────────────────────────────────────────────────
  // Form helpers
  // ─────────────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setForm(INIT_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (project) => {
    setEditTarget(project)
    setForm({
      name:        project.name        ?? '',
      description: project.description ?? '',
      vendorId:    project.vendorId    ?? project.vendor?.id ?? '',
      status:      project.status      ?? 'PLANNING',
      deadline:    project.deadline    ? project.deadline.slice(0, 10) : '',
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditTarget(null)
    setFormErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name?.trim())   e.name     = 'Project name is required'
    if (!form.deadline)       e.deadline = 'Deadline is required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editTarget) {
        await projectService.update(editTarget.id, form)
        toast.success('Project updated successfully')
      } else {
        await projectService.create(form)
        toast.success('Project created successfully')
      }
      closeModal()
      fetchProjects()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────────────────────────────────────
  const confirmDelete = (project) => setDeleteTarget(project)
  const cancelDelete  = () => setDeleteTarget(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await projectService.delete(deleteTarget.id)
      toast.success(`"${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
      // If last item on page > 1, go back one page
      if (projects.length === 1 && page > 1) setPage((p) => p - 1)
      else fetchProjects()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Derived stats (from current page — replace with dedicated stats API if available)
  // ─────────────────────────────────────────────────────────────────────────
  const stats = {
    total,
    active: projects.filter((p) => p.status === 'ACTIVE').length,
    atRisk: projects.filter((p) => p.status === 'ON_HOLD').length,
    completed: projects.filter((p) => p.status === 'COMPLETED').length,
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSub}>Manage and track all vendor project deliverables</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          + Add Project
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statValue}>{stats.total}</p>
          <p className={styles.statLabel}>Total Projects</p>
        </div>
        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <p className={styles.statValue}>{stats.active}</p>
          <p className={styles.statLabel}>In Progress</p>
        </div>
        <div className={`${styles.statCard} ${styles.statOrange}`}>
          <p className={styles.statValue}>{stats.atRisk}</p>
          <p className={styles.statLabel}>At Risk</p>
        </div>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <p className={styles.statValue}>{stats.completed}</p>
          <p className={styles.statLabel}>Completed</p>
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search projects, vendors…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className={styles.searchClear} onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}>
              ✕
            </button>
          )}
        </div>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
        >
          <option value="">All Status</option>
          <option value="PLANNING">Planning</option>
          <option value="ACTIVE">Active</option>
          <option value="DELAYED">Delayed</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {(search || statusFilter) && (
          <button
            className={styles.btnReset}
            onClick={() => { setSearchInput(''); setSearch(''); setStatus(''); setPage(1) }}
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Error banner ────────────────────────────────────────────────── */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error} —{' '}
          <button className={styles.retryBtn} onClick={fetchProjects}>Retry</button>
        </div>
      )}

      {/* ── Table card ──────────────────────────────────────────────────── */}
      <div className={styles.tableCard}>
        <ProjectTable
          projects={projects}
          loading={loading}
          onEdit={openEdit}
          onDelete={confirmDelete}
        />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>
              Showing {total === 0 ? 0 : (page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
            </span>
            <div className={styles.pageButtons}>
              <button
                className={styles.pageBtn}
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '…'
                    ? <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>…</span>
                    : <button
                        key={p}
                        className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                )
              }
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}

        {/* Row count (no pagination) */}
        {!loading && totalPages <= 1 && total > 0 && (
          <div className={styles.pagination}>
            <span className={styles.pageInfo}>{total} project{total !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      {modalOpen && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editTarget ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button className={styles.modalClose} onClick={closeModal} disabled={submitting}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <ProjectForm
                form={form}
                setForm={setForm}
                errors={formErrors}
                isEdit={!!editTarget}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnGhost} onClick={closeModal} disabled={submitting}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? (editTarget ? 'Saving…' : 'Creating…')
                  : (editTarget ? 'Save Changes' : 'Create Project')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && cancelDelete()}>
          <div className={`${styles.modalBox} ${styles.modalSm}`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Project</h2>
              <button className={styles.modalClose} onClick={cancelDelete} disabled={deleting}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.deleteMsg}>
                Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>?
                This action cannot be undone and will remove all associated data.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnGhost} onClick={cancelDelete} disabled={deleting}>
                Cancel
              </button>
              <button className={styles.btnDanger} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProjectsPage