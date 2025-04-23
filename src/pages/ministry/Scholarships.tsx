import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import {
  AcademicCapIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  PencilSquareIcon,
  UserGroupIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'
import ChartWrapper from '../../components/ChartWrapper'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import FileUploader from '../../components/FileUploader'
import api from '../../services/api'

import logoINTEC from '../../assets/inteclogo.png'
import logoPUCMM from '../../assets/pucmmlogo.png'
import logoUNIBE from '../../assets/unibelogo.png'
import logoUNPHU from '../../assets/unphulogo.png'
import logoPlaceholder from '../../assets/integraLogo.svg'

// Types
interface Scholarship {
  id: number
  nombre_beca: string
  tipo_beca: string
  estado_beca: string
  promedio_requerido: string
  institucion_proveedora: string
  duracion: string
  cobertura: string
  created_at?: string
}

interface University {
  name: string
  programs: string
  logo: string
}

interface ToastProps {
  visible: boolean
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

interface DeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  scholarshipName: string
}

interface EditModalProps {
  open: boolean
  onClose: () => void
  data: Scholarship | null
  onSave: (updated: Scholarship) => Promise<void>
}

interface FileUploaderRef {
  clearFile: () => void
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    tension?: number
  }[]
}

// Constants
const CATEGORIES = [
  { full: 'Nacional', label: 'Nacional' },
  { full: 'Internacional', label: 'Internac.' },
  { full: 'Deportiva', label: 'Deport.' },
  { full: 'Técnica', label: 'Técnicas' }
]

const institutionLogos: Record<string, string> = {
  INTEC: logoINTEC,
  PUCMM: logoPUCMM,
  UNIBE: logoUNIBE,
  UNPHU: logoUNPHU
}

const getBarChartData = (list: Scholarship[]): ChartData => {
  const counts = CATEGORIES.map(
    ({ full }) => list.filter(s => s.tipo_beca?.toLowerCase().startsWith(full.toLowerCase())).length
  )

  return {
    labels: CATEGORIES.map(c => c.label),
    datasets: [
      {
        label: 'Becas',
        data: counts,
        backgroundColor: '#2563eb'
      }
    ]
  }
}

const getLineChartData = (list: Scholarship[]): ChartData => {
  const FECHA_KEY = 'created_at'
  const byYear: Record<number, number[]> = {}

  list.forEach(item => {
    if (!item[FECHA_KEY]) return
    const date = new Date(item[FECHA_KEY])
    if (isNaN(date.getTime())) return
    const y = date.getFullYear()
    const q = Math.floor(date.getMonth() / 3)
    if (!byYear[y]) byYear[y] = [0, 0, 0, 0]
    byYear[y][q] += 1
  })

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)
    .slice(0, 2)

  const palette = ['#94a3b8', '#2563eb']

  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: years.reverse().map((year, i) => ({
      label: `${year}`,
      data: byYear[year],
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length] + '20',
      tension: 0.4
    }))
  }
}

const getUniversitiesFromScholarships = (list: Scholarship[]): University[] =>
  Object.entries(
    list.reduce<Record<string, number>>((acc, s) => {
      const n = s.institucion_proveedora
      if (!n) return acc
      acc[n] = (acc[n] || 0) + 1
      return acc
    }, {})
  ).map(([name, count]) => ({
    name,
    programs: `${count} Programa${count > 1 ? 's' : ''} Disponible${count > 1 ? 's' : ''}`,
    logo: institutionLogos[name] || logoPlaceholder
  }))

const getActiveScholarshipsCount = (list: Scholarship[]): number =>
  list.filter(s => s.estado_beca?.toLowerCase() === 'activo').length

const estimateTotalFunds = (list: Scholarship[]): number =>
  list.reduce((t: number, s: Scholarship) => {
    const d = Number.parseInt(s.duracion)
    return isNaN(d) ? t : t + d * 100000
  }, 0)

