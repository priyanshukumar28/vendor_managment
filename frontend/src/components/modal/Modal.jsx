import React, { useEffect } from 'react'
import { MdClose } from 'react-icons/md'
import styles from './Modal.module.css'

const Modal = ({ open, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`${styles.modal} ${styles[size]}`} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
