'use client'

import { useEffect, useRef, useCallback } from 'react'

interface StableTableProps<TData> {
  columns: Array<{
    id: string
    header: string
    accessorKey: string
    canFilter?: boolean
  }>
  data: TData[]
  onColumnFilter: (columnId: string, value: string) => void
}

export function StableTable<TData extends Record<string, any>>({
  columns,
  data,
  onColumnFilter,
}: StableTableProps<TData>) {
  const tbodyRef = useRef<HTMLTableSectionElement>(null)
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())
  const filterTimeoutRef = useRef<NodeJS.Timeout>()

  // Create stable row elements that persist across renders
  const createRowElement = useCallback((item: TData, index: number) => {
    const rowId = `row-${index}-${JSON.stringify(item).slice(0, 50)}`
    
    if (rowRefs.current.has(rowId)) {
      return rowRefs.current.get(rowId)!
    }

    const row = document.createElement('tr')
    row.className = 'border-b hover:bg-gray-50'
    row.setAttribute('data-row-id', rowId)
    
    // Make text selectable
    row.style.userSelect = 'text'
    row.style.webkitUserSelect = 'text'
    
    columns.forEach((column) => {
      const cell = document.createElement('td')
      cell.className = 'px-4 py-2 whitespace-nowrap'
      cell.style.userSelect = 'text'
      cell.style.webkitUserSelect = 'text'
      cell.textContent = String(item[column.accessorKey] || '')
      row.appendChild(cell)
    })

    rowRefs.current.set(rowId, row)
    return row
  }, [columns])

  // Update table body without destroying DOM nodes
  const updateTableBody = useCallback(() => {
    if (!tbodyRef.current) return

    // Clear current display
    const tbody = tbodyRef.current
    
    // Hide all existing rows first
    Array.from(tbody.children).forEach(child => {
      if (child instanceof HTMLElement) {
        child.style.display = 'none'
      }
    })

    // Show/create rows for current data
    data.forEach((item, index) => {
      const row = createRowElement(item, index)
      
      // Update cell contents if data changed
      columns.forEach((column, colIndex) => {
        const cell = row.children[colIndex] as HTMLTableCellElement
        if (cell) {
          const newValue = String(item[column.accessorKey] || '')
          if (cell.textContent !== newValue) {
            cell.textContent = newValue
          }
        }
      })

      // Show the row
      row.style.display = ''
      
      // Append to tbody if not already there
      if (!tbody.contains(row)) {
        tbody.appendChild(row)
      }
    })

    // Show "no data" message if needed
    if (data.length === 0) {
      let noDataRow = tbody.querySelector('[data-no-data]') as HTMLTableRowElement
      if (!noDataRow) {
        noDataRow = document.createElement('tr')
        noDataRow.setAttribute('data-no-data', 'true')
        const cell = document.createElement('td')
        cell.colSpan = columns.length
        cell.className = 'text-center py-4'
        cell.textContent = 'No data found!'
        noDataRow.appendChild(cell)
        tbody.appendChild(noDataRow)
      }
      noDataRow.style.display = ''
    } else {
      const noDataRow = tbody.querySelector('[data-no-data]')
      if (noDataRow instanceof HTMLElement) {
        noDataRow.style.display = 'none'
      }
    }
  }, [data, columns, createRowElement])

  // Update table when data changes
  useEffect(() => {
    updateTableBody()
  }, [updateTableBody])

  // Debounced filter handler to reduce rapid updates
  const handleFilterChange = useCallback((columnId: string, value: string) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current)
    }
    
    filterTimeoutRef.current = setTimeout(() => {
      onColumnFilter(columnId, value)
    }, 150)
  }, [onColumnFilter])

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="px-4 py-2 whitespace-nowrap">
                  <div className="text-left">
                    {column.header}
                  </div>
                  {column.canFilter && (
                    <div className="mt-2">
                      <input
                        type="text"
                        onChange={e => handleFilterChange(column.id, e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        style={{ userSelect: 'text' }}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={tbodyRef} style={{ userSelect: 'text' }}>
            {/* Rows will be managed by DOM manipulation */}
          </tbody>
        </table>
      </div>
    </div>
  )
}
