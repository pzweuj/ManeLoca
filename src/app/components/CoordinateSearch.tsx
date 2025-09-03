'use client'

import { useState, useEffect } from 'react'

interface CoordinateSearchProps {
  onSearch: (chrom: string, pos: number, resetPage: boolean) => void
  className?: string
}

export function CoordinateSearch({ onSearch, className }: CoordinateSearchProps) {
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
    <div className={`flex items-center ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Input location (Example: chr7:55242465)"
          className="w-full px-4 py-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            title="Clear input"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
