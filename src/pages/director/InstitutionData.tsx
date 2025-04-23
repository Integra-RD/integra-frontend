import type React from 'react'
import { useEffect, useState } from 'react'
import {
  BuildingLibraryIcon,
  InformationCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'
import ChartWrapper from '../../components/ChartWrapper'
import inteclogo from '../../assets/inteclogo.png'
import pucmmlogo from '../../assets/pucmmlogo.png'
import unibelogo from '../../assets/unibelogo.png'
import unphulogo from '../../assets/unphulogo.png'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'

interface SchoolData {
  id: number
  name: string
  location: string
  director: string
  email: string
}

const lineDataAvg = {
  labels: ['Q1', 'Q2', 'Q3'],
  datasets: [
    {
      label: '2024',
      data: Array(3)
        .fill(0)
        .map(() => Math.floor(Math.random() * 1000) + 1),
      borderColor: '#94a3b8',
      backgroundColor: '#cbd5e1',
      tension: 0.4
    },
    {
      label: '2025',
      data: Array(3)
        .fill(0)
        .map(() => Math.floor(Math.random() * 1000) + 1),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      tension: 0.4
    }
  ]
}

const lineDataDistStudents = {
  labels: ['Básica', 'Secundaria'],
  datasets: [
    {
      data: [800, 600],
      backgroundColor: ['#94a3b8', '#2563eb'],
      borderColor: ['#64748b', '#1d4ed8'],
      borderWidth: 1
    }
  ]
}

const chartOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 200
      }
    }
  }
}

const universities = [
  { name: 'INTEC', programs: '3 Programas Disponibles', logo: inteclogo },
  { name: 'PUCMM', programs: '2 Programas Disponibles', logo: pucmmlogo },
  { name: 'UNIBE', programs: '5 Programas Disponibles', logo: unibelogo },
  { name: 'UNPHU', programs: '1 Programa Disponible', logo: unphulogo }
]

const subjectsData = {
  labels: ['Matemáticas', 'Lenguas', 'Artes', 'Tecnologías', 'Ciencias'],
  datasets: [
    {
      label: 'Rendimiento',
      data: [85, 72, 90, 78, 88],
      backgroundColor: ['#94a3b8']
    }
  ]
}

const evolutionData = {
  labels: ['2022', '2023', '2024'],
  datasets: [
    {
      label: 'Técnico',
      data: [75, 82, 88],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      tension: 0.4
    },
    {
      label: 'Atres',
      data: [68, 75, 80],
      borderColor: '#94a3b8',
      backgroundColor: 'rgba(148, 163, 184, 0.2)',
      tension: 0.4
    },
    {
      label: 'Tecnologías Ciencias',
      data: [72, 78, 85],
      borderColor: '#cbd5e1',
      backgroundColor: 'rgba(203, 213, 225, 0.2)',
      tension: 0.4
    },
    {
      label: 'Artes',
      data: [80, 85, 92],
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      tension: 0.4
    }
  ]
}

