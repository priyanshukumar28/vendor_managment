import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdNotifications, MdCalendarToday, MdKeyboardArrowDown, MdLogout, MdSettings, MdPerson } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

const ROLE_LABELS = {
  SUPER_ADMIN: 'Operations Director',
  VENDOR_ADMIN: 'Vendor Admin',
  DEVELOPER: 'Developer',
}

const Navbar = ({ title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <header className={styles.navbar}>
      {/* Breadcrumb / Title */}
      <div className={styles.left}>
        <span className={styles.breadcrumb}>
          <span className={styles.breadRoot}>{ROLE_LABELS[user?.role] || 'Admin'}</span>
          {title && (
            <>
              <span className={styles.breadSep}> › </span>
              <span className={styles.breadCurrent}>{title}</span>
            </>
          )}
        </span>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <MdSearch size={16} className={styles.searchIcon} />
        <input className={styles.searchInput} placeholder="Search projects, vendors..." />
      </div>

      {/* Right controls */}
      <div className={styles.right}>
        {/* Date Range */}
        <div className={styles.dateChip}>
          <MdCalendarToday size={14} />
          <span>{today}</span>
        </div>

        {/* Notifications */}
        <div className={styles.notifWrap} ref={notifRef}>
          <button className={styles.iconBtn} onClick={() => setNotifOpen(o => !o)}>
            <MdNotifications size={20} />
            <span className={styles.badge}>3</span>
          </button>
          {notifOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropHeader}>
                <span>Notifications</span>
                <span className={styles.newBadge}>3 New</span>
              </div>
              {[
                { icon: '🔴', title: 'Compliance Check', sub: 'Insurance expiring in 5 days', time: '2h ago' },
                { icon: '✅', title: 'Invoice Approved', sub: 'INV-8821 marked as paid', time: '46m ago' },
                { icon: '💬', title: 'New Message', sub: 'David Chen sent a project brief', time: '1d ago' },
              ].map((n, i) => (
                <div key={i} className={styles.notifItem}>
                  <span className={styles.notifEmoji}>{n.icon}</span>
                  <div>
                    <p className={styles.notifTitle}>{n.title}</p>
                    <p className={styles.notifSub}>{n.sub}</p>
                    <p className={styles.notifTime}>{n.time}</p>
                  </div>
                </div>
              ))}
              <div className={styles.dropFooter}>
                <button>Mark All as Read</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className={styles.profileWrap} ref={profileRef}>
          <button className={styles.profileBtn} onClick={() => setProfileOpen(o => !o)}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{user?.name || user?.email || 'User'}</span>
              <span className={styles.profileRole}>{ROLE_LABELS[user?.role] || user?.role}</span>
            </div>
            <MdKeyboardArrowDown size={16} className={styles.chevron} style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>
          {profileOpen && (
            <div className={styles.dropdown} style={{ right: 0, minWidth: 180 }}>
              <button className={styles.dropItem} onClick={() => navigate('/settings')}>
                <MdPerson size={16} /> Profile
              </button>
              <button className={styles.dropItem} onClick={() => navigate('/settings')}>
                <MdSettings size={16} /> Settings
              </button>
              <div className={styles.dropDivider} />
              <button className={`${styles.dropItem} ${styles.dropDanger}`} onClick={handleLogout}>
                <MdLogout size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
