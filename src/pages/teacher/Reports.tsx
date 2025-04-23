import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PencilIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import FileUploader from '../../components/FileUploader'
import DataTable from '../../components/DataTable'
import Dropdown from '../../components/Dropdown'
import LayoutWrapper from '../../components/LayoutWrapper'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// TODO: Wire with backend once uploading of data of students and teachers is done
interface RawStudent {
  id: string
  full_name: string
}
interface RawCalificacion {
  id: number
  estudiante: number
  asignatura: number
  nota: string
  periodo: string
}
interface RawCalificacionesResponse {
  calificaciones: RawCalificacion[]
}
interface Student {
  id: string
  name: string
  grade: number
  avg: number
  hasGrade: boolean
}

const subjects = ['Matemáticas', 'Español', 'Ciencias Naturales', 'Historia']
const grades = ['5to de Secundaria', '4to de Secundaria', '3ro de Secundaria']
const periods = ['2022-2023', '2021-2022', '2020-2021']

const tableHeaders = [
  { label: 'ID', key: 'id' },
  { label: 'Estudiante', key: 'name' },
  { label: 'Calificación', key: 'grade' },
  { label: 'Promedio', key: 'avg' }
]

const Reports: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navItems = getNavItemsByRole('teacher', location, navigate)

  const [roster, setRoster] = useState<RawStudent[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading] = useState(false)

  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [selectedGrade, setSelectedGrade] = useState(grades[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0])

  const fetchRoster = useCallback(async () => {
    try {
      const { data } = await api.get<{ count: number; results: RawStudent[] }>(
        '/academic/docente/estudiantes/',
        { params: { students: 100, offset: 0 } }
      )
      setRoster(data.results)
    } catch {
      toast.error('No se pudo cargar la lista de estudiantes')
    }
  }, [])

  const fetchGrades = useCallback(async () => {
    if (!roster.length) return
    const subjectId = subjects.indexOf(selectedSubject) + 1
    const period = selectedPeriod

    try {
      const results = await Promise.all(
        roster.map(async ({ id, full_name }) => {
          const res = await api.get<RawCalificacionesResponse>(
            `/academic/docente/estudiantes/${id}/calificaciones/`
          )
          const all = res.data.calificaciones
          const filtered = all.filter(c => c.asignatura === subjectId && c.periodo === period)
          const hasGrade = filtered.length > 0
          const grade = hasGrade ? Number(filtered[0].nota) : 0
          const avg =
            all.length > 0 ? all.reduce((sum, c) => sum + Number(c.nota), 0) / all.length : 0
          return { id, name: full_name, grade, avg, hasGrade }
        })
      )
      setStudents(results)
    } catch {
      toast.error('No se pudo cargar las calificaciones')
    }
  }, [roster, selectedSubject, selectedPeriod])

  useEffect(() => {
    fetchRoster()
  }, [fetchRoster])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  const handleGradeChange = (id: string, newGrade: number) => {
    if (newGrade < 0 || newGrade > 100) return
    setStudents(students.map(s => (s.id === id ? { ...s, grade: newGrade } : s)))
  }

  const handleSave = async () => {
    setIsEditing(false)
    const subjectId = subjects.indexOf(selectedSubject) + 1
    const periodo = selectedPeriod

    try {
      await Promise.all(
        students.map(s =>
          api.put(`/academic/docente/calificaciones/${s.id}/actualizar/`, {
            estudiante: Number(s.id),
            asignatura: subjectId,
            nota: String(s.grade),
            periodo
          })
        )
      )
      toast.success('Calificaciones actualizadas')
      fetchGrades()
    } catch {
      toast.error('Error al guardar calificaciones')
    }
  }

  const renderGradeCell = (value: number, row: Student) => {
    if (!row.hasGrade && !isEditing) {
      return <span className="text-gray-400">—</span>
    }
    return isEditing ? (
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={e => handleGradeChange(row.id, Number(e.target.value))}
        className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#29638A]"
      />
    ) : (
      <div className="flex items-center">
        <span className="px-2 py-1">{value}</span>
        <span className="text-gray-400 ml-1">/ 100</span>
      </div>
    )
  }

  const renderAvgCell = (value: number, row: Student) =>
    !row.hasGrade ? (
      <span className="text-gray-400">—</span>
    ) : (
      <span className="px-2 py-1">{value.toFixed(1)}</span>
    )

  const visibleRows = isEditing ? students : students.filter(row => row.hasGrade)

  const processedData = visibleRows.map(s => ({
    id: s.id,
    name: s.name,
    grade: renderGradeCell(s.grade, s),
    avg: renderAvgCell(s.avg, s)
  }))

  const ActionButton = () =>
    isEditing ? (
      <button
        onClick={handleSave}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
      >
        <CheckIcon className="w-5 h-5" />
        <span>Guardar</span>
      </button>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-[#29638A] text-white rounded-lg hover:bg-[#1f4e79] transition-colors shadow-sm"
      >
        <PencilIcon className="w-5 h-5" />
        <span>Editar</span>
      </button>
    )

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar />
      <LayoutWrapper
        navItems={navItems}
        title="Reportes"
        subtitle="Consulta tus estudiantes y actualiza sus calificaciones por asignatura y periodo."
      >
        <div className="flex flex-wrap gap-4 mb-8 items-end">
          <Dropdown
            label="Asignatura"
            options={subjects}
            selected={selectedSubject}
            onChange={setSelectedSubject}
            className="w-full md:w-1/6"
          />
          <Dropdown
            label="Grado"
            options={grades}
            selected={selectedGrade}
            onChange={setSelectedGrade}
            className="w-full md:w-1/6"
          />
          <Dropdown
            label="Periodo"
            options={periods}
            selected={selectedPeriod}
            onChange={setSelectedPeriod}
            className="w-full md:w-1/6"
          />
          <div className="flex items-end h-full pt-6">
            <ActionButton />
          </div>
        </div>

        <div className="table-auto w-full mb-8">
          {isUploading ? (
            <div className="flex justify-center items-center p-12">
              <ArrowPathIcon className="w-8 h-8 text-[#29638A] animate-spin" />
              <span className="ml-3 text-gray-600">Procesando datos…</span>
            </div>
          ) : processedData.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No hay datos para los filtros seleccionados.
            </div>
          ) : (
            <DataTable headers={tableHeaders} data={processedData} />
          )}
        </div>

        <div className="mb-8">
          <FileUploader
            title="Importación Masiva de Calificaciones"
            description="Sube un archivo Excel (.xlsx) con las calificaciones"
            acceptedExtensions={['.xlsx']}
            buttonText="Seleccionar Archivo"
            instructions={[
              'El archivo debe contener columnas para matrícula y calificación.',
              'Selecciona la materia y periodo antes de importar.',
              'Las calificaciones deben estar en escala de 0-100.'
            ]}
            templatePath="/grade-import-template.xlsx"
          />
        </div>
      </LayoutWrapper>
    </>
  )
}

export default Reports
