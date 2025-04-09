import type React from 'react'
import { useState } from 'react'
import { FunnelIcon, ArrowDownTrayIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface TableHeader {
  label: string
  key: string
}

export interface DataTableProps {
  title: string
  subtitle: string
  headers: TableHeader[]
  data: any[]
  dropdownLabel?: string
  dropdownOptions?: string[]
  extraFilters?: boolean
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  subtitle,
  headers,
  data,
  dropdownLabel,
  dropdownOptions = [],
  extraFilters = false
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pageInput, setPageInput] = useState('1')
  const [selected, setSelected] = useState(dropdownOptions[0] || '')
  const [additionalFilters, setAdditionalFilters] = useState<string[]>([])

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setPageInput(page.toString())
    }
  }

  const handleInputBlur = () => {
    const parsed = Number.parseInt(pageInput)
    if (!isNaN(parsed)) {
      handlePageChange(parsed)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  const addFilter = () => {
    setAdditionalFilters([...additionalFilters, dropdownOptions[0] || ''])
  }

  const updateFilter = (index: number, value: string) => {
    const updatedFilters = [...additionalFilters]
    updatedFilters[index] = value
    setAdditionalFilters(updatedFilters)
  }

  const removeFilter = (index: number) => {
    const updatedFilters = [...additionalFilters]
    updatedFilters.splice(index, 1)
    setAdditionalFilters(updatedFilters)
  }

  return (
    <div className="px-8">
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{subtitle}</p>

      {dropdownLabel && (
        <div className="flex flex-wrap items-center mb-6 gap-4">
          {extraFilters ? (
            <>
              <div className="flex items-center gap-2">
                <select
                  value={selected}
                  onChange={e => setSelected(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none"
                >
                  {dropdownOptions.map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              {additionalFilters.map((value, index) => (
                <div key={index} className="relative flex items-center">
                  <button
                    onClick={() => removeFilter(index)}
                    className="absolute left-2 z-10 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none"
                    aria-label="Remove filter"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <select
                    value={value}
                    onChange={e => updateFilter(index, e.target.value)}
                    className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none"
                  >
                    {dropdownOptions.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div
                className="inline-flex items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-sm"
                onClick={addFilter}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Agregar otro {dropdownLabel.toLowerCase()}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
              >
                {dropdownOptions.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl shadow bg-[#f5faff]/60 w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#e9eef5] text-left text-black">
              <tr>
                {headers.map(header => (
                  <th key={header.key} className="px-6 py-3 font-medium">
                    {header.label}
                  </th>
                ))}
                <th className="px-6 py-3 font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <FunnelIcon className="w-4 h-4 cursor-pointer" />
                    <ArrowDownTrayIcon className="w-4 h-4 cursor-pointer" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f0f4f9]'}>
                  {headers.map(header => (
                    <td key={header.key} className="px-6 py-3">
                      {row[header.key]}
                    </td>
                  ))}
                  <td className="px-6 py-3" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full px-6 py-0 text-sm">
          <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <span>Filas por páginas:</span>
              <select
                className="bg-transparent focus:outline-none"
                value={rowsPerPage}
                onChange={e => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                  setPageInput('1')
                }}
              >
                {[5, 10, 15].map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                className="px-2 text-lg font-medium text-gray-600 disabled:text-gray-300 focus:outline-none hover:text-[#29638A] hover:bg-transparent active:bg-transparent"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>

              <span className="flex items-center space-x-1">
                <span>Page</span>
                <input
                  type="text"
                  className="w-12 text-center border rounded focus:outline-none"
                  value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onBlur={handleInputBlur}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleInputBlur()
                    }
                  }}
                />
                <span>of {totalPages}</span>
              </span>

              <button
                className="px-2 text-lg font-medium text-gray-600 disabled:text-gray-300 focus:outline-none hover:text-[#29638A] hover:bg-transparent active:bg-transparent"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
