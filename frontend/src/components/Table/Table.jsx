import React from 'react'
import styles from './Table.module.css'

const Table = ({ columns, data, loading, onRowClick, emptyMessage = 'No data found' }) => {
  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <span>Loading data...</span>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <span className={styles.emptyIcon}>📋</span>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || row._id || i}
              className={`${styles.tr} ${onRowClick ? styles.clickable : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Pagination = ({ page, totalPages, onPageChange, totalItems, pageSize }) => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className={styles.pagination}>
      <span className={styles.pageInfo}>
        Showing {Math.min((page - 1) * pageSize + 1, totalItems)}–{Math.min(page * pageSize, totalItems)} of {totalItems}
      </span>
      <div className={styles.pageControls}>
        <button className={styles.pageBtn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        {pages.map(p => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.pageActive : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Table
