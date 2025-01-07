export interface BedData {
    chrom: string
    start: number
    end: number
    location: string
    symbol: string
    refseq: string
    ensembl: string
    strand: string
    version?: 'GRCh37' | 'GRCh38'
  }