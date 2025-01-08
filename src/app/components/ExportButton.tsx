interface ExportButtonProps {
    data: any[]
    version: 'GRCh37' | 'GRCh38'
    className?: string
  }
  
  export function ExportButton({ data, version, className }: ExportButtonProps) {
    const handleExportTSV = () => {
      if (data.length === 0) return
      
      const headers = Object.keys(data[0]).join('\t')
      const rows = data.map(item => 
        Object.values(item).join('\t')
      ).join('\n')
      const tsvContent = `${headers}\n${rows}`
      
      const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `maneloca_${version}_${new Date().toISOString()}.tsv`
      link.click()
      URL.revokeObjectURL(url)
    }
  
    return (
      <button
        onClick={handleExportTSV}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`}
        disabled={data.length === 0}
      >
        Export
      </button>
    )
  }