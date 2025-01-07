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