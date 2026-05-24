import React from 'react'

const Logo = ({ size = 32, showText = true, collapsed = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
    {/* AA Shield Icon */}
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill="#1565D8"/>
      <path d="M8 10L20 6L32 10V22C32 28.627 26.627 34 20 34C13.373 34 8 28.627 8 22V10Z" fill="#1565D8" stroke="#fff" strokeWidth="1.5"/>
      <path d="M14 26L18 14L20 20L22 14L26 26" stroke="#F57C00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 22H24.5" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
    </svg>

    {showText && !collapsed && (
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15,
          color: 'var(--text-primary)', letterSpacing: '-0.3px'
        }}>
          <span style={{ color: 'var(--brand-blue)' }}>ACROSS</span>{' '}
          <span style={{ color: 'var(--brand-orange)' }}>ASSIST</span>
        </span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px', fontWeight: 500 }}>
          TRUST · CARE · PROTECT
        </span>
      </div>
    )}
  </div>
)

export default Logo