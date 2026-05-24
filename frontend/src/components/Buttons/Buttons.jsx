import React from 'react'
import styles from './Buttons.module.css'

export const Button = ({
  children, variant = 'primary', size = 'md',
  loading, icon: Icon, onClick, disabled, type = 'button', className = ''
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${loading ? styles.loading : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className={styles.spinner} />}
      {!loading && Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

export const IconButton = ({ icon: Icon, onClick, title, variant = 'ghost', size = 16 }) => (
  <button
    className={`${styles.iconBtn} ${styles[variant]}`}
    onClick={onClick}
    title={title}
    type="button"
  >
    <Icon size={size} />
  </button>
)

export default Button
