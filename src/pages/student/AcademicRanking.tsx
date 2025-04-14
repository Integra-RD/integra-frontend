import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ClockIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline'
import Topbar from '../../components/Topbar'
import Dropdown from '../../components/Dropdown'

const academicRanking = [
  { name: 'Fernando Castillo', average: 9.8, grade: '3ro Secundaria', semester: '1er Semestre' },
  { name: 'Andrés Ramírez', average: 9.5, grade: '3ro Secundaria', semester: '1er Semestre' },
  { name: 'Julián Herrera', average: 9.7, grade: '3ro Secundaria', semester: '1er Semestre' },
  { name: 'Ana María González', average: 9.2, grade: '2do Secundaria', semester: '2do Semestre' },
  { name: 'Carlos Rodríguez', average: 9.1, grade: '2do Secundaria', semester: '2do Semestre' },
  { name: 'Sofía Martínez', average: 8.9, grade: '1ro Secundaria', semester: '1er Semestre' },
  { name: 'Javier López', average: 8.7, grade: '1ro Secundaria', semester: '1er Semestre' },
  { name: 'Valentina Hernández', average: 8.6, grade: '1ro Secundaria', semester: '2do Semestre' },
  { name: 'Diego Sánchez', average: 8.5, grade: '1ro Secundaria', semester: '2do Semestre' },
  { name: 'Lucía Ramírez', average: 8.4, grade: '1ro Secundaria', semester: '2do Semestre' }
]

const PODIUM_HEIGHTS = [60, 100, 80]
const PODIUM_RANKS = [3, 1, 2]
const PODIUM_ORDER = [2, 0, 1]

const PodiumBar: React.FC<{
  rank: number
  height: number
  name?: string
  average?: number
}> = ({ rank, height, name, average }) => (
  <div className="flex flex-col items-center">
    {name && (
      <div className="text-center mb-2">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{average} Promedio</p>
      </div>
    )}
    <div
      className={`w-16 md:w-20 rounded-t-md flex items-center justify-center text-xl font-bold ${
        name ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
      }`}
      style={{ height: `${height}px` }}
    >
      {rank}
    </div>
  </div>
)

const AcademicRanking: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [selectedGrade, setSelectedGrade] = useState('Todos los grados')
  const [selectedSemester, setSelectedSemester] = useState('Todos los semestres')

  const gradeOptions = [
    'Todos los grados',
    '1ro Secundaria',
    '2do Secundaria',
    '3ro Secundaria',
    '4to Secundaria'
  ]

  const semesterOptions = ['Todos los semestres', '1er Semestre', '2do Semestre']

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

  const filteredData = useMemo(() => {
    return academicRanking.filter(student => {
      const matchGrade = selectedGrade === 'Todos los grados' || student.grade === selectedGrade
      const matchSemester =
        selectedSemester === 'Todos los semestres' || student.semester === selectedSemester
      return matchGrade && matchSemester
    })
  }, [selectedGrade, selectedSemester])

  const sortedData = useMemo(
    () => [...filteredData].sort((a, b) => b.average - a.average),
    [filteredData]
  )

  const top3 = useMemo(() => sortedData.slice(0, 3), [sortedData])
  const rest = useMemo(() => sortedData.slice(3), [sortedData])

  const renderTop3 = () => (
    <div className="flex justify-center items-end gap-6 mb-2">
      {[0, 1, 2].map(i => {
        const student = top3[PODIUM_ORDER[i]]
        return (
          <PodiumBar
            key={i}
            rank={PODIUM_RANKS[i]}
            height={PODIUM_HEIGHTS[i]}
            name={student?.name}
            average={student?.average}
          />
        )
      })}
    </div>
  )

  const renderFeedbackMessage = () => {
    if (rest.length > 0) return null
    if (top3.length === 3) {
      return (
        <p className="text-sm text-gray-500 text-center mt-10">
          Solo se encontraron estudiantes suficientes para el podio.
        </p>
      )
    }
    if (top3.length > 0) {
      return (
        <p className="text-sm text-gray-500 text-center mt-10">
          Hay estudiantes, pero no suficientes para mostrar el podio completo.
        </p>
      )
    }
    return (
      <p className="text-sm text-gray-500 text-center mt-10">
        No hay estudiantes que coincidan con los filtros seleccionados.
      </p>
    )
  }

  return (
    <>
      <Topbar
        navItems={navItems}
        user={{ name: 'Juan Pérez', id: '0034' }}
        onNotificationClick={() => console.log('🔔 Notification clicked')}
      />

      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-12 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Ranking Académico</h1>
          <p className="text-sm text-gray-600">
            Consulta los estudiantes con los mejores promedios según grado y semestre.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Dropdown
            label="Grado"
            options={gradeOptions}
            selected={selectedGrade}
            onChange={setSelectedGrade}
          />
          <Dropdown
            label="Semestre"
            options={semesterOptions}
            selected={selectedSemester}
            onChange={setSelectedSemester}
          />
        </div>

        {renderTop3()}

        {rest.length > 0 && (
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {rest.map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-none hover:bg-white transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full bg-blue-600 text-white">
                    {index + 4}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{student.name}</span>
                </div>
                <div className="text-sm font-semibold text-blue-700">
                  {student.average}{' '}
                  <span className="text-xs font-normal text-gray-500">Promedio</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {renderFeedbackMessage()}
      </div>
    </>
  )
}

export default AcademicRanking
