import { useLocation, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'

const mockSchools = Array.from({ length: 12 }, (_, i) => {
  const baseId = 53849 + i
  const isStudent = i % 2 === 0

  if (isStudent) {
    return {
      id: baseId,
      studentID: `STU${1000 + i}`,
      studentName: `Estudiante ${i + 1}`,
      studentAvg: (Math.random() * 20 + 80).toFixed(1),
      updatedAt: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString('es-DO'),
      type: 'student'
    }
  } else {
    return {
      id: baseId,
      teacherID: `TCH${2000 + i}`,
      teacherName: `Profesor ${i + 1}`,
      subject: ['Matemáticas', 'Ciencias', 'Historia'][i % 3],
      updatedAt: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString('es-DO'),
      type: 'teacher'
    }
  }
})

// Toast personalizado persistente
const PersistentToast: React.FC<{
  visible: boolean;
  onGoToTeachers: () => void;
  onGoToStudents: () => void;
}> = ({ visible, onGoToTeachers, onGoToStudents }) => {
  if (!visible) return null

  return (
    <div className="fixed top-20 right-4 z-[9999] w-96 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 shadow-lg rounded">
      <div className="flex">
        <div className="py-1">
          <svg className="w-6 h-6 mr-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">Faltan datos esenciales: sube docentes y/o estudiantes para continuar.</p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={onGoToTeachers}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
            >
              Ir a carga de docentes
            </button>
            <button
              onClick={onGoToStudents}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
            >
              Ir a carga de estudiantes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DirectorHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [filteredData, setFilteredData] = useState(
    mockSchools.filter(item => item.type === 'student')
  )
  const [showToast, setShowToast] = useState(false)

  // Verificar si hay estudiantes y docentes en mockSchools
  useEffect(() => {
    const hasStudents = mockSchools.some(item => item.type === 'student')
    const hasTeachers = mockSchools.some(item => item.type === 'teacher')
    
    // Mostrar toast si falta alguno de los dos tipos
    setShowToast(!hasStudents || !hasTeachers)
  }, [])

  const handlePersonTypeChange = (type: string) => {
    if (type === 'student') {
      setActiveView('students')
      setFilteredData(mockSchools.filter(item => item.type === 'student'))
    } else {
      setActiveView('teachers')
      setFilteredData(mockSchools.filter(item => item.type === 'teacher'))
    }
  }

  const handleGoToTeachers = () => {
    // Cambiar a vista de profesores
    setActiveView('teachers')
    setFilteredData(mockSchools.filter(item => item.type === 'teacher'))
    console.log('Navegando a la sección de carga de docentes')
    // En una implementación real, aquí iríamos a la página de carga de docentes
    // navigate('/upload-teachers')
  }

  const handleGoToStudents = () => {
    // Cambiar a vista de estudiantes
    setActiveView('students')
    setFilteredData(mockSchools.filter(item => item.type === 'student'))
    console.log('Navegando a la sección de carga de estudiantes')
    // En una implementación real, aquí iríamos a la página de carga de estudiantes
    // navigate('/upload-students')
  }

  const navItems = getNavItemsByRole('director', location, navigate)

  const studentHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Matrícula', key: 'studentID' },
    { label: 'Estudiante', key: 'studentName' },
    { label: 'Promedio', key: 'studentAvg' },
    { label: 'Última Actualización', key: 'updatedAt' }
  ]

  const teacherHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'Código', key: 'teacherID' },
    { label: 'Profesor', key: 'teacherName' },
    { label: 'Asignatura', key: 'subject' },
    { label: 'Última Actualización', key: 'updatedAt' }
  ]

  return (
    <>
      <PersistentToast 
        visible={showToast} 
        onGoToTeachers={handleGoToTeachers} 
        onGoToStudents={handleGoToStudents} 
      />
      <LayoutWrapper navItems={navItems} title="Bienvenido al Portal del Director">
        <DataTable
          headers={activeView === 'students' ? studentHeaders : teacherHeaders}
          data={filteredData}
          dropdownLabel="Curso"
          dropdownOptions={[
            '1ro de básica',
            '2do de básica',
            '3ro de básica',
            '4to de básica',
            '5to de básica',
            '6to de básica',
            '1ro de secundaria',
            '2do de secundaria',
            '3ro de secundaria',
            '4to de secundaria',
            '5to de secundaria',
            '6to de secundaria'
          ]}
          extraFilters="with-person-type"
          onPersonTypeChange={handlePersonTypeChange}
        />
      </LayoutWrapper>
    </>
  )
}

export default DirectorHome
