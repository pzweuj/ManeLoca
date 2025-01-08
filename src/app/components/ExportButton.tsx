import { BedData } from '../lib/types'
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { save } from '@tauri-apps/api/dialog'

interface ExportButtonProps {
  data: BedData[]
  version: 'GRCh37' | 'GRCh38'
  className?: string
}

export function ExportButton({ data, version, className }: ExportButtonProps) {
  const handleExportTSV = async () => {
    if (data.length === 0) return

    const headers = Object.keys(data[0]).join('\t')
    const rows = data.map(item => 
      Object.values(item).join('\t')
    ).join('\n')
    const tsvContent = `${headers}\n${rows}`

    // 使用 Tauri 的文件保存对话框
    const filePath = await save({
      defaultPath: `maneloca_${version}_${new Date().toISOString()}.tsv`,
      filters: [{
        name: 'Tab Separated Values',
        extensions: ['tsv']
      }]
    })

    if (filePath) {
      await writeTextFile(filePath, tsvContent)
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
