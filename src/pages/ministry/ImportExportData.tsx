import React, { useState } from 'react'
import {
  HomeIcon,
  AcademicCapIcon,
  CircleStackIcon,
  DocumentMagnifyingGlassIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  InboxArrowDownIcon,
  CircleStackIcon as RecordsIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'

const submissions = [
  { name: 'Colegio Nacional Ejemplo', date: '04/06/2025', period: 'Semestre Enero - Junio 2025' },
  { name: 'Universidad Ejemplo', date: '04/06/2025', period: 'Semestre Enero - Junio 2025' },
  { name: 'Instituto Ejemplo', date: '04/06/2025', period: 'Semestre Enero - Junio 2025' },
  { name: 'Escuela Ejemplo', date: '04/06/2025', period: 'Semestre Enero - Junio 2025' },
  { name: 'Centro Educativo Ejemplo', date: '04/06/2025', period: 'Semestre Enero - Junio 2025' }
]

const ImportExportData: React.FC = () => {
  const user = { name: 'Juan Pérez', id: '0034' }
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'recibidos' | 'registrados'>('recibidos')
  const [currentPage, setCurrentPage] = useState(1)

  const perPage = 3
  const totalPages = Math.ceil(submissions.length / perPage)
  const currentSubmissions = submissions.slice((currentPage - 1) * perPage, currentPage * perPage)

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

  return (
    <LayoutWrapper
      title="I/O de Datos"
      subtitle="Gestiona las solicitudes de instituciones educativas: aprueba, rechaza o consulta los centros ya registrados."
      user={user}
      navItems={navItems}
      headerRightSection={
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('recibidos')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border ${
              activeTab === 'recibidos'
                ? 'bg-[#005D85] text-white'
                : 'text-[#005D85] border-[#005D85] hover:bg-blue-50'
            } transition`}
          >
            <InboxArrowDownIcon className="w-4 h-4" />
            Recibidos
          </button>
          <button
            onClick={() => setActiveTab('registrados')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border ${
              activeTab === 'registrados'
                ? 'bg-[#005D85] text-white'
                : 'text-[#005D85] border-[#005D85] hover:bg-blue-50'
            } transition`}
          >
            <CircleStackIcon className="w-4 h-4" />
            Registrados
          </button>
        </div>
      }
    >
      {/* Cards */}
      <div className="space-y-6">
        {currentSubmissions.map((submission, idx) => (
          <ViewCard
            key={idx}
            title={submission.name}
            titleIcon={<BuildingLibraryIcon className="w-5 h-5 text-blue-800" />}
            showDownloadLink
            onDownloadClick={() => console.log(`Descargando datos de: ${submission.name}`)}
            showDelete={activeTab === 'registrados'}
            onDeleteClick={() => console.log(`Eliminando ${submission.name}`)}
            className="bg-[#f2f6fc]"
            variant="detailed"
          >
            <div className="flex flex-wrap items-center gap-4">
              {activeTab === 'recibidos' ? (
                <>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Fecha</p>
                      <p className="text-sm font-medium">{submission.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Periodo Correspondiente</p>
                      <p className="text-sm font-medium">{submission.period}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Fecha Última Actualización</p>
                      <p className="text-sm font-medium">{submission.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <RecordsIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Cantidad de Registros</p>
                      <p className="text-sm font-medium">24</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <TrophyIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Promedio General</p>
                      <p className="text-sm font-medium">87.2</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {activeTab === 'recibidos' && (
              <div className="flex gap-2 mt-4">
                <button className="bg-[#005D85] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#004766] transition">
                  Aprobar
                </button>
                <button className="border border-[#005D85] text-[#005D85] px-4 py-1.5 rounded-md text-sm hover:border-red-500 hover:text-red-600 transition">
                  Rechazar
                </button>
              </div>
            )}

            {activeTab === 'registrados' && (
              <div className="mt-4">
                <button className="border border-yellow-500 text-yellow-600 px-4 py-1.5 rounded-md text-sm hover:bg-yellow-400 hover:text-black transition">
                  Iniciar Proceso de Auditoría
                </button>
              </div>
            )}
          </ViewCard>
        ))}

        {/* Pagination */}
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
    </LayoutWrapper>
  )
}

export default ImportExportData
