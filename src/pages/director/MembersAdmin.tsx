import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import { mockSchools } from '../../assets/mock'


const DirectorHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [selectedGrade, setSelectedGrade] = useState<string>('1ro de básica') // Valor inicial definido
  const [filteredData, setFilteredData] = useState<any[]>([])

  // Filtra los datos cuando cambian los parámetros
  useEffect(() => {
    const typeToFilter = activeView === 'students' ? 'student' : 'teacher'
    
    const filtered = mockSchools.filter(item => {
      // Para estudiantes: filtrar por tipo y grado
      if (typeToFilter === 'student') {
        return item.type === 'student' && item.grade === selectedGrade
      }
      // Para profesores: solo filtrar por tipo (mostrar todos)
      return item.type === 'teacher'
    })
    
    setFilteredData(filtered)
  }, [activeView, selectedGrade])
  // Declaración ÚNICA de handlePersonTypeChange
  const handlePersonTypeChange = (type: string) => {
    setActiveView(type === 'student' ? 'students' : 'teachers');
  }

  // Declaración ÚNICA de handleGradeChange
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
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

  const gradeOptions = [
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
  ]

  return (
    <LayoutWrapper navItems={navItems} title="Bienvenido al Portal del Director">
      <DataTable
        headers={activeView === 'students' ? studentHeaders : teacherHeaders}
        data={filteredData}
        dropdownLabel="Curso"
        dropdownOptions={gradeOptions}
        selectedDropdownValue={selectedGrade}
        onDropdownChange={handleGradeChange}
        extraFilters="with-person-type"
        onPersonTypeChange={handlePersonTypeChange}
      />
    </LayoutWrapper>
  )
}

export default DirectorHome