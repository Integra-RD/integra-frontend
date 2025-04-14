import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ClockIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline'
import Topbar from '../../components/Topbar'
import DataTable from '../../components/DataTable'

const baseGrades = [
  { subject: 'Cálculo', grade: 82, teacher: 'Vicente Fernández', average: 87.2 },
  { subject: 'Literatura Avanzada', grade: 87, teacher: 'Alejandro Fernández', average: 84.7 },
  { subject: 'Física Cuántica', grade: 97, teacher: 'Joan Sebastian', average: 98.1 },
  { subject: 'Programación', grade: 95, teacher: 'Christian Nodal', average: 93.8 },
  { subject: 'Estadística', grade: 91, teacher: 'Antonio Aguilar', average: 87.7 },
  { subject: 'Formación Humana y Religiosa', grade: 98, teacher: 'Cristian Castro', average: 96.3 },
  { subject: 'Educación Cívica y Ciudadana', grade: 72, teacher: 'Carlos Rivera', average: 87.2 }
]

const mockGrades = Array.from({ length: 100 }, (_, i) => {
  const base = baseGrades[i % baseGrades.length]
  return { ...base, subject: `${base.subject} ${i + 1}` }
})

const GradeHistory: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      label: 'Historial',
      icon: <ClockIcon className="w-5 h-5" />,
      active: location.pathname === '/grade-history',
      onClick: () => navigate('/grade-history')
    },
    {
      label: 'Promedios',
      icon: <ChartBarIcon className="w-5 h-5" />,
      active: location.pathname === '/grade-average',
      onClick: () => navigate('/grade-average')
    },
    {
      label: 'Rankings',
      icon: <TrophyIcon className="w-5 h-5" />,
      active: location.pathname === '/rankings',
      onClick: () => navigate('/rankings')
    }
  ]

  const user = { name: 'Juan Pérez', id: '0034' }

  return (
    <>
      <Topbar
        navItems={navItems}
        user={user}
        onNotificationClick={() => console.log('🔔 Notification clicked')}
      />

      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-12 max-w-7xl mx-auto">
        {/* DataTable Component */}
        <DataTable
          title="Historial"
          subtitle="Consulta todas tus calificaciones en un solo lugar. Accede a tu historial académico, revisa tus notas por materia y periodo."
          headers={[
            { label: 'Asignatura', key: 'subject' },
            { label: 'Calificación', key: 'grade' },
            { label: 'Docente', key: 'teacher' },
            { label: 'Promedio de Calificación', key: 'average' }
          ]}
          data={mockGrades}
          dropdownLabel="periodo"
          dropdownOptions={['2021-2022', '2022-2023', '2023-2024']}
          extraFilters={true}
        />
      </div>
    </>
  )
}

export default GradeHistory
