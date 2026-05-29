import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  MdDashboard, MdPeople, MdFolder, MdTask, MdBarChart,
  MdSettings, MdLogout, MdMenu, MdChevronLeft,
  MdApproval, MdWarning, MdReceiptLong, MdCode,
  MdBusiness, MdGroups
} from 'react-icons/md'
import { useAuth, ROLES } from '../../context/AuthContext'
import Logo from '../../assets/images/aa_logo.png'
import styles from './Sidebar.module.css'

const NAV_CONFIG = {
  [ROLES.SUPER_ADMIN]: [
    { label: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { label: 'Vendors', icon: MdBusiness, path: '/vendors' },
    { label: 'Users', icon: MdPeople, path: '/users' },
    { label: 'Projects', icon: MdFolder, path: '/projects' },
    { label: 'Tasks', icon: MdTask, path: '/tasks' },
    { label: 'Developers', icon: MdCode, path: '/developers' },
    { label: 'Teams', icon: MdGroups, path: '/teams' },
    { label: 'Reports', icon: MdBarChart, path: '/reports' },
    { label: 'Approvals', icon: MdApproval, path: '/approvals' },
    { label: 'Escalations', icon: MdWarning, path: '/escalations' },
    { label: 'Invoices', icon: MdReceiptLong, path: '/invoices' },
    { label: 'Settings', icon: MdSettings, path: '/settings' },
  ],
  [ROLES.VENDOR_ADMIN]: [
    { label: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { label: 'Projects', icon: MdFolder, path: '/projects' },
    { label: 'Tasks', icon: MdTask, path: '/tasks' },
  ],
  [ROLES.DEVELOPER]: [
    { label: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { label: 'Tasks', icon: MdTask, path: '/tasks' },
  ],

  [ROLES.BUSINESS_APPROVER]: [
  {
    label: 'Approvals',
    icon: MdApproval,
    path: '/approval-workspace'
  },
  {
    label: 'Approval History',
    icon: MdBarChart,
    path: '/approval-history'
  }
  ],
}

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = NAV_CONFIG[user?.role] || NAV_CONFIG[ROLES.DEVELOPER]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
    <div className={styles.logoArea}>
      <img
        src={Logo}
        alt="Across Assist"
        className={`${styles.logo} ${collapsed ? styles.collapsedLogo : ""}`}
      />

      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <MdMenu size={18} /> : <MdChevronLeft size={18} />}
      </button>
    </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <ul>
          {navItems.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={20} className={styles.navIcon} />
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className={styles.sidebarBottom}>

      {user?.role !== ROLES.BUSINESS_APPROVER && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <MdSettings size={20} className={styles.navIcon} />
            {!collapsed && (
              <span className={styles.navLabel}>Settings</span>
            )}
          </NavLink>
        )}
        <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <MdLogout size={20} className={styles.navIcon} />
          {!collapsed && <span className={styles.navLabel}>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
