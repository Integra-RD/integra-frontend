import { useLocation, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
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

const DirectorHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [filteredData, setFilteredData] = useState(
    mockSchools.filter(item => item.type === 'student')
  )

  const handlePersonTypeChange = (type: string) => {
    if (type === 'student') {
      setActiveView('students')
      setFilteredData(mockSchools.filter(item => item.type === 'student'))
    } else {
      setActiveView('teachers')
      setFilteredData(mockSchools.filter(item => item.type === 'teacher'))
    }
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
  )
}

export default DirectorHome
