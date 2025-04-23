import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PencilIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import FileUploader from '../../components/FileUploader'
import DataTable from '../../components/DataTable'
import Dropdown from '../../components/Dropdown'
import LayoutWrapper from '../../components/LayoutWrapper'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'

interface Student {
  id: string
  name: string
  subject: string
  period: string
  grade: number
  avg: number
}

// TODO: Fix logic related to grades and averages; Add snackbars for feedback for processes

// Datos de prueba
const subjects = ['Matemáticas', 'Español', 'Ciencias Naturales', 'Historia']
const grades = ['5to de Secundaria', '4to de Secundaria', '3ro de Secundaria']
const periods = ['2022-2023', '2021-2022', '2020-2021']

const initialStudents = [
  { id: '20210001', name: 'Vicente Fernández', subject: 'Matemáticas', period: '2022-2023', grade: 82, avg: 87.2 },
  { id: '20210002', name: 'Alejandro Fernández', subject: 'Español', period: '2021-2022', grade: 87, avg: 84.7 },
  { id: '20210003', name: 'Joan Sebastian', subject: 'Ciencias Naturales', period: '2020-2021', grade: 97, avg: 98.1 },
  { id: '20210004', name: 'Christian Nodal', subject: 'Historia', period: '2022-2023', grade: 95, avg: 93.8 },
  { id: '20210005', name: 'Antonio Aguilar', subject: 'Matemáticas', period: '2021-2022', grade: 91, avg: 87.7 },
  { id: '20210006', name: 'Cristian Castro', subject: 'Español', period: '2020-2021', grade: 98, avg: 96.3 },
  { id: '20210007', name: 'Carlos Rivera', subject: 'Ciencias Naturales', period: '2022-2023', grade: 72, avg: 87.2 },
]


const DirectorReport: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // Estados
  const [isEditing, setIsEditing] = useState(false)
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [isUploading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [selectedGrade, setSelectedGrade] = useState(grades[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0])

  // Configuración de navegación para Topbar
  const navItems = getNavItemsByRole('director', location, navigate)

  // Cabeceras para DataTable
  const tableHeaders = [
    { label: 'Matrícula', key: 'id' },
    { label: 'Estudiante', key: 'name' },
    { label: 'Asignatura', key: 'subject' },
    { label: 'Calificación', key: 'calification' },
    { label: 'Periodo', key: 'period' },
    { label: 'Curso', key: 'grade' } // Nueva columna para el promedio
  ]

  // Manejador para cambiar calificaciones
  const handleGradeChange = (id: string, newGrade: number) => {
    if (newGrade >= 0 && newGrade <= 100) {
      setStudents(
        students.map(student => (student.id === id ? { ...student, grade: newGrade } : student))
      )
    }
  }

  // Función para renderizar celdas de calificación editables/no editables
  const renderGradeCell = (value: any, row: any) => {
    const studentId = row.id
    const currentGrade = Number(value)

    if (isEditing) {
      return (
        <input
          type="number"
          min="0"
          max="100"
          value={currentGrade}
          onChange={e => handleGradeChange(studentId, Number(e.target.value))}
          className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#29638A]"
        />
      )
    }

    return (
      <div className="flex items-center">
        <span className="px-2 py-1">{currentGrade}</span>
        <span className="text-gray-400 ml-1">/ 100</span>
      </div>
    )
  }

  // Función para renderizar celdas de promedio
  const renderAvgCell = (value: any) => {
    return (
      <div className="flex items-center">
        <span className="px-2 py-1">{value}</span>
      </div>
    )
  }

  // Procesar los datos para DataTable con celdas personalizadas
  const processedData = students.map(student => ({
    id: student.id,
    name: student.name,
    subject: student.subject,
    period: student.period,
    grade: renderGradeCell(student.grade, student),
    avg: renderAvgCell(student.avg)
  }))
  

  // Componente para los botones de acción (editar/guardar)
  const ActionButton = () => (
    <div className="flex items-end">
      {isEditing ? (
        <button
          onClick={() => setIsEditing(false)}
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
      )}
    </div>
  )

  return (
    <LayoutWrapper
      navItems={navItems}
      title="Reportes"
      subtitle="Consulta todas las calificaciones de tus estudiantes. Accede al historial académico por estudiantes, revisa las notas globales por asignatura y periodo."
    >
      {/* Controles de filtrado */}
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

      {/* Tabla de datos */}
      <div className="table-auto w-full mb-8">
        {isUploading ? (
          <div className="flex justify-center items-center p-12">
            <ArrowPathIcon className="w-8 h-8 text-[#29638A] animate-spin" />
            <span className="ml-3 text-gray-600">Procesando datos...</span>
          </div>
        ) : (
          <DataTable headers={tableHeaders} data={processedData} />
        )}
      </div>

 {/* Sección de importación */}
 <div className="mb-8">
        <FileUploader
          title="Importación Masiva de Calificaciones"
          description="Sube un archivo Excel (.xlsx) con las calificaciones de los estudiantes"
          //onFileUpload={handleFileUpload}
          acceptedExtensions={[".xlsx"]}
          buttonText="Seleccionar Archivo"
          instructions={[
            "El archivo debe contener columnas para ID de estudiante y calificación.",
            "Asegúrese de seleccionar la materia, grado y período correctos antes de importar.",
            "Las calificaciones deben estar en escala de 0-100.",
          ]}
          templatePath="/grade-import-template.xlsx"
        />
      </div>
    </LayoutWrapper>
  )
}

export default DirectorReport
