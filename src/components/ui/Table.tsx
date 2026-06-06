import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  width?: string
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  compact?: boolean
  className?: string
}

export function Table<T>({ columns, data, onRowClick, compact = false, className = '' }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto scrollbar-thin ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-xs font-medium text-text-secondary py-2 px-3 ${compact ? 'py-1.5' : ''} ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-text-secondary text-xs">
                No data to display
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-border last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-surface-hover' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-3 ${compact ? 'py-1.5' : ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
