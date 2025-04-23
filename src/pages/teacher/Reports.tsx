import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PencilIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import FileUploader from '../../components/FileUploader'
import DataTable from '../../components/DataTable'
import Dropdown from '../../components/Dropdown'
import LayoutWrapper from '../../components/LayoutWrapper'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// MVP estático: datos hardcodeados para presentación
interface RawStudent {
  id: string
  full_name: string
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

// Datos estáticos de ejemplo
const staticRoster: RawStudent[] = [
  { id: '1', full_name: 'Juan Pérez' },
  { id: '2', full_name: 'María García' },
  { id: '3', full_name: 'Carlos Rodríguez' },
  { id: '4', full_name: 'Ana Martínez' },
  { id: '5', full_name: 'Luis Fernández' },
  { id: '6', full_name: 'Sofía López' },
  { id: '7', full_name: 'Miguel Torres' },
  { id: '8', full_name: 'Lucía Gómez' },
  { id: '9', full_name: 'Jesús Díaz' },
  { id: '10', full_name: 'Laura Sánchez' }
]

const staticStudents: Student[] = [
  { id: '1', name: 'Juan Pérez', grade: 85, avg: 88.4, hasGrade: true },
  { id: '2', name: 'María García', grade: 92, avg: 90.1, hasGrade: true },
  { id: '3', name: 'Carlos Rodríguez', grade: 0, avg: 75.2, hasGrade: false },
  { id: '4', name: 'Ana Martínez', grade: 78, avg: 80.5, hasGrade: true },
  { id: '5', name: 'Luis Fernández', grade: 0, avg: 0, hasGrade: false },
  { id: '6', name: 'Sofía López', grade: 100, avg: 95.6, hasGrade: true },
  { id: '7', name: 'Miguel Torres', grade: 67, avg: 70.3, hasGrade: true },
  { id: '8', name: 'Lucía Gómez', grade: 0, avg: 65.4, hasGrade: false },
  { id: '9', name: 'Jesús Díaz', grade: 89, avg: 87.9, hasGrade: true },
  { id: '10', name: 'Laura Sánchez', grade: 73, avg: 76.8, hasGrade: true }
]

const Reports: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navItems = getNavItemsByRole('teacher', location, navigate)

  // estados iniciales con datos estáticos
  const [] = useState<RawStudent[]>(staticRoster)
  const [students, setStudents] = useState<Student[]>(staticStudents)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading] = useState(false)

  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [selectedGrade, setSelectedGrade] = useState(grades[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0])

  const handleGradeChange = (id: string, newGrade: number) => {
    if (newGrade < 0 || newGrade > 100) return
    setStudents(students.map(s => (s.id === id ? { ...s, grade: newGrade } : s)))
  }

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Calificaciones actualizadas (MVP estático)')
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
        subtitle="Consulta tus estudiantes y actualiza sus calificaciones (MVP estático)"
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
            acceptedExtensions={['xlsx']}
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
