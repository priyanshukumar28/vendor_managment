import React, { useState, useEffect, useCallback } from 'react'
import { MdAdd, MdSearch, MdVisibility } from 'react-icons/md'
import { toast } from 'react-toastify'
import { userService } from '../../services/user.service'
import Table, { Pagination } from '../../components/Table/Table'
import Modal from '../../components/Modal/Modal'
import { Button } from '../../components/Buttons/Buttons'
import StatusBadge from '../../components/Buttons/StatusBadge'
import { FormField, Input, Select, FormRow } from '../../components/Forms/Forms'
import { SectionCard } from '../../components/Cards/Cards'
import styles from './Users.module.css'

const PAGE_SIZE = 10

const INITIAL_FORM = {
  name: '', email: '', password: '', role: 'DEVELOPER',
  phone: '', department: '', status: 'active'
}

const UserList = () => {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.getUsers({ page, limit: PAGE_SIZE, search })
      const list = res?.data?.users || []
      const count = res?.data?.pagination?.total || list.length
      setUsers(Array.isArray(list) ? list : [])
      setTotal(count)
    } catch (e) {
      toast.error('Failed to fetch users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers() }, 400)
    return () => clearTimeout(t)
  }, [search])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
  if (!validate()) return;

  setSubmitting(true);

  try {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,

      // temporary hardcoded vendor
      vendorId: "0b770ba8-3714-4395-ae02-0e3dbe6f118c"
    };

    await userService.createUser(payload);

    toast.success("User created successfully!");

    setModalOpen(false);
    setForm(INITIAL_FORM);
    setErrors({});

    fetchUsers();

  } catch (e) {
    console.log(e.response?.data);

    const msg =
      e?.response?.data?.message ||
      "Failed to create user";

    toast.error(msg);

  } finally {
    setSubmitting(false);
  }
}

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (val, row) => (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{(val || row.email || '?')[0]?.toUpperCase()}</div>
          <div>
            <p className={styles.userName}>{val || '—'}</p>
            <p className={styles.userEmail}>{row.email || '—'}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone', render: (v) => v || '—' },
    { key: 'department', label: 'Department', render: (v) => v || '—' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => <StatusBadge status={(val || '').toLowerCase()} />
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val || 'active'} />
    },
    {
      key: '_id',
      label: 'Actions',
      render: () => (
        <button className={styles.viewBtn} title="View user">
          <MdVisibility size={16} />
        </button>
      )
    },
  ]

  const totalUsers = users.length
  const byRole = users.reduce((acc, u) => {
    const r = u.role || 'UNKNOWN'
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})

  return (
    <div className={styles.page}>
      <div className={styles.mainArea}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>User Management</h1>
            <p className={styles.breadcrumb}>Dashboard › <span>Users</span></p>
          </div>
          <Button variant="primary" icon={MdAdd} onClick={() => setModalOpen(true)}>+ Add User</Button>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <MdSearch size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search users by name, email, role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <SectionCard>
          <Table
            columns={columns}
            data={users}
            loading={loading}
            emptyMessage="No users found. Add your first user."
          />
          {!loading && total > 0 && (
            <Pagination
              page={page}
              totalPages={Math.ceil(total / PAGE_SIZE)}
              onPageChange={setPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
            />
          )}
        </SectionCard>
      </div>

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <SectionCard title="User Summary">
          <div className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
            </div>
            {Object.entries(byRole).map(([role, count]) => (
              <div key={role} className={styles.summaryRow}>
                <span className={styles.roleLabel}>{role.replace('_', ' ')}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Role Guide">
          <div className={styles.roleGuide}>
            {[
              { role: 'SUPER_ADMIN', desc: 'Full system access', color: '#7C3AED' },
              { role: 'VENDOR_ADMIN', desc: 'Vendor & project mgmt', color: '#1D4ED8' },
              { role: 'DEVELOPER', desc: 'Tasks & development', color: '#059669' },
            ].map(r => (
              <div key={r.role} className={styles.roleRow}>
                <div className={styles.roleDot} style={{ background: r.color }} />
                <div>
                  <p className={styles.roleTitle}>{r.role.replace('_', ' ')}</p>
                  <p className={styles.roleDesc}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Add User Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setErrors({}); setForm(INITIAL_FORM) }}
        title="Add New User"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setModalOpen(false); setErrors({}); setForm(INITIAL_FORM) }}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit}>Create User</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormRow>
            <FormField label="Full Name" required error={errors.name}>
              <Input
                placeholder="e.g. John Smith"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
              />
            </FormField>
            <FormField label="Email Address" required error={errors.email}>
              <Input
                type="email"
                placeholder="user@acrossassist.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Password" required error={errors.password}>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={errors.password}
              />
            </FormField>
            <FormField label="Phone Number">
              <Input
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Role" required>
              <Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="VENDOR_ADMIN">Vendor Admin</option>
                <option value="DEVELOPER">Developer</option>
              </Select>
            </FormField>
            <FormField label="Department">
              <Input
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              />
            </FormField>
          </FormRow>

          <FormField label="Status">
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="disabled">Disabled</option>
            </Select>
          </FormField>
        </div>
      </Modal>
    </div>
  )
}

export default UserList
