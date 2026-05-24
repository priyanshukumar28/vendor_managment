import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import Navbar from '../components/Navbar/Navbar'
import styles from './DashboardLayout.module.css'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard Overview',
  '/vendors': 'Vendor Management',
  '/users': 'User Management',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/developers': 'Developers',
  '/teams': 'Teams',
  '/reports': 'Reports',
  '/approvals': 'Approvals',
  '/escalations': 'Escalations',
  '/invoices': 'Invoices',
  '/settings': 'Settings',
}

const DashboardLayout = () => {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || ''

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar title={title} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
