import React from 'react'
import styles from './Cards.module.css'

export const KpiCard = ({ label, value, delta, deltaType = 'neutral', icon: Icon, color }) => {
  const isPositive = deltaType === 'up' || (delta && delta.startsWith('+'))
  const isNegative = deltaType === 'down' || (delta && delta.startsWith('-'))

  return (
    <div className={styles.kpiCard}>
      {Icon && (
        <div className={styles.kpiIconWrap} style={{ background: color ? `${color}18` : '#EBF2FF' }}>
          <Icon size={18} style={{ color: color || 'var(--brand-blue)' }} />
        </div>
      )}
      <div className={styles.kpiBody}>
        <p className={styles.kpiLabel}>{label}</p>
        <p className={styles.kpiValue}>{value}</p>
        {delta && (
          <span className={`${styles.kpiDelta} ${isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

export const StatCard = ({ label, value, delta, icon: Icon, iconColor }) => (
  <div className={styles.statCard}>
    <div className={styles.statTop}>
      {delta && (
        <span className={`${styles.statDelta} ${delta.startsWith('-') ? styles.negative : styles.positive}`}>
          ↑ {delta}
        </span>
      )}
    </div>
    {Icon && <Icon size={20} style={{ color: iconColor || 'var(--brand-blue)' }} />}
    <p className={styles.statValue}>{value}</p>
    <p className={styles.statLabel}>{label}</p>
  </div>
)

export const SectionCard = ({ title, children, action, className = '' }) => (
  <div className={`${styles.sectionCard} ${className}`}>
    {(title || action) && (
      <div className={styles.sectionHeader}>
        {title && <h3 className={styles.sectionTitle}>{title}</h3>}
        {action && <div className={styles.sectionAction}>{action}</div>}
      </div>
    )}
    {children}
  </div>
)

export const AlertCard = ({ type = 'info', icon, title, count }) => {
  const colors = {
    danger: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', icon: '#EF4444' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', icon: '#F59E0B' },
    info: { bg: '#EBF5FF', border: '#BFDBFE', text: '#1D4ED8', icon: '#3B82F6' },
  }
  const c = colors[type] || colors.info

  return (
    <div className={styles.alertCard} style={{ background: c.bg, borderColor: c.border }}>
      <div className={styles.alertLeft}>
        <span style={{ fontSize: 16, color: c.icon }}>{icon || '⚠'}</span>
        <span className={styles.alertTitle} style={{ color: c.text }}>{title}</span>
      </div>
      {count !== undefined && (
        <span className={styles.alertCount} style={{ background: c.icon }}>{count}</span>
      )}
    </div>
  )
}
