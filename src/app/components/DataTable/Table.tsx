'use client'

import { StableTable } from './StableTable'
import { stableColumns } from './columns'
import { BedData } from './columns'

interface DataTableProps {
  data: BedData[]
  onColumnFilter: (columnId: string, value: string) => void
}

export function DataTable({
  data,
  onColumnFilter,
}: DataTableProps) {
  return (
    <StableTable
      columns={stableColumns}
      data={data}
      onColumnFilter={onColumnFilter}
    />
  )
}