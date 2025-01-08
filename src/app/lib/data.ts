export async function loadBedData(
  version: 'GRCh37' | 'GRCh38',
  searchTerm?: string
) {
  const filePath = `/data/${version}.bed`
  const response = await fetch(filePath)
  const text = await response.text()
  
  return text.split('\n')
    .map(line => {
      const trimmedLine = line.trimEnd()
      const [chrom, start, end, location, symbol, refseq, ensembl, strand] = trimmedLine.split('\t')
      return {
        chrom,
        start: parseInt(start),
        end: parseInt(end),
        location,
        symbol,
        refseq,
        ensembl,
        strand,
        version
      }
    })
    .filter(item => {
      if (!searchTerm) return true
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
}