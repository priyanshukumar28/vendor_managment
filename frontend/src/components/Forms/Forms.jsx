import React from 'react'
import styles from './Forms.module.css'

export const FormField = ({ label, required, error, children, hint }) => (
  <div className={styles.field}>
    {label && (
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className={styles.hint}>{hint}</p>}
    {error && <p className={styles.error}>{error}</p>}
  </div>
)

export const Input = React.forwardRef(({ icon: Icon, error, ...props }, ref) => (
  <div className={styles.inputWrap}>
    {Icon && <Icon size={15} className={styles.inputIcon} />}
    <input
      ref={ref}
      className={`${styles.input} ${Icon ? styles.withIcon : ''} ${error ? styles.inputError : ''}`}
      {...props}
    />
  </div>
))
Input.displayName = 'Input'

export const Select = React.forwardRef(({ error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={`${styles.select} ${error ? styles.inputError : ''}`}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'

export const Textarea = React.forwardRef(({ error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`${styles.textarea} ${error ? styles.inputError : ''}`}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const FormRow = ({ children, cols = 2 }) => (
  <div className={styles.formRow} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {children}
  </div>
)
