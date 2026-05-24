import React, { useState, useEffect, useCallback } from 'react'
import { MdAdd, MdSearch, MdFilterList, MdDownload, MdVisibility, MdBusiness } from 'react-icons/md'
import { toast } from 'react-toastify'
import { vendorService } from '../../services/vendor.service'
import Table, { Pagination } from '../../components/Table/Table'
import Modal from '../../components/Modal/Modal'
import { Button } from '../../components/Buttons/Buttons'
import StatusBadge from '../../components/Buttons/StatusBadge'
import { FormField, Input, Select, FormRow } from '../../components/Forms/Forms'
import { SectionCard } from '../../components/Cards/Cards'
import styles from './VendorList.module.css'

const PAGE_SIZE = 10

const INITIAL_FORM = {
  name: '', company: '', email: '', phone: '',
  vendorType: 'Service Provider', website: '',
  gst: '', pan: '', slaType: 'Standard', status: 'active'
}

const VendorList = () => {
  const [vendors, setVendors] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    try {
      const res = await vendorService.getVendors({ page, limit: PAGE_SIZE, search })
      const list = res?.data || res?.vendors || res || []
      const count = res?.total || res?.count || (Array.isArray(list) ? list.length : 0)
      setVendors(Array.isArray(list) ? list : [])
      setTotal(count)
    } catch (e) {
      toast.error('Failed to fetch vendors')
      setVendors([])
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchVendors() }, 400)
    return () => clearTimeout(t)
  }, [search])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Vendor name is required'
    if (!form.company.trim()) e.company = 'Company name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      await vendorService.createVendor(form)
      toast.success('Vendor added successfully!')
      setModalOpen(false)
      setForm(INITIAL_FORM)
      setErrors({})
      fetchVendors()
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to add vendor'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Vendor Name',
      render: (val, row) => (
        <div className={styles.vendorName}>
          <div className={styles.vendorAvatar}>{(val || row.company || '?')[0]?.toUpperCase()}</div>
          <div>
            <p className={styles.nameText}>{val || '—'}</p>
            <p className={styles.emailText}>{row.email || '—'}</p>
          </div>
        </div>
      )
    },
    { key: 'company', label: 'Company' },
    {
      key: 'activeProjects',
      label: 'Active Projects',
      render: (val) => <span className={styles.projectCount}>{val ?? '—'}</span>
    },
    {
      key: 'slaStatus',
      label: 'SLA Status',
      render: (val) => <StatusBadge status={val || 'compliant'} />
    },
    {
      key: 'score',
      label: 'Score',
      render: (val) => val != null ? <span className={styles.score}>{val}%</span> : '—'
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val || 'active'} />
    },
    {
      key: '_id',
      label: 'Actions',
      render: (val, row) => (
        <button className={styles.viewBtn} title="View vendor">
          <MdVisibility size={16} />
        </button>
      )
    },
  ]

  const totalVendors = vendors.length
  const activeVendors = vendors.filter(v => (v.status || '').toLowerCase() === 'active').length
  const slaBreaches = vendors.filter(v => (v.slaStatus || '').toLowerCase() === 'breach').length
  const topVendors = [...vendors].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3)

  return (
    <div className={styles.page}>
      <div className={styles.mainArea}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Vendor Management</h1>
            <p className={styles.breadcrumb}>Dashboard › <span>Vendors</span></p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="ghost" icon={MdDownload}>Export</Button>
            <Button variant="primary" icon={MdAdd} onClick={() => setModalOpen(true)}>+ Add Vendor</Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <MdSearch size={15} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search vendors, companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn}><MdFilterList size={15} /> Advanced Filters</button>
        </div>

        {/* Table */}
        <SectionCard>
          <Table
            columns={columns}
            data={vendors}
            loading={loading}
            emptyMessage="No vendors found. Add your first vendor."
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

      {/* Right Sidebar Summary */}
      <div className={styles.sidebar}>
        <SectionCard title="Vendor Summary">
          <div className={styles.summaryList}>
            <div className={styles.summaryRow}>
              <span>Total Vendors</span>
              <strong>{totalVendors}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Active Vendors</span>
              <strong style={{ color: '#10B981' }}>{activeVendors}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>SLA Breaches</span>
              <strong style={{ color: '#EF4444' }}>{slaBreaches}</strong>
            </div>
          </div>
        </SectionCard>

        {topVendors.length > 0 && (
          <SectionCard title="Top Performing">
            <div className={styles.topList}>
              {topVendors.map((v, i) => (
                <div key={v._id || i} className={styles.topRow}>
                  <span className={styles.topRank}>{i + 1}</span>
                  <div className={styles.topInfo}>
                    <span className={styles.topName}>{v.company || v.name}</span>
                    <div className={styles.topBar}>
                      <div className={styles.topFill} style={{ width: `${v.score || 0}%` }} />
                    </div>
                  </div>
                  <span className={styles.topScore} style={{ color: 'var(--brand-blue)' }}>{v.score || 0}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Add Vendor Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setErrors({}); setForm(INITIAL_FORM) }}
        title="Add New Vendor"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setModalOpen(false); setErrors({}); setForm(INITIAL_FORM) }}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit}>Save & Continue</Button>
          </>
        }
      >
        {/* Step indicator */}
        <div className={styles.stepBar}>
          {['Basic Info', 'Contact', 'Address', 'SLA & Agreement', 'Assignment'].map((s, i) => (
            <div key={s} className={`${styles.step} ${i === 0 ? styles.stepActive : ''}`}>
              <div className={styles.stepCircle}>{i < 0 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <FormRow>
            <FormField label="Vendor Name" required error={errors.name}>
              <Input
                placeholder="e.g. John Doe Logistics"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
              />
            </FormField>
            <FormField label="Company Name" required error={errors.company}>
              <Input
                placeholder="e.g. JD Logistics Private Limited"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                error={errors.company}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Vendor Type" required>
              <Select value={form.vendorType} onChange={e => setForm(f => ({ ...f, vendorType: e.target.value }))}>
                <option>Service Provider</option>
                <option>Technology Partner</option>
                <option>Consultant</option>
                <option>Supplier</option>
              </Select>
            </FormField>
            <FormField label="Website URL">
              <Input
                placeholder="https://www.example.com"
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField label="Email Address" required error={errors.email}>
              <Input
                type="email"
                placeholder="vendor@company.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
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
            <FormField label="GST Number" hint="Format: 22AAAAA0000A1Z5">
              <Input
                placeholder="22AAAAA0000A1Z5"
                value={form.gst}
                onChange={e => setForm(f => ({ ...f, gst: e.target.value }))}
              />
            </FormField>
            <FormField label="PAN Number">
              <Input
                placeholder="ABCDE1234F"
                value={form.pan}
                onChange={e => setForm(f => ({ ...f, pan: e.target.value }))}
              />
            </FormField>
          </FormRow>

          <FormField label="SLA Type">
            <Select value={form.slaType} onChange={e => setForm(f => ({ ...f, slaType: e.target.value }))}>
              <option>Standard Service Level Agreement</option>
              <option>Premium SLA</option>
              <option>Enterprise SLA</option>
            </Select>
          </FormField>

          <div className={styles.taxNote}>
            <span>ℹ</span>
            <p>Please ensure GST and PAN details match documents you will upload. Inconsistencies may delay verification.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default VendorList
