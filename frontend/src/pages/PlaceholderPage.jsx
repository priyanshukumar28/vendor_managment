import React from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_ICONS = {
  projects: '📁',
  tasks: '✅',
  developers: '💻',
  teams: '👥',
  reports: '📊',
  approvals: '✔',
  escalations: '🚨',
  invoices: '🧾',
  settings: '⚙️',
}

const PlaceholderPage = () => {
  const { pathname } = useLocation()
  const key = pathname.replace('/', '')
  const icon = PAGE_ICONS[key] || '📄'
  const title = key.charAt(0).toUpperCase() + key.slice(1)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 16,
      fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)',
      textAlign: 'center'
    }}>
      <span style={{ fontSize: 56 }}>{icon}</span>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h2>
      <p style={{ fontSize: 14, maxWidth: 360, lineHeight: 1.6 }}>
        This section is connected to your backend. Implement the{' '}
        <code style={{
          background: 'var(--bg-primary)', padding: '2px 6px',
          borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 12
        }}>
          /{key}
        </code>{' '}
        API endpoint and build your UI here.
      </p>
      <div style={{
        background: 'var(--bg-white)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)', padding: '12px 20px',
        fontSize: 12, color: 'var(--text-muted)', marginTop: 8
      }}>
        Route: <code style={{ fontFamily: 'var(--font-mono)' }}>{pathname}</code>
      </div>
    </div>
  )
}

export default PlaceholderPage