const Toast: React.FC<ToastProps> = ({ visible, message, type, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!visible) return null

  const bgColor =
    type === 'success'
      ? 'bg-green-50 border-green-500'
      : type === 'error'
        ? 'bg-red-50 border-red-500'
        : 'bg-blue-50 border-blue-500'

  const textColor =
    type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800'

  const iconColor =
    type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500'

  const Icon =
    type === 'success'
      ? CheckIcon
      : type === 'error'
        ? ExclamationTriangleIcon
        : ClipboardDocumentCheckIcon

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center p-4 mb-4 rounded-lg border ${bgColor}`} role="alert">
        <Icon className={`flex-shrink-0 w-5 h-5 ${iconColor}`} />
        <div className={`ml-3 text-sm font-medium ${textColor}`}>{message}</div>
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${textColor} hover:bg-gray-100`}
          onClick={onClose}
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onConfirm, scholarshipName }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>

        <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
          Confirmar eliminación
        </h3>

        <p className="text-sm text-gray-500 text-center mb-6">
          ¿Estás seguro que deseas eliminar la beca{' '}
          <span className="font-semibold">{scholarshipName}</span>? Esta acción no se puede
          deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

const EditModal: React.FC<EditModalProps> = ({ open, onClose, data, onSave }) => {
  const [form, setForm] = useState<Scholarship | null>(data || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => setForm(data || null), [data])

  if (!open || !data || !form) return null

  const handleChange = (k: keyof Scholarship, v: string) => {
    setForm(prev => (prev ? { ...prev, [k]: v } : null))
  }

  const handleSubmit = async () => {
    if (!form) return

    setIsSubmitting(true)
    try {
      await onSave(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <PencilSquareIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Editar Beca</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {[
            { k: 'tipo_beca' as const, label: 'Tipo de beca' },
            { k: 'nombre_beca' as const, label: 'Nombre' },
            { k: 'estado_beca' as const, label: 'Estado (activo/inactivo)' },
            { k: 'promedio_requerido' as const, label: 'Promedio requerido' },
            { k: 'institucion_proveedora' as const, label: 'Institución' },
            { k: 'duracion' as const, label: 'Duración (años)' },
            { k: 'cobertura' as const, label: 'Cobertura (%)' }
          ].map(({ k, label }) => (
            <div key={k} className="space-y-1">
              <label htmlFor={k} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={k}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={form[k] ?? ''}
                onChange={e => handleChange(k, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <PencilSquareIcon className="w-4 h-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const Scholarships: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole('ministry', location, navigate)

  const uploaderRef = useRef<FileUploaderRef | null>(null)

  const [scholarshipList, setScholarshipList] = useState<Scholarship[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [barChartData, setBarChartData] = useState<ChartData>({ labels: [], datasets: [] })
  const [_, setLineChartData] = useState<ChartData>({ labels: [], datasets: [] })

  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<Scholarship | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [scholarshipToDelete, setScholarshipToDelete] = useState<{
    id: number
    name: string
  } | null>(null)

  const [toast, setToast] = useState<{
    visible: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    visible: false,
    message: '',
    type: 'info'
  })

  const perPage = 5

  const recomputeCharts = (list: Scholarship[]) => {
    setBarChartData(getBarChartData(list))
    setLineChartData(getLineChartData(list))
  }

  const fetchAllScholarships = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/academic/becas/list/', {
        params: {
          becas: 1000,
          offset: 0
        }
      })

      if (response.data.count && response.data.results) {
        const totalRecords = response.data.count
        const initialResults = response.data.results

        if (initialResults.length >= totalRecords) {
          setScholarshipList(initialResults)
          recomputeCharts(initialResults)
          showToast(`Cargadas ${initialResults.length} becas`, 'success')
        } else {
          await fetchAllPages(response.data)
        }
      } else {
        const records = response.data.results || response.data
        setScholarshipList(records)
        recomputeCharts(records)
        showToast(`Cargadas ${records.length} becas`, 'success')
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      showToast('Error al cargar todas las becas', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllPages = async (initialData: any) => {
    try {
      setLoadingMore(true)
      const totalRecords = initialData.count
      const pageSize = initialData.results.length
      const totalPages = Math.ceil(totalRecords / pageSize)

      let allRecords = [...initialData.results]
      showToast(`Cargando página 1 de ${totalPages}...`, 'info')

      for (let page = 2; page <= totalPages; page++) {
        showToast(`Cargando página ${page} de ${totalPages}...`, 'info')
        const response = await api.get('/academic/becas/list/', {
          params: {
            becas: pageSize,
            offset: (page - 1) * pageSize
          }
        })

        if (response.data.results && response.data.results.length > 0) {
          allRecords = [...allRecords, ...response.data.results]
        }
      }

      setScholarshipList(allRecords)
      recomputeCharts(allRecords)
      showToast(`Cargadas ${allRecords.length} becas`, 'success')
    } catch (error) {
      console.error('Error fetching all pages:', error)
      showToast('Error al cargar todas las páginas', 'error')
    } finally {
      setLoadingMore(false)
    }
  }

  const fetchWithoutPagination = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/academic/becas/all/', {
        params: { becas: 10000, no_pagination: true }
      })
      const records = response.data.results ?? response.data
      setScholarshipList(records)
      recomputeCharts(records)
      showToast(`Cargadas ${records.length} becas`, 'success')
    } catch (error) {
      console.error('Error fetching without pagination:', error)
      fetchAllScholarships()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWithoutPagination().catch(() => fetchAllScholarships())
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      visible: true,
      message,
      type
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }))
  }

  const confirmDelete = (id: number, name: string) => {
    setScholarshipToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!scholarshipToDelete) return

    try {
      await api.delete(`/academic/becas/${scholarshipToDelete.id}/`)
      showToast('Beca eliminada correctamente', 'success')
      const updated = scholarshipList.filter(s => s.id !== scholarshipToDelete.id)
      setScholarshipList(updated)
      recomputeCharts(updated)
    } catch (error) {
      console.error('Error deleting scholarship:', error)
      showToast('No se pudo eliminar la beca', 'error')
    } finally {
      setDeleteModalOpen(false)
      setScholarshipToDelete(null)
    }
  }

  const openEdit = (s: Scholarship) => {
    setSelected(s)
    setEditOpen(true)
  }

  const saveEdit = async (updated: Scholarship): Promise<void> => {
    try {
      await api.put(`/academic/becas/${updated.id}/`, updated)
      showToast('Beca actualizada correctamente', 'success')
      const newList = scholarshipList.map(s => (s.id === updated.id ? updated : s))
      setScholarshipList(newList)
      recomputeCharts(newList)
      setEditOpen(false)
    } catch (error) {
      console.error('Error updating scholarship:', error)
      showToast('No se pudo actualizar la beca', 'error')
      return Promise.reject(error)
    }
  }

  const totalPages = Math.ceil(scholarshipList.length / perPage)
  const currentScholarships = scholarshipList.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const activeScholarships = getActiveScholarshipsCount(scholarshipList)
  const estimatedFunds = estimateTotalFunds(scholarshipList)

  return (
    <LayoutWrapper
      title="Becas y Programas"
      subtitle="Visualiza, administra y evalúa los programas de becas disponibles en todo el sistema educativo nacional e internacional."
      navItems={navItems}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        scholarshipName={scholarshipToDelete?.name || ''}
      />

      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={selected}
        onSave={saveEdit}
      />

      <div className="mb-10">
        <FileUploader
          ref={uploaderRef}
          title="Importar Becas"
          description="Sube un archivo .xlsx con los datos de nuevas becas"
          templatePath="/scholarships-import-template.xlsx"
          buttonText="Subir Archivo"
          downloadButtonText="Descargar Plantilla"
          instructions={[
            'El archivo debe incluir columnas: tipo_beca, nombre_beca, estado_beca, promedio_requerido, institucion_proveedora, duracion, cobertura.',
            'Asegúrate de que los valores estén correctamente formateados.',
            'No dejes filas vacías ni encabezados duplicados.'
          ]}
          onFileUpload={async file => {
            const formData = new FormData()
            formData.append('file', file)

            try {
              setIsLoading(true)
              await api.post('/academic/becas/bulk-upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
              showToast('Archivo importado correctamente!', 'success')
              await new Promise(r => setTimeout(r, 500))
              showToast('Archivo subido, renderizando página con nuevos records...', 'info')
              await new Promise(r => setTimeout(r, 1500))
              uploaderRef.current?.clearFile()
              fetchWithoutPagination().catch(() => fetchAllScholarships())
            } catch (error) {
              console.error('Error uploading file:', error)
              showToast('Error al importar el archivo', 'error')
            } finally {
              setIsLoading(false)
            }
          }}
        />
      </div>

      {loadingMore && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-sm text-blue-700">Cargando datos adicionales...</p>
          </div>
          <p className="text-xs text-blue-600">
            {scholarshipList.length} becas cargadas hasta ahora
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <ViewCard
          title="Total de Becas Activas"
          subtitle={activeScholarships.toLocaleString()}
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<AcademicCapIcon className="w-8 h-8 text-black" />}
        />
        <ViewCard
          title="Total de Beneficiarios"
          subtitle={(activeScholarships * 5).toLocaleString()}
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<UserGroupIcon className="w-8 h-8 text-black" />}
        />
        <ViewCard
          title="Fondos Asignados"
          subtitle={`RD$${estimatedFunds.toLocaleString()}`}
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<BanknotesIcon className="w-8 h-8 text-black" />}
        />
        <ViewCard
          title="Total de Becas"
          subtitle={scholarshipList.length.toLocaleString()}
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<ClipboardDocumentCheckIcon className="w-8 h-8 text-black" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Cargando becas...</div>
          ) : currentScholarships.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-medium">
              No hay becas disponibles en este momento.
            </div>
          ) : (
            currentScholarships.map(s => (
              <ViewCard
                key={s.id}
                title={s.nombre_beca}
                subtitle={s.tipo_beca}
                showExternalLink
                onExternalClick={() => window.open('https://educacion.gob.do', '_blank')}
                showEditLink
                onEditClick={() => openEdit(s)}
                showDelete
                onDeleteClick={() => confirmDelete(s.id, s.nombre_beca)}
              >
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Estado</p>
                      <p className="font-light text-gray-800">
                        {s.estado_beca?.toLowerCase() === 'activo'
                          ? 'Activa'
                          : s.estado_beca?.toLowerCase() === 'inactivo'
                            ? 'Inactiva'
                            : 'Desconocido'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Promedio requerido</p>
                      <p className="font-light text-gray-800">
                        {`${s.promedio_requerido}%` || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <BanknotesIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Cobertura</p>
                      <p className="font-light text-gray-800">{`${s.cobertura}%` || 'N/D'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Institución</p>
                      <p className="font-light text-gray-800">
                        {s.institucion_proveedora || 'N/D'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Duración</p>
                      <p className="font-light text-gray-800">{`${s.duracion} años` || 'N/D'}</p>
                    </div>
                  </div>
                </div>
              </ViewCard>
            ))
          )}

          <div className="flex justify-between items-center gap-3 mt-4 text-sm">
            <div className="text-gray-500">
              Mostrando {currentScholarships.length} de {scholarshipList.length} becas
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded hover:text-blue-600 disabled:text-gray-400 transition"
                aria-label="Página anterior"
              >
                &lt;
              </button>
              <span>
                Página <strong>{currentPage}</strong> de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded hover:text-blue-600 disabled:text-gray-400 transition"
                aria-label="Página siguiente"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ViewCard
            title="Universidades"
            subtitle="Universidades con programas de beca disponibles"
            variant="detailed"
          >
            <div className="space-y-4">
              {getUniversitiesFromScholarships(scholarshipList).map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={u.logo || '/placeholder.svg'}
                    alt={`Logo de ${u.name}`}
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.programs}</p>
                  </div>
                </div>
              ))}
            </div>
          </ViewCard>

          <ViewCard title="Tendencias" variant="detailed">
            <div className="w-full h-[220px]">
              <ChartWrapper type="bar" data={barChartData} />
            </div>
          </ViewCard>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => fetchWithoutPagination().catch(() => fetchAllScholarships())}
          disabled={isLoading || loadingMore}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="button"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Cargando...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Recargar todas las becas
            </>
          )}
        </button>
      </div>
    </LayoutWrapper>
  )
}

export default Scholarships
