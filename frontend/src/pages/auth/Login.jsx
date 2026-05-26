import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/aa_logo.png'
import styles from './Login.module.css'

const ROLES = [
  { key: 'SUPER_ADMIN', label: 'Admin' },
  { key: 'VENDOR_ADMIN', label: 'Vendor' },
  { key: 'DEVELOPER', label: 'Developer' },
]

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN')
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (!form.email || !form.password) {
    toast.error('Please enter your email and password.')
    return
  }

  setLoading(true)

  try {
    const user = await login(form)

    toast.success('Welcome back!')

    // Role-based redirect
    switch (user.role) {
      case 'SUPER_ADMIN':
        navigate('/dashboard', { replace: true })
        break

      case 'VENDOR_ADMIN':
        navigate('/dashboard', { replace: true })
        break

      case 'DEVELOPER':
        navigate('/dashboard', { replace: true })
        break

      default:
        navigate('/dashboard', { replace: true })
    }

  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      'Invalid credentials. Please try again.'

    toast.error(msg)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <img
            src={logo}
            alt="Across Assist"
            style={{
              width: "180px",
              height: "auto",
              marginBottom: "20px"
            }}
          />
          <div className={styles.heroText}>
            <h1>Elevating Enterprise <span>Operations Management.</span></h1>
            <p>The unified portal for streamlined vendor governance, project lifecycle tracking, and development operational excellence.</p>
          </div>

          {/* Mini Dashboard Preview */}
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewLabel}>OPERATIONAL OVERVIEW</span>
              <span className={styles.liveChip}>Live Data</span>
            </div>
            <h4>Vendor Performance Index</h4>
            <div className={styles.previewStats}>
              <div className={styles.previewStat}>
                <span className={styles.previewStatVal}>1,284</span>
                <span className={styles.previewStatLabel}>Active Vendors</span>
              </div>
              <div className={styles.previewStat}>
                <span className={styles.previewStatVal} style={{ color: '#10B981' }}>+24%</span>
                <span className={styles.previewStatLabel}>Project Growth</span>
              </div>
              <div className={styles.previewStat}>
                <span className={styles.previewStatVal} style={{ color: '#F59E0B' }}>99.9%</span>
                <span className={styles.previewStatLabel}>System Health</span>
              </div>
            </div>
            <div className={styles.previewBars}>
              {[{ label: 'Region 1', pct: 75 }, { label: 'Region 2', pct: 45 }, { label: 'Region 3', pct: 90 }].map(r => (
                <div key={r.label} className={styles.barRow}>
                  <span>{r.label}</span>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${r.pct}%` }} /></div>
                  <span>{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.avatarGroup}>
              {['A','B','C','D'].map((l, i) => (
                <div key={i} className={styles.avatarCircle} style={{ zIndex: 4-i, marginLeft: i ? -8 : 0 }}>{l}</div>
              ))}
              <div className={styles.avatarCircle} style={{ marginLeft: -8, background: 'var(--brand-blue)', color: 'white', zIndex: 0 }}>+500</div>
            </div>
            <span>Trusted by global operation teams</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2>Welcome Back</h2>
            <p>Login to manage vendors, projects and development operations on the Across Assist platform.</p>
          </div>

          {/* Role Tabs */}
          <div className={styles.roleTabs}>
            {ROLES.map(r => (
              <button
                key={r.key}
                type="button"
                className={`${styles.roleTab} ${selectedRole === r.key ? styles.roleActive : ''}`}
                onClick={() => setSelectedRole(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {selectedRole === 'DEVELOPER' ? 'User ID' : 'Email address'}
              </label>
              <div className={styles.inputWrap}>
                <MdEmail size={16} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  type={selectedRole === 'DEVELOPER' ? 'text' : 'email'}
                  name="email"
                  placeholder="name@acrossassist.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className={styles.formLabel}>Password</label>
                <button type="button" className={styles.forgotLink}>Forgot password?</button>
              </div>
              <div className={styles.inputWrap}>
                <MdLock size={16} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            <label className={styles.rememberRow}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Remember this device for 30 days</span>
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <><span className={styles.btnSpinner} /> Signing in...</>
              ) : (
                <>Sign in to Portal <MdArrowForward size={18} /></>
              )}
            </button>
          </form>

          <div className={styles.secureNote}>
            <span>🔒</span>
            <span>ENTERPRISE SECURE LOGIN ENFORCED</span>
          </div>

          <p className={styles.contactNote}>
            Don't have an account?{' '}
            <button type="button" className={styles.contactLink}>Contact your Administrator</button>
          </p>
        </div>

        {/* Footer */}
        <div className={styles.formFooter}>
          <button type="button" className={styles.footerLink}>Privacy Policy</button>
          <span>|</span>
          <button type="button" className={styles.footerLink}>Terms of Service</button>
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12 }}>V1.28.4 PRODUCTION</span>
        </div>
      </div>
    </div>
  )
}

export default Login
