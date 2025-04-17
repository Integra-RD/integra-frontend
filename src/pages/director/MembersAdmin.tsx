import { useLocation, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'

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
  const user = { name: 'Juan Pérez', id: '0034' }
  const location = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [filteredData, setFilteredData] = useState(
    mockSchools.filter(item => item.type === 'student')
  )

  const perPage = 3

  const handlePersonTypeChange = (type: string) => {
    if (type === 'all') {
      setActiveView('students')
      setFilteredData(mockSchools.filter(item => item.type === 'student'))
    } else {
      setActiveView(type as 'students' | 'teachers')
      setFilteredData(mockSchools.filter(item => item.type === type))
    }
  }

  const navItems = [
    {
      label: 'Gestión de Personas',
      icon: <UsersIcon className="w-5 h-5" />,
      active: location.pathname === '/director/members',
      onClick: () => navigate('/director/members')
    },
    {
      label: 'Gestión de Centro Educativo',
      icon: <BuildingLibraryIcon className="w-5 h-5" />,
      active: location.pathname === '/director/institution',
      onClick: () => navigate('/director/institution')
    },
    {
      label: 'Reportes',
      icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
      active: location.pathname === '/director/reports',
      onClick: () => navigate('/director/report')
    }
  ]

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
    <LayoutWrapper navItems={navItems} user={user} title="Bienvenido al Portal del Director">
      <DataTable
        headers={activeView === 'students' ? studentHeaders : teacherHeaders}
        data={filteredData}
        dropdownLabel="Curso"
        dropdownOptions={[
          'Primero de básica',
          'Segundo de básica',
          'Tercero de básica',
          'Cuarto de básica',
          'Quinto de básica',
          'Sexto de básica',
          'Primero de secundaria',
          'Segundo de secundaria',
          'Tercero de secundaria',
          'Cuarto de secundaria',
          'Quinto de secundaria',
          'Sexto de secundaria'
        ]}
        extraFilters="with-person-type"
        onPersonTypeChange={handlePersonTypeChange}
      />
    </LayoutWrapper>
  )
}

export default DirectorHome
