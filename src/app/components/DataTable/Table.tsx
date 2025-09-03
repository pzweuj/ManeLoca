'use client'

import { StableTable } from './StableTable'
import { stableColumns } from './columns'
import { BedData } from './columns'

interface DataTableProps {
  data: BedData[]
  onColumnFilter: (columnId: string, value: string) => void
  onExactMatchToggle: (columnId: string, isExact: boolean) => void
  exactMatchModes: Record<string, boolean>
}

export function DataTable({
  data,
  onColumnFilter,
  onExactMatchToggle,
  exactMatchModes,
}: DataTableProps) {
  return (
    <StableTable
      columns={stableColumns}
      data={data}
      onColumnFilter={onColumnFilter}
      onExactMatchToggle={onExactMatchToggle}
      exactMatchModes={exactMatchModes}
    />
  )
}