import type React from 'react'
import { useState } from 'react'
import { FunnelIcon, ArrowDownTrayIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface TableHeader {
  label: string
  key: string | ((row: any) => React.ReactNode);
}

export interface DataTableProps {
  headers: TableHeader[]
  data: any[]
  dropdownLabel?: string
  dropdownOptions?: string[]
  extraFilters?: boolean | 'with-person-type'
  onPersonTypeChange?: (type: string) => void
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  dropdownLabel,
  dropdownOptions = [],
  extraFilters = false,
  onPersonTypeChange
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [pageInput, setPageInput] = useState('1')
  const [selected, setSelected] = useState(dropdownOptions[0] || '')
  const [additionalFilters, setAdditionalFilters] = useState<string[]>([])
  const [personType, setPersonType] = useState('all');

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
  const handlePersonTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPersonType(value);
    if (onPersonTypeChange) {
      onPersonTypeChange(value); // Notifica al componente padre
    }
  };

  return (
    <div className="px-8">
      {/* Contenedor de filtros reorganizado */}
      <div className="mb-6 space-y-4">
        {/* Filtro de tipo de persona */}
        {extraFilters === 'with-person-type' && (
            <div className="flex items-center gap-4">
              <select 
                value={personType}
                onChange={handlePersonTypeChange}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm"
              >
                <option value="all">Estudiantes</option>
                <option value="teacher">Profesores</option>
              </select>
            </div>
          )}

        {/* Filtro de cursos (existente) */}
        {dropdownLabel && (
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            >
              {dropdownOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>

            {extraFilters && (
              <button
                onClick={addFilter}
                className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Agregar otro curso
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabla - Asegúrate que este contenedor se muestre */}
      {data.length > 0 ? (
        <div className="rounded-2xl shadow bg-[#f5faff]/60 w-full overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#e9eef5] text-left text-black">
                <tr>
                  {headers.map((header) => (
                    <th key={header.key} className="px-6 py-3 font-medium">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f0f4f9]'}>
                    {headers.map((header) => (
                      <td key={header.key} className="px-6 py-3">
                        {row[header.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación... (mantén tu código existente) */}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
}

export default DataTable
