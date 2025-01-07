'use client'

import { useState, useEffect } from 'react'

interface CoordinateSearchProps {
  onSearch: (chrom: string, pos: number, resetPage: boolean) => void // 新增 resetPage 参数
}

export function CoordinateSearch({ onSearch }: CoordinateSearchProps) {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    // 使用防抖技术，避免频繁触发搜索
    const debounceTimer = setTimeout(() => {
      const [chrom, pos] = inputValue.split(':')
      const position = parseInt(pos, 10)

      // 只有输入内容符合格式时才会触发搜索
      if (chrom && !isNaN(position)) {
        onSearch(chrom, position, true) // 设置为 true 来重置页码
      } else {
        onSearch('', 0, false) // 清空搜索结果，不重置页码
      }
    }, 300) // 防抖时间设置为 300ms

    return () => clearTimeout(debounceTimer) // 清除定时器
  }, [inputValue, onSearch])

  return (
    <div className="mb-4">
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Input location (Example: chr7:55242465)"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