const InstitutionData: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userId } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)

  const [editing, setEditing] = useState({
    location: false,
    director: false,
    email: false
  })

  const [editedData, setEditedData] = useState({
    location: '',
    director: '',
    email: ''
  })

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/academic/centro-educativo/list/')

        if (response.data && response.data.results && response.data.results.length > 0) {
          const school = response.data.results[0]

          let locationStr = 'Sin dirección registrada'
          if (school.direccion) {
            if (typeof school.direccion === 'object') {
              const dirObj = school.direccion
              const parts = []
              if (dirObj.calle) parts.push(dirObj.calle)
              if (dirObj.informacion_vivienda) parts.push(dirObj.informacion_vivienda)
              if (parts.length > 0) {
                locationStr = parts.join(', ')
              }
            } else {
              locationStr = school.direccion
            }
          }

          const schoolData = {
            id: school.id,
            name: school.nombre || 'Centro Educativo',
            location: locationStr,
            director: school.director_nombre || 'Sin director asignado',
            email: school.email || 'Sin correo registrado'
          }

          setSchoolData(schoolData)

          setEditedData({
            location: schoolData.location,
            director: schoolData.director,
            email: schoolData.email
          })
        } else {
          setError('No se encontraron centros educativos')
        }
      } catch (err) {
        console.error('Error fetching school data:', err)
        setError('Error al cargar los datos del centro educativo')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchoolData()
  }, [userId])

  useEffect(() => {
    if (!isLoading && schoolData) {
      localStorage.setItem('submissionData', JSON.stringify(editedData))
    }
  }, [editedData, isLoading, schoolData])

  const handleChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
  }

  const navItems = getNavItemsByRole('director', location, navigate)

  if (isLoading) {
    return (
      <LayoutWrapper
        title="Mi Centro Educativo"
        subtitle="Cargando datos del centro educativo..."
        navItems={navItems}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </LayoutWrapper>
    )
  }

  if (error) {
    return (
      <LayoutWrapper
        title="Mi Centro Educativo"
        subtitle="Error al cargar datos"
        navItems={navItems}
      >
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper
      title="Mi Centro Educativo"
      subtitle="Maneja la identidad y operación de tu centro educativo: actualiza nombre, ubicación, director y datos de contacto de forma rápida y segura"
      navItems={navItems}
    >
      <div className="w-full mx-auto mb-6">
        {schoolData ? (
          <ViewCard
            key={schoolData.id}
            title={schoolData.name}
            titleIcon={<BuildingLibraryIcon className="w-5 h-5 text-blue-800" />}
            rightIcon={<InformationCircleIcon className="w-4 h-4 text-gray-400 mt-0.5" />}
            className="bg-[#f2f6fc]"
            variant="detailed"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500">Ubicación</p>
                  {editing.location ? (
                    <input
                      type="text"
                      className="text-sm font-medium bg-transparent border-b border-blue-300 focus:outline-none"
                      value={editedData.location}
                      onChange={e => handleChange('location', e.target.value)}
                      onBlur={() => setEditing(prev => ({ ...prev, location: false }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{editedData.location}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500">Director</p>
                  {editing.director ? (
                    <input
                      type="text"
                      className="text-sm font-medium bg-transparent border-b border-blue-300 focus:outline-none"
                      value={editedData.director}
                      onChange={e => handleChange('director', e.target.value)}
                      onBlur={() => setEditing(prev => ({ ...prev, director: false }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{editedData.director}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500">Email</p>
                  {editing.email ? (
                    <input
                      type="text"
                      className="text-sm font-medium bg-transparent border-b border-blue-300 focus:outline-none"
                      value={editedData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      onBlur={() => setEditing(prev => ({ ...prev, email: false }))}
                    />
                  ) : (
                    <p className="text-sm font-medium">{editedData.email}</p>
                  )}
                </div>
              </div>
            </div>
          </ViewCard>
        ) : (
          <div
            className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Aviso: </strong>
            <span className="block sm:inline">
              No se encontraron centros educativos asociados a su cuenta.
            </span>
          </div>
        )}
      </div>

      {/* Segunda fila: Charts + Universidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-screen-xl mx-auto">
        <ViewCard title="Promedio General" variant="detailed">
          <ChartWrapper type="line" data={lineDataAvg} />
        </ViewCard>

        <ViewCard title="Distribución de Estudiantes" variant="detailed">
          <ChartWrapper type="bar" data={lineDataDistStudents} options={chartOptions} />
        </ViewCard>

        <ViewCard title="Universidades" variant="detailed">
          <p className="text-sm text-gray-600 mb-3">
            Universidades con programas de beca disponibles para sus estudiantes
          </p>
          <ul className="space-y-2">
            {universities.map((uni, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <img src={uni.logo || '/placeholder.svg'} alt="Uni logo" className="w-5 h-5" />
                <div>
                  <p className="font-medium text-sm">{uni.name}</p>
                  <p className="text-xs text-gray-500">{uni.programs}</p>
                </div>
              </li>
            ))}
          </ul>
        </ViewCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-6">
        <ViewCard title="Rendimiento por Asignaturas" variant="detailed">
          <ChartWrapper type="bar" data={subjectsData} />
          <div className="mt-4 text-sm text-gray-600">
            <ul className="list-disc list-inside ml-2"></ul>
          </div>
        </ViewCard>

        <ViewCard title="Evolución del Promedio Académico Anual" variant="detailed">
          <ChartWrapper type="bar" data={evolutionData} />
          <div className="mt-4 text-sm text-gray-600">
            <ul className="list-disc list-inside ml-2"></ul>
          </div>
          <div className="mt-2 text-xs text-gray-500"></div>
        </ViewCard>
      </div>
    </LayoutWrapper>
  )
}

export default InstitutionData
