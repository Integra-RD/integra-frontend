import React, { useState } from 'react'
import {
  AcademicCapIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
  MegaphoneIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'
import ChartWrapper from '../../components/ChartWrapper'
import logoPlaceholder from '../../assets/integraLogo.svg'

// TODO: Respect DRY with the navItems inside the topbar
const universities = [
  { name: 'Universidad Placeholder A', programs: '3 Programas Disponibles', logo: logoPlaceholder },
  { name: 'Universidad Placeholder B', programs: '2 Programas Disponibles', logo: logoPlaceholder },
  { name: 'Universidad Placeholder C', programs: '5 Programas Disponibles', logo: logoPlaceholder },
  { name: 'Universidad Placeholder D', programs: '1 Programa Disponible', logo: logoPlaceholder }
]

const scholarships = [
  {
    title: 'Beca Académica Nacional',
    subtitle: 'Grado',
    description:
      'Otorgada a estudiantes con alto rendimiento académico para cubrir parcial o totalmente la matrícula en universidades e instituciones educativas nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '100%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 90/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '4 Años' }
    ]
  },
  {
    title: 'Beca Internacional',
    subtitle: 'Grado',
    description:
      'Otorgada a estudiantes con alto rendimiento académico para cubrir parcial o totalmente la matrícula en universidades e instituciones educativas internacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '50%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Internacionales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 85/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '3 Años' }
    ]
  },
  {
    title: 'Beca Deportiva',
    subtitle: 'Grado',
    description:
      'Otorgada a estudiantes destacados en deportes para cubrir parcial o totalmente la matrícula en universidades e instituciones educativas nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '75%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 80/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '4 Años' }
    ]
  },
  {
    title: 'Beca Técnica',
    subtitle: 'Técnico',
    description:
      'Otorgada a estudiantes con interés en formación técnica para cubrir parcial o totalmente la matrícula en instituciones técnicas nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '100%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Institutos Técnicos Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 75/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '2 Años' }
    ]
  },
  {
    title: 'Beca de Idiomas',
    subtitle: 'Idiomas',
    description:
      'Otorgada a estudiantes con interés en aprender idiomas para cubrir parcial o totalmente la matrícula en instituciones de idiomas nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '50%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Escuelas de Idiomas Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 70/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '1 Año' }
    ]
  },
  {
    title: 'Beca de Investigación',
    subtitle: 'Investigación',
    description:
      'Otorgada a estudiantes con interés en investigación para cubrir parcial o totalmente la matrícula en programas de investigación nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '100%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 85/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '2 Años' }
    ]
  },
  {
    title: 'Beca de Capacitación',
    subtitle: 'Capacitación',
    description:
      'Otorgada a estudiantes con interés en capacitación para cubrir parcial o totalmente la matrícula en programas de capacitación nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '75%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Institutos Técnicos Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 80/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '1 Año' }
    ]
  },
  {
    title: 'Beca de Intercambio',
    subtitle: 'Intercambio',
    description:
      'Otorgada a estudiantes con interés en intercambio cultural para cubrir parcial o totalmente la matrícula en programas de intercambio nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '50%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 75/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '1 Año' }
    ]
  },
  {
    title: 'Beca de Liderazgo',
    subtitle: 'Liderazgo',
    description:
      'Otorgada a estudiantes con interés en liderazgo para cubrir parcial o totalmente la matrícula en programas de liderazgo nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '100%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 90/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '2 Años' }
    ]
  },
  {
    title: 'Beca de Innovación',
    subtitle: 'Innovación',
    description:
      'Otorgada a estudiantes con interés en innovación para cubrir parcial o totalmente la matrícula en programas de innovación nacionales.',
    miniCards: [
      {
        icon: <BanknotesIcon className="w-4 h-4 text-gray-500" />,
        title: 'Cobertura',
        value: '75%'
      },
      {
        icon: <BuildingOffice2Icon className="w-4 h-4 text-gray-500" />,
        title: 'Instituciones',
        value: 'Universidades Locales'
      },
      {
        icon: <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500" />,
        title: 'Requisitos',
        value: 'Promedio 85/100'
      },
      { icon: <ClockIcon className="w-4 h-4 text-gray-500" />, title: 'Duración', value: '3 Años' }
    ]
  }
]

const chartData = {
  labels: ['Nacional', 'Internac.', 'Deport.', 'Técnicas'],
  datasets: [
    {
      label: 'Tendencias',
      data: Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 1000) + 1),
      backgroundColor: '#2563eb'
    }
  ]
}

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

const Scholarships: React.FC = () => {
  const user = { name: 'Juan Pérez', id: '0034' }
  const location = useLocation()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 5
  const totalPages = Math.ceil(scholarships.length / perPage)
  const currentScholarships = scholarships.slice((currentPage - 1) * perPage, currentPage * perPage)

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
    },
    {
      label: 'Comunicaciones',
      icon: <MegaphoneIcon className="w-5 h-5" />,
      active: location.pathname === '/ministry/messaging',
      onClick: () => navigate('/ministry/messaging')
    }
  ]

  return (
    <LayoutWrapper
      title="Becas y Programas"
      subtitle="Visualiza, administra y evalúa los programas de becas disponibles en todo el sistema educativo nacional e internacional."
      user={user}
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <ViewCard
          title="Total de Becas Activas"
          subtitle="10,500"
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<AcademicCapIcon className="w-8 h-8 text-black" />}
        />
        <ViewCard
          title="Total de Beneficiarios"
          subtitle="6,350"
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<UserGroupIcon className="w-8 h-8 text-black" />}
        />
        <ViewCard
          title="Fondos Asignados"
          subtitle="RD$500M"
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<BanknotesIcon className="w-8 h-8 text-black" />}
        />
        <ViewCard
          title="Becas en Evaluación"
          subtitle="1,200"
          bgColor="bg-blue-100"
          textColor="text-slate-900"
          variant="compact"
          rightIcon={<ClipboardDocumentCheckIcon className="w-8 h-8 text-black" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {currentScholarships.map((s, idx) => (
            <ViewCard
              key={idx}
              title={s.title}
              subtitle={s.subtitle}
              showExternalLink
              showInternalLink
              onExternalClick={() => window.open('https://educacion.gob.do', '_blank')}
              onInternalClick={() => navigate('/ministry/scholarships/crud')}
            >
              <p className="text-sm text-gray-600">{s.description}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {s.miniCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm"
                  >
                    {card.icon}
                    <div>
                      <p className="text-xs text-gray-800">{card.title}</p>
                      <p className="font-medium text-gray-800">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ViewCard>
          ))}

          <div className="flex justify-end items-center gap-3 mt-4 text-sm">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded hover:text-[#2563eb] disabled:text-gray-400 transition"
            >
              &lt;
            </button>
            <span>
              Página <strong>{currentPage}</strong> de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded hover:text-[#2563eb] disabled:text-gray-400 transition"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <ViewCard
            title="Universidades"
            subtitle="Universidades con programas de beca disponibles"
            variant="detailed"
          >
            <div className="space-y-4">
              {universities.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={u.logo} alt="Logo" className="w-8 h-8" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.programs}</p>
                  </div>
                </div>
              ))}
            </div>
          </ViewCard>

          <ViewCard title="Tendencias" variant="detailed">
            <div className="w-full h-[220px]">
              <ChartWrapper type="bar" data={chartData} />
            </div>
          </ViewCard>

          <ViewCard title="Becas Asignadas" variant="detailed">
            <div className="w-full h-[220px]">
              <ChartWrapper type="line" data={lineData} />
            </div>
          </ViewCard>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default Scholarships
