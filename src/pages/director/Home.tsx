
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

const mockSchools = Array.from({ length: 12 }, (_, i) => ({
  id: 53849 + i,
  studentID: '123456789',
  studentName: 'Juan Pérez',
  studentAvg: '87.2',
  updatedAt: '12/02/23'
}))

const DirectorHome: React.FC = () => {
    const user = { name: 'Juan Pérez', id: '0034' }
    const location = useLocation()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
  
    const perPage = 3
   
  
    const navItems = [
      {
        label: 'Inicio',
        icon: <HomeIcon className="w-5 h-5" />,
        active: location.pathname === '/director/home',
        onClick: () => navigate('/director/home')
      },
      {
        label: 'Gestión de Personas',
        icon: <UsersIcon className="w-5 h-5" />,
        active: location.pathname === '/director/scholarships',
        onClick: () => navigate('/director/scholarships')
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
      },
    ]
  

  return (
    <LayoutWrapper
      navItems={navItems}
      user={user}
      title="Bienvenido al Portal del Director"
    >
      <DataTable
        headers={[
          { label: 'ID', key: 'id' },
          { label: 'Matrícula', key: 'studentID' },
          { label: 'Estudiante', key: 'studentName' },
          { label: 'Promedio de Calificación', key: 'studentAvg' },
          { label: 'Ultima Actualización', key: 'updatedAt' },
        ]}
        data={mockSchools}
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
        'Sexto de secundaria',
        ]}
        extraFilters={true}
      />
    </LayoutWrapper>
  )
}

export default DirectorHome
