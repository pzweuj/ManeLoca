import { ColumnDef } from '@tanstack/react-table'

export type BedData = {
  chrom: string
  start: number
  end: number
  location: string
  symbol: string
  refseq: string
  ensembl: string
  strand: string
}

export const stableColumns = [
  {
    id: 'chrom',
    accessorKey: 'chrom',
    header: 'Chrom',
    canFilter: true,
  },
  {
    id: 'start',
    accessorKey: 'start',
    header: 'Start',
    canFilter: true,
  },
  {
    id: 'end',
    accessorKey: 'end',
    header: 'End',
    canFilter: true,
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: 'Location',
    canFilter: true,
  },
  {
    id: 'symbol',
    accessorKey: 'symbol',
    header: 'Symbol',
    canFilter: true,
  },
  {
    id: 'refseq',
    accessorKey: 'refseq',
    header: 'RefSeq',
    canFilter: true,
  },
  {
    id: 'ensembl',
    accessorKey: 'ensembl',
    header: 'Ensembl',
    canFilter: true,
  },
  {
    id: 'strand',
    accessorKey: 'strand',
    header: 'Strand',
    canFilter: true,
  },
]

// Keep original columns for backward compatibility
export const columns: ColumnDef<BedData>[] = [
  {
    accessorKey: 'chrom',
    header: 'Chrom',
  },
  {
    accessorKey: 'start',
    header: 'Start',
    cell: ({ row }) => row.original.start,
  },
  {
    accessorKey: 'end',
    header: 'End',
    cell: ({ row }) => row.original.end,
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'refseq',
    header: 'RefSeq',
  },
  {
    accessorKey: 'ensembl',
    header: 'Ensembl',
  },
  {
    accessorKey: 'strand',
    header: 'Strand',
  },
]