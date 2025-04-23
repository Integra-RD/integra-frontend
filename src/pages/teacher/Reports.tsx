"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { PencilIcon, CheckIcon, ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline"
import FileUploader from "../../components/FileUploader"
import DataTable from "../../components/DataTable"
import Dropdown from "../../components/Dropdown"
import LayoutWrapper from "../../components/LayoutWrapper"
import { getNavItemsByRole } from "../../utils/getNavItemsByRole"
import * as XLSX from "xlsx"
import { useStudentContext, subjects, grades, periods, type Student } from "../../context/StudentContext"

// Definición de Snackbar
interface SnackbarProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type]

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

const Reports: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Usar el contexto global de estudiantes
  const { students, updateStudentGrade, updateStudentsFromFile } = useStudentContext()

  // Estados locales
  const [isEditing, setIsEditing] = useState(false)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [selectedGrade, setSelectedGrade] = useState(grades[0])
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0])
  const [snackbar, setSnackbar] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" }>({
    show: false,
    message: "",
    type: "info",
  })

  // Filtrar estudiantes cuando cambia la selección
  useEffect(() => {
    const filtered = students.filter((student) => student.grade === selectedGrade)
    setFilteredStudents(filtered)
  }, [students, selectedGrade])

  // Configuración de navegación para Topbar
  const navItems = getNavItemsByRole("teacher", location, navigate)

  // Cabeceras para DataTable
  const tableHeaders = [
    { label: "ID", key: "id" },
    { label: "Estudiante", key: "name" },
    { label: "Calificación", key: "grade" },
    { label: "Promedio", key: "avg" },
  ]

  // Manejador para cambiar calificaciones usando el contexto
  const handleGradeChange = (id: string, newGrade: number) => {
    updateStudentGrade(id, selectedSubject, selectedPeriod, newGrade)
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
          value={currentGrade || 0}
          onChange={(e) => handleGradeChange(studentId, Number(e.target.value))}
          className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#29638A]"
        />
      )
    }

    return (
      <div className="flex items-center">
        <span className="px-2 py-1">{currentGrade || "N/A"}</span>
        <span className="text-gray-400 ml-1">/ 100</span>
      </div>
    )
  }

  // Función para renderizar celdas de promedio
  const renderAvgCell = (student: Student) => {
    // Calculate average based on the selected subject and all periods
    const subjectGrades = student.grades[selectedSubject] || {}
    const periodGrades = Object.values(subjectGrades).filter((grade) => typeof grade === "number") as number[]

    let avg = 0
    if (periodGrades.length > 0) {
      avg = periodGrades.reduce((sum, grade) => sum + grade, 0) / periodGrades.length
    }

    return (
      <div className="flex items-center">
        <span className="px-2 py-1">{avg.toFixed(1)}</span>
      </div>
    )
  }

  // Procesar los datos para DataTable con celdas personalizadas
  const processedData = filteredStudents.map((student) => {
    // Obtener la calificación del periodo y asignatura seleccionados
    const periodGrade = student.grades[selectedSubject]?.[selectedPeriod] || 0

    return {
      id: student.id,
      name: student.name,
      grade: renderGradeCell(periodGrade, student),
      avg: renderAvgCell(student), // Pass the entire student object
    }
  })

  // Manejador para la carga de archivos Excel
  const handleFileUpload = (file: File) => {
    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Asumimos que la primera hoja es la que contiene los datos
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length === 0) {
          throw new Error("El archivo no contiene datos")
        }

        // Verificar estructura del archivo
        const firstRow = jsonData[0] as any
        if (
          !firstRow.matricula ||
          !firstRow.nombre_asignatura ||
          !firstRow.nota ||
          !firstRow.periodo ||
          !firstRow.curso
        ) {
          throw new Error(
            "El archivo no tiene el formato esperado. Debe incluir columnas: matricula, nombre_asignatura, nota, periodo y curso",
          )
        }

        const studentsUpdated = new Set<string>()
        const notFoundIds = new Set<string>()

        // Crear una copia nueva de los estudiantes para modificarlos
        const updatedStudents = students.map((student) => {
          const updatedStudent = student.clone()

          jsonData.forEach((row: any) => {
            const studentId = row.matricula?.toString()
            const subjectName = row.nombre_asignatura
            const grade = Number.parseFloat(row.nota)
            const period = row.periodo

            // Verificar que la calificación sea válida
            if (isNaN(grade) || grade < 0 || grade > 100) {
              console.warn(`Calificación inválida para el estudiante ${studentId}: ${grade}`)
              return
            }

            // Si el estudiante tiene el ID correspondiente, actualizamos la calificación
            if (updatedStudent.id === studentId) {
              // Si no existe la estructura para la asignatura, la creamos
              if (!updatedStudent.grades[subjectName]) {
                updatedStudent.grades[subjectName] = {}
              }

              // Actualizar la calificación
              updatedStudent.grades[subjectName][period] = grade
              studentsUpdated.add(studentId)
            }
          })

          return updatedStudent
        })

        // Actualizamos los estudiantes en el contexto global
        updateStudentsFromFile(updatedStudents)

        // Construir mensaje de resultado
        let message = `Se actualizaron calificaciones para ${studentsUpdated.size} estudiantes exitosamente.`
        if (notFoundIds.size > 0) {
          message += ` No se encontraron ${notFoundIds.size} IDs: ${Array.from(notFoundIds).join(", ")}`
        }

        // Mostrar mensaje de éxito o advertencia
        setSnackbar({
          show: true,
          message,
          type: notFoundIds.size > 0 ? "info" : "success",
        })
      } catch (error) {
        console.error("Error al procesar el archivo:", error)
        setSnackbar({
          show: true,
          message: `Error al procesar el archivo: ${error instanceof Error ? error.message : "Formato inválido"}`,
          type: "error",
        })
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      setIsUploading(false)
      setSnackbar({
        show: true,
        message: "Error al leer el archivo",
        type: "error",
      })
    }

    reader.readAsArrayBuffer(file)
  }

  // Componente para los botones de acción (editar/guardar)
  const ActionButton = () => (
    <div className="flex items-end">
      {isEditing ? (
        <button
          onClick={() => {
            setIsEditing(false)
            setSnackbar({
              show: true,
              message: "Calificaciones guardadas exitosamente",
              type: "success",
            })
          }}
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

  // Cerrar snackbar después de 5 segundos
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, show: false }))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [snackbar])

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
          onFileUpload={handleFileUpload}
          acceptedExtensions={[".xlsx"]}
          buttonText="Seleccionar Archivo"
          instructions={[
            "El archivo debe contener columnas para: matricula, nombre_asignatura, nota, periodo y curso.",
            "Las calificaciones deben estar en escala de 0-100.",
            "Los IDs de estudiantes no encontrados serán reportados en la notificación.",
          ]}
          templatePath="/grade-import-template.xlsx"
        />
      </div>

      {/* Snackbar para notificaciones */}
      {snackbar.show && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
        />
      )}
    </LayoutWrapper>
  )
}

export default Reports
