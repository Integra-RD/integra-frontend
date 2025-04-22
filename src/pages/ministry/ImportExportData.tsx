import React, { useEffect, useState } from 'react'
import {
  CircleStackIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  InboxArrowDownIcon,
  CircleStackIcon as RecordsIcon,
  TrophyIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// TODO: Connect to the backend realted to DELETE requests, right now it's just deleting it from the frontend

interface RawRequest {
  id: number
  aprobado: boolean
  requested_date: string
  first_name: string
  last_name: string
  email: string
  centro_educativo_id: number | null
}

interface AccountRequest {
  id: number
  aprobado: boolean
  requested_date: string
  usuario: { full_name: string; email: string }
  centro_educativo?: { nombre_centro_educativo: string }
}

const PER_PAGE = 10

const ImportExportData: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole('ministry', location, navigate)

  const [activeTab, setActiveTab] = useState<'recibidos' | 'registrados'>('recibidos')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pending, setPending] = useState<AccountRequest[]>([])
  const [approved, setApproved] = useState<AccountRequest[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true)
      try {
        const offset = (currentPage - 1) * PER_PAGE
        const { data } = await api.get('/auth/cola-solicitudes/', {
          params: { requests: PER_PAGE, offset }
        })

        setTotalPages(Math.max(1, Math.ceil(data.count / PER_PAGE)))

        const raws: RawRequest[] = data.results

        const enriched: AccountRequest[] = raws.map(r => ({
          id: r.id,
          aprobado: r.aprobado,
          requested_date: r.requested_date,
          usuario: {
            full_name: `${r.first_name} ${r.last_name}`,
            email: r.email
          },
          centro_educativo: r.centro_educativo_id
            ? { nombre_centro_educativo: '— sin nombre —' }
            : undefined
        }))

        setPending(enriched.filter(r => !r.aprobado))
        setApproved(enriched.filter(r => r.aprobado))
      } catch (err) {
        console.error(err)
        toast.error('No se pudo cargar la cola de solicitudes')
      } finally {
        setLoading(false)
      }
    }

    fetchQueue()
  }, [activeTab, currentPage])

  const decideRequest = async (id: number, approved: boolean) => {
    const req = pending.find(r => r.id === id)
    const body: any = { approved }

    if (approved && req) {
      const roleId = req.centro_educativo ? 5 : 2
      body.role_ids = [{ id_rol: roleId }]
    }

    try {
      await api.put(`/auth/account-approval/${id}`, body)
      toast.success(approved ? 'Cuenta aprobada' : 'Solicitud rechazada')

      setPending(prev => {
        if (approved && req) {
          setApproved(a => [{ ...req, aprobado: true }, ...a])
        }
        return prev.filter(r => r.id !== id)
      })

      if (approved && req) {
        try {
          await api.post('/auth/reset-password/', { email: req.usuario.email })
          toast.info('Correo de activación enviado')
        } catch {
          toast.error('No se pudo enviar correo de activación')
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar la solicitud')
    }
  }

  const source = activeTab === 'recibidos' ? pending : approved

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar />

      <LayoutWrapper
        title="I/O de Datos"
        subtitle="Gestiona las solicitudes de instituciones educativas: aprueba, rechaza o consulta los centros ya registrados."
        navItems={navItems}
        headerRightSection={
          <div className="flex gap-3">
            {(['recibidos', 'registrados'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setCurrentPage(1)
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border ${
                  activeTab === tab
                    ? 'bg-[#005D85] text-white'
                    : 'text-[#005D85] border-[#005D85] hover:bg-blue-50'
                } transition`}
              >
                {tab === 'recibidos' ? (
                  <>
                    <InboxArrowDownIcon className="w-4 h-4" /> Recibidos
                  </>
                ) : (
                  <>
                    <CircleStackIcon className="w-4 h-4" /> Registrados
                  </>
                )}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Cargando…</p>
          ) : source.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {activeTab === 'recibidos' ? 'Sin solicitudes pendientes' : 'Sin centros registrados'}
            </p>
          ) : (
            source.map(req => (
              <ViewCard
                key={req.id}
                title={req.centro_educativo?.nombre_centro_educativo ?? req.usuario.full_name}
                titleIcon={<BuildingLibraryIcon className="w-5 h-5 text-blue-800" />}
                className="bg-[#f2f6fc]"
                variant="detailed"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Fecha */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Fecha</p>
                      <p className="text-sm font-medium">
                        {new Date(req.requested_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* Solicitante */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Solicitante</p>
                      <p className="text-sm font-medium">{req.usuario.full_name}</p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                    <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Email</p>
                      <p className="text-sm font-medium">{req.usuario.email}</p>
                    </div>
                  </div>
                  {activeTab === 'registrados' && (
                    <>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                        <RecordsIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-[10px] text-gray-500">Registros</p>
                          <p className="text-sm font-medium">—</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm">
                        <TrophyIcon className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-[10px] text-gray-500">Promedio General</p>
                          <p className="text-sm font-medium">—</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {activeTab === 'recibidos' ? (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => decideRequest(req.id, true)}
                      className="bg-[#005D85] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#004766] transition"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => decideRequest(req.id, false)}
                      className="border border-[#005D85] text-[#005D85] px-4 py-1.5 rounded-md text-sm hover:border-red-500 hover:text-red-600 transition"
                    >
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button className="border border-yellow-500 text-yellow-600 px-4 py-1.5 rounded-md text-sm hover:bg-yellow-400 hover:text-black transition">
                      Iniciar Proceso de Auditoría
                    </button>
                  </div>
                )}
              </ViewCard>
            ))
          )}

          {totalPages > 1 && (
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
          )}
        </div>
      </LayoutWrapper>
    </>
  )
}

export default ImportExportData
