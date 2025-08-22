'use client'

import { useEffect, useState } from 'react'
import { DataTable } from './components/DataTable/Table'
import { loadBedData } from './lib/data'
import { VersionSwitch } from './components/VersionSwitch'
import { BedData } from './lib/types'
import { CoordinateSearch } from './components/CoordinateSearch'
import { FaGithub } from 'react-icons/fa'
import { ExportButton } from './components/ExportButton'

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const [jumpPage, setJumpPage] = useState('')

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        &lt;
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        &gt;
      </button>

      <div className="ml-4 flex items-center space-x-2">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={e => setJumpPage(e.target.value)}
          className="w-20 px-2 py-1 border rounded"
          placeholder="Page"
        />
        <button
          onClick={handleJump}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Go
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  const [allData, setAllData] = useState<BedData[]>([])
  const [filteredData, setFilteredData] = useState<BedData[]>([])
  const [version, setVersion] = useState<'GRCh37' | 'GRCh38'>('GRCh37')
  const [currentPage, setCurrentPage] = useState(1)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [searchResult, setSearchResult] = useState<BedData[]>([])

  const pageSize = 20

  useEffect(() => {
    const loadData = async () => {
      const data = await loadBedData(version)
      setAllData(data)
      
      // 先应用列筛选
      let filtered = data
      Object.entries(columnFilters).forEach(([columnId, value]) => {
        if (value) {
          filtered = filtered.filter(item =>
            String(item[columnId as keyof BedData])
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        }
      })
      
      // 如果存在坐标搜索结果，则应用坐标搜索
      if (searchResult.length > 0) {
        // 确保搜索结果来自当前版本的数据
        filtered = filtered.filter(item => 
          searchResult.some(result => 
            result.chrom === item.chrom &&
            result.start === item.start &&
            result.end === item.end
          )
        )
      }
      
      setFilteredData(filtered)
      setCurrentPage(1)
    }
    loadData()
  }, [version])

  useEffect(() => {
    let filtered = allData

    // 先处理列筛选
    Object.entries(columnFilters).forEach(([columnId, value]) => {
      if (value) {
        filtered = filtered.filter(item =>
          String(item[columnId as keyof BedData])
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      }
    })

    // 如果坐标搜索有结果，优先显示坐标搜索结果
    if (searchResult.length > 0) {
      filtered = searchResult
    }

    // 更新过滤后的数据
    setFilteredData(filtered)

    // 重新计算总页数
    const totalPages = Math.ceil(filtered.length / pageSize)

    // 如果当前页码大于总页数，则重置为最后一页
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (filtered.length === 0) {
      setCurrentPage(1)  // 如果没有数据，重置到第一页
    }
  }, [columnFilters, allData, searchResult])

  const handleColumnFilter = (columnId: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: value
    }))
  }

  const handleCoordinateSearch = (chrom: string, pos: number, resetPage: boolean) => {
    if (chrom && pos > 0) {
      const result = allData
        .filter(item => item.chrom === chrom && item.start <= pos && item.end >= pos)
        .sort((a, b) => Math.abs(pos - a.start) - Math.abs(pos - b.start))
        .slice(0, 1)

      // 更新搜索结果时同时更新过滤数据
      setSearchResult(result)
      setFilteredData(result)
      if (resetPage) {
        setCurrentPage(1)
      }
    } else {
      // 清空搜索时恢复所有数据
      setSearchResult([])
      setFilteredData(allData)
    }
  }

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ManeLoca</h1>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/pzweuj/ManeLoca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <VersionSwitch 
            version={version}
            onVersionChange={setVersion}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <CoordinateSearch 
                onSearch={handleCoordinateSearch} 
                className="h-[42px]"
              />
            </div>
            <div className="flex-shrink-0">
              <ExportButton 
                data={filteredData} 
                version={version}
                className="h-[42px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 优化后的表格容器 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="min-w-[800px]">
              <DataTable 
                data={paginatedData}
                onColumnFilter={handleColumnFilter}
              />
              {paginatedData.length === 0 && (
                <div className="text-center text-gray-500 py-4"></div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* 分页组件 */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  )
}
