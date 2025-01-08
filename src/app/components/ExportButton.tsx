import { BedData } from '../lib/types'
import { writeTextFile } from '@tauri-apps/plugin-fs'
import { save } from '@tauri-apps/plugin-dialog' // 引入文件保存对话框

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

    try {
      // 使用 Tauri 的文件保存对话框
      const filePath = await save({
        defaultPath: `maneloca_${version}_${new Date().toISOString().slice(0, 10)}.tsv`, // 默认文件名
        filters: [{
          name: 'TSV Files',
          extensions: ['tsv'] // 限制文件类型为 TSV
        }]
      })

      if (filePath) {
        // 保存文件到用户选择的位置
        await writeTextFile(filePath, tsvContent)
        alert('File saved successfully!') // 提示用户保存成功
      }
    } catch (error) {
      console.error('Error saving file:', error)
      alert('Failed to save file.') // 提示用户保存失败
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