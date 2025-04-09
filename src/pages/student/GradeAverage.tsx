import type React from 'react'
import {
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  AcademicCapIcon,
  FireIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import Topbar from '../../components/Topbar'
import SectionHeader from '../../components/SectionHeader'
import ChartWrapper from '../../components/ChartWrapper'

const GradeAverage: React.FC = () => {
  const navItems = [
    { label: 'Historial', icon: <ClockIcon className="w-5 h-5" /> },
    { label: 'Promedios', icon: <ChartBarIcon className="w-5 h-5" />, active: true },
    { label: 'Rankings', icon: <TrophyIcon className="w-5 h-5" /> }
  ]

  const user = {
    name: 'Juan Pérez',
    id: '0034'
  }

  const averageData = {
    labels: [
      '1ro Secundaria',
      '2do Secundaria',
      '3ro Secundaria',
      '4to Secundaria',
      '5to Secundaria'
    ],
    datasets: [
      {
        label: 'Promedio',
        data: [76, 81, 75, 89, 77],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.3,
        pointBorderColor: '#2563eb',
        pointBackgroundColor: '#fff',
        fill: true
      }
    ]
  }

  const averageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          color: '#6b7280'
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: '#6b7280'
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <>
      <Topbar
        navItems={navItems}
        user={user}
        onNotificationClick={() => console.log('🔔 Notification clicked')}
      />

      <div className="px-4 md:px-8 pt-6 md:pt-8 pb-12 max-w-7xl mx-auto">
        <SectionHeader
          title="Promedios"
          subtitle="En esta sección podrás consultar tu promedio académico general, así como el correspondiente al periodo actual. Utiliza esta información para llevar un seguimiento continuo de tu desempeño y realizar mejoras en tu proceso de aprendizaje."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Period Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#2c6e91] rounded-full w-10 h-10 flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Período Actual</h3>
                  <p className="text-sm text-gray-500">5to de secundaria</p>
                </div>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                2024-2025
              </div>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <p className="text-4xl font-bold text-[#2c6e91]">85.7</p>
              <div className="flex items-center text-emerald-500 text-sm mb-1">
                <ChevronUpIcon className="w-4 h-4" />
                <span>+3.2%</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">Tu promedio está mejorando, sigue así.</p>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FireIcon className="w-4 h-4 text-orange-500" />
                <p className="text-xs font-medium text-gray-700 uppercase">
                  Asignatura con mejor Promedio
                </p>
              </div>
              <p className="text-sm font-medium text-gray-800">Física Cuántica</p>
            </div>
          </div>

          {/* General Average Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold">Promedio General</h3>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-4xl font-bold text-blue-600">81.6</p>
              <p className="text-sm text-gray-500 mt-1">Promedio de todos los períodos</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mejor período</span>
                <span className="text-sm font-medium">4to Secundaria (89)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Período más bajo</span>
                <span className="text-sm font-medium">3ro Secundaria (75)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Evolución de Promedios por Período
          </h2>
          <div className="w-full h-[500px]">
            <ChartWrapper
              type="line"
              data={averageData}
              options={averageOptions}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default GradeAverage
