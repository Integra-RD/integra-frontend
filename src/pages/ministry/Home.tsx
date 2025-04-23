import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import api from '../../services/api'
import { toast } from 'react-toastify'

interface Sector {
  id: number
  nombre_sector: string
}
interface CentroRaw {
  id: number
  nombre_centro_educativo: string
  direccion: { sector_id: number }
  ranking_nacional: string
  promedio_calificacion: number
  cantidad_estudiantes: number
  ultima_actualizacion: string
}
interface Centro {
  id: number
  nombre_centro_educativo: string
  sector: number
  ranking_nacional: string
  promedio_calificacion: number
  cantidad_estudiantes: number
  ultima_actualizacion: string
}

const PER_PAGE = 10

const MinistryHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole('ministry', location, navigate)

  const [sectorOptions, setSectorOptions] = useState<Sector[]>([])
  const [selectedSectors, setSelectedSectors] = useState<number[]>([])
  const [rawCenters, setRawCenters] = useState<CentroRaw[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PER_PAGE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .get('/auth/auth-dropdown-options/', { params: { sectores: 'yes' } })
      .then(({ data }) => {
        const sorted = data.sectores.sort((a: any, b: any) =>
          a.nombre_sector.localeCompare(b.nombre_sector)
        )
        setSectorOptions(sorted)
        if (sorted.length) {
          setSelectedSectors([sorted[0].id])
        }
      })
      .catch(() => toast.error('No se pudieron cargar los sectores'))
  }, [])

  useEffect(() => {
    setLoading(true)
    api
      .get('/academic/centro-educativo/list/', {
        params: { centers: pageSize, offset: (page - 1) * pageSize }
      })
      .then(({ data }) => {
        setRawCenters(data.results)
        setTotalCount(data.count)
      })
      .catch(() => toast.error('Error al cargar centros'))
      .finally(() => setLoading(false))
  }, [page, pageSize])

  const centers: Centro[] = rawCenters
    .filter(c => selectedSectors.includes(c.direccion.sector_id))
    .map(c => ({
      id: c.id,
      nombre_centro_educativo: c.nombre_centro_educativo,
      sector: c.direccion.sector_id,
      ranking_nacional: c.ranking_nacional,
      promedio_calificacion: c.promedio_calificacion,
      cantidad_estudiantes: c.cantidad_estudiantes,
      ultima_actualizacion: c.ultima_actualizacion
    }))

  const addFilter = () => {
    if (!sectorOptions.length) return
    setPage(1)
    setSelectedSectors(prev => [...prev, sectorOptions[0].id])
  }
  const updateFilter = (i: number, id: number) => {
    setPage(1)
    setSelectedSectors(prev => {
      const c = [...prev]
      c[i] = id
      return c
    })
  }
  const removeFilter = (i: number) => {
    setPage(1)
    setSelectedSectors(prev => {
      const c = [...prev]
      c.splice(i, 1)
      return c
    })
  }

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Centro', key: 'nombre_centro_educativo' },
    {
      label: 'Sector',
      key: (row: Centro) => sectorOptions.find(s => s.id === row.sector)?.nombre_sector ?? '—'
    }
  ]
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <LayoutWrapper
      navItems={navItems}
      title="Bienvenido al Portal del Ministerio de Educación"
      subtitle="Explora centros educativos y compara su desempeño académico por sector."
    >
      {/* sector filters UI */}
      <div className="flex flex-wrap items-center gap-2 mb-6 px-8">
        {selectedSectors.map((secId, idx) => (
          <div key={idx} className="relative">
            <button
              onClick={() => removeFilter(idx)}
              className="absolute left-2 top-2 z-10 p-1 rounded-full text-gray-400 hover:bg-red-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
            <select
              value={secId}
              onChange={e => updateFilter(idx, +e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              {sectorOptions.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre_sector}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={addFilter}
          className="inline-flex items-center gap-1 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-50"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar otro sector
        </button>
      </div>

      {/* main table or messages */}
      <div className="px-8">
        {selectedSectors.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Selecciona al menos un sector para ver resultados.
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-gray-500">Cargando…</div>
        ) : centers.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No hay centros para los sectores seleccionados.
          </div>
        ) : (
          <>
            <DataTable headers={headers} data={centers} extraFilters={false} />
            {/* pagination below */}
            <div className="flex justify-between items-center mt-4">
              <div>
                Filas por página:{' '}
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(+e.target.value)
                    setPage(1)
                  }}
                  className="border-b"
                >
                  {[5, 10, 15].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 text-gray-600 disabled:text-gray-300"
                >
                  &lt;
                </button>
                <span>
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-2 text-gray-600 disabled:text-gray-300"
                >
                  &gt;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </LayoutWrapper>
  )
}

export default MinistryHome
