import { BedData } from '../lib/types'

// 添加类型声明
declare global {
  interface Window {
    electronAPI?: {
      showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>
      writeFile: (options: { filePath: string; content: string }) => Promise<void>
    }
  }
}

interface ExportButtonProps {
    data: BedData[]
    version: 'GRCh37' | 'GRCh38'
    className?: string
}

export function ExportButton({ data, version, className }: ExportButtonProps) {
    const handleExportTSV = async () => {
        if (data.length === 0) {
            alert('No data to export!')
            return
        }
        
        try {
            const headers = Object.keys(data[0]).join('\t')
            const rows = data.map(item => 
                Object.values(item).join('\t')
            ).join('\n')
            const tsvContent = `${headers}\n${rows}`
            
            // 检测是否在Electron环境中
            if (typeof window !== 'undefined' && window.electronAPI) {
                // Electron环境
                const result = await window.electronAPI.showSaveDialog({
                    title: 'Save File',
                    defaultPath: `maneloca_${version}_${new Date().toISOString().slice(0, 10)}.tsv`,
                    filters: [
                        { name: 'TSV Files', extensions: ['tsv'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                })
                
                if (!result.canceled && result.filePath) {
                    await window.electronAPI.writeFile({
                        filePath: result.filePath,
                        content: tsvContent
                    })
                    alert('File saved successfully')
                }
            } else {
                // 非Electron环境，使用原来的下载方式
                const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `maneloca_${version}_${new Date().toISOString().slice(0, 10)}.tsv`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
                alert('File download started')
            }
        } catch (error) {
            console.error('Export file failed:', error)
            alert(`Export file failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
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