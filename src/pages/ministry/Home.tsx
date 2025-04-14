import { useLocation, useNavigate } from 'react-router-dom'
import {
  AcademicCapIcon,
  CircleStackIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'

const mockSchools = Array.from({ length: 12 }, (_, i) => ({
  id: 53849 + i,
  name: 'Colegio Feliz',
  sector: 'Los Jardines',
  province: 'Santo Domingo',
  nationalRanking: '#87',
  averageGrade: 87.2,
  students: 124,
  updatedAt: '12/02/23'
}))

const MinistryHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      label: 'Inicio',
      icon: <HomeIcon className="w-5 h-5" />,
      active: location.pathname === '/ministry/home',
      onClick: () => navigate('/ministry/home')
    },
    {
      label: 'Becas y Programas',
      icon: <AcademicCapIcon className="w-5 h-5" />,
      active: location.pathname === '/ministry/scholarships',
      onClick: () => navigate('/ministry/scholarships')
    },
    {
      label: 'I/O de Datos',
      icon: <CircleStackIcon className="w-5 h-5" />,
      active: location.pathname === '/ministry/data',
      onClick: () => navigate('/ministry/data')
    },
    {
      label: 'Auditorías',
      icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
      active: location.pathname === '/ministry/audits',
      onClick: () => navigate('/ministry/audits')
    }
  ]

  const user = { name: 'Juan Pérez', id: '0034' }

  return (
    <LayoutWrapper
      navItems={navItems}
      user={user}
      title="Bienvenido al Portal del Ministerio de Educación"
      subtitle="Explora centros educativos y compara su desempeño académico por provincia."
    >
      <DataTable
        headers={[
          { label: 'ID', key: 'id' },
          { label: 'Centro', key: 'name' },
          { label: 'Provincia', key: 'province' },
          { label: 'Sector', key: 'sector' },
          { label: 'Ranking Nacional', key: 'nationalRanking' },
          { label: 'Promedio de Calificación', key: 'averageGrade' },
          { label: 'Cantidad de Estudiantes', key: 'students' },
          { label: 'Última Actualización', key: 'updatedAt' }
        ]}
        data={mockSchools}
        dropdownLabel="Provincia"
        dropdownOptions={[
          'Azua',
          'Bahoruco',
          'Barahona',
          'Dajabón',
          'Distrito Nacional',
          'Duarte',
          'Elías Piña',
          'El Seibo',
          'Espaillat',
          'Hato Mayor',
          'Hermanas Mirabal',
          'Independencia',
          'La Altagracia',
          'La Romana',
          'La Vega',
          'María Trinidad Sánchez',
          'Monseñor Nouel',
          'Monte Cristi',
          'Monte Plata',
          'Pedernales',
          'Peravia',
          'Puerto Plata',
          'Samaná',
          'Sánchez Ramírez',
          'San Cristóbal',
          'San José de Ocoa',
          'San Juan',
          'San Pedro de Macorís',
          'Santiago',
          'Santiago Rodríguez',
          'Santo Domingo',
          'Valverde'
        ]}
        extraFilters={true}
      />
    </LayoutWrapper>
  )
}

export default MinistryHome
