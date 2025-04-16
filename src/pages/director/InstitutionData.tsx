import React, { useState } from 'react'
import {
  HomeIcon,
  DocumentMagnifyingGlassIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  InformationCircleIcon,
  UsersIcon,
  MapPinIcon,
  BriefcaseIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'
import ChartWrapper from '../../components/ChartWrapper'
import logoPlaceholder from '../../assets/integraLogo.svg'


const submissions = [
  { name: 'Colegio Nacional Ejemplo', location: 'Av. Santo Cerro 11, Santo Domingo', director: 'Jose Rodríguez', contacto: '809-123-4567' }
]

const lineData = {
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

  const universities = [
    { name: 'Universidad Placeholder A', programs: '3 Programas Disponibles', logo: logoPlaceholder },
    { name: 'Universidad Placeholder B', programs: '2 Programas Disponibles', logo: logoPlaceholder },
    { name: 'Universidad Placeholder C', programs: '5 Programas Disponibles', logo: logoPlaceholder },
    { name: 'Universidad Placeholder D', programs: '1 Programa Disponible', logo: logoPlaceholder }
  ]

  const subjectsData = {
    labels: ['Matemáticas', 'Lenguas', 'Artes','Tecnologías','Ciencias'],
    datasets: [
      {
        label: 'Rendimiento',
        data: [85, 72, 90, 78, 88],
        backgroundColor: ['#94a3b8'],
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
    const user = { name: 'Juan Pérez', id: '0034' }
    const location = useLocation()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
  
    const perPage = 3
    const totalPages = Math.ceil(submissions.length / perPage)
    const currentSubmissions = submissions.slice((currentPage - 1) * perPage, currentPage * perPage)
  
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
        title="Mi Centro Educativo"
        subtitle="Maneja la identidad y operación de tu centro educativo: actualiza nombre, ubicación, director y datos de contacto de forma rápida y segura"
        user={user}
        navItems={navItems}
      >
        {/* Card Principal: colegio */}
       {/* Card Principal: colegio */}
<div className="w-full mx-auto mb-6">
  {currentSubmissions.map((submission, idx) => (
    <ViewCard
      key={idx}
      title={submission.name}
      titleIcon={<BuildingLibraryIcon className="w-5 h-5 text-blue-800" />}
      rightIcon={<InformationCircleIcon className="w-4 h-4 text-gray-400 mt-0.5" />}
      showEditLink
      onEditClick={() => console.log(`Editando datos de: ${submission.name}`)}
      className="bg-[#f2f6fc]"
      variant="detailed"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
          <MapPinIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-[10px] text-gray-500">Ubicación</p>
            <p className="text-sm font-medium">{submission.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
          <BriefcaseIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-[10px] text-gray-500">Director</p>
            <p className="text-sm font-medium">{submission.director}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
          <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-[10px] text-gray-500">Contacto</p>
            <p className="text-sm font-medium">{submission.contacto}</p>
          </div>
        </div>
      </div>
    </ViewCard>
        ))}
        </div>
        
        {/* Segunda fila: Charts + Universidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-screen-xl mx-auto">
          <ViewCard title="Promedio General" variant="detailed">
            <ChartWrapper type="line" data={lineData} />
          </ViewCard>
  
          <ViewCard title="Promedio General" variant="detailed">
            <ChartWrapper type="line" data={lineData} />
          </ViewCard>
  
          <ViewCard title="Universidades" variant="detailed">
            <p className="text-sm text-gray-600 mb-3">Universidades con programas de beca disponibles</p>
            <ul className="space-y-2">
              {universities.map((uni, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <img src={uni.logo} alt="Uni logo" className="w-5 h-5" />
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
                <ul className="list-disc list-inside ml-2">
                </ul>
                </div>
            </ViewCard>

            <ViewCard title="Evolución del Promedio Académico Anual" variant="detailed">
                <ChartWrapper type="bar" data={evolutionData} />
                <div className="mt-4 text-sm text-gray-600">
                <ul className="list-disc list-inside ml-2">
                </ul>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                </div>
            </ViewCard>
        </div>

        
      </LayoutWrapper>
    )
  }
  
  export default InstitutionData