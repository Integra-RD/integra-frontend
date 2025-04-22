import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'

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
  const navItems = getNavItemsByRole('ministry', location, navigate)

  return (
    <LayoutWrapper
      navItems={navItems}
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
