import React, { useEffect, useState, useCallback } from 'react'
import {
  InboxArrowDownIcon,
  CircleStackIcon,
  BuildingLibraryIcon,
  KeyIcon,
  CalendarDaysIcon,
  UserIcon,
  EnvelopeIcon,
  CircleStackIcon as RecordsIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import ViewCard from '../../components/ViewCard'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Mode = 'recibidos' | 'registrados'

interface RawRequest {
  id: number
  aprobado: boolean
  requested_date: string
  first_name: string
  last_name: string
  email: string
  centro_educativo_id: number | null
  roles: { id_rol: number; nombre_rol: string }[]
}

interface RawCenter {
  id: number
  nombre_centro_educativo: string
}

interface AccountRequest {
  id: number
  aprobado: boolean
  requested_date: string
  usuario: { full_name: string; email: string }
  centro_educativo?: { nombre_centro_educativo: string }
  requestedRoleId: number
}

const PER_PAGE = 10
const CARD_CLASS = 'bg-[#f2f6fc]'
const FIELD_WRAPPER = 'flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm text-sm'

const TabToggle: React.FC<{ active: Mode; onChange: (mode: Mode) => void }> = ({
  active,
  onChange
}) => (
  <div className="flex gap-3">
    {(['recibidos', 'registrados'] as Mode[]).map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border transition ${
          active === tab
            ? 'bg-[#005D85] text-white'
            : 'text-[#005D85] border-[#005D85] hover:bg-blue-50'
        }`}
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
)

const PaginationControls: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-end items-center gap-3 mt-4 text-sm">
    <button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded hover:text-[#2563eb] disabled:text-gray-400 transition"
    >
      &lt;
    </button>
    <span>
      Página <strong>{currentPage}</strong> de {totalPages}
    </span>
    <button
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded hover:text-[#2563eb] disabled:text-gray-400 transition"
    >
      &gt;
    </button>
  </div>
)

const RequestCard: React.FC<{
  req: AccountRequest
  mode: Mode
  onDecide: (id: number, approve: boolean) => void
  onStartAudit: (id: number) => void
  auditing: Set<number>
}> = ({ req, mode, onDecide, onStartAudit, auditing }) => {
  const isMinerd = req.requestedRoleId === 2
  const Icon = isMinerd ? KeyIcon : BuildingLibraryIcon
  const title = isMinerd
    ? req.usuario.full_name
    : (req.centro_educativo?.nombre_centro_educativo ?? req.usuario.full_name)
  const underAudit = auditing.has(req.id)

  return (
    <ViewCard
      key={req.id}
      title={title}
      titleIcon={<Icon className="w-5 h-5 text-blue-800" />}
      className={`${CARD_CLASS} ${underAudit ? 'border-2 border-yellow-400 bg-yellow-100' : ''}`}
      variant="detailed"
    >
      {mode === 'recibidos' ? (
        <div className="flex flex-wrap items-center gap-4">
          {/* Fecha */}
          <div className={FIELD_WRAPPER}>
            <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500">Fecha</p>
              <p className="text-sm font-medium">
                {new Date(req.requested_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          {/* Solicitante */}
          <div className={FIELD_WRAPPER}>
            <UserIcon className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500">Solicitante</p>
              <p className="text-sm font-medium">{req.usuario.full_name}</p>
            </div>
          </div>
          {/* Email */}
          <div className={FIELD_WRAPPER}>
            <EnvelopeIcon className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500">Email</p>
              <p className="text-sm font-medium">{req.usuario.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Registros */}
          <div className={FIELD_WRAPPER}>
            <RecordsIcon className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500">Registros</p>
              <p className="text-sm font-medium">—</p>
            </div>
          </div>
          {/* Promedio */}
          <div className={FIELD_WRAPPER}>
            <TrophyIcon className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500">Promedio General</p>
              <p className="text-sm font-medium">—</p>
            </div>
          </div>
        </div>
      )}

      {mode === 'recibidos' ? (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onDecide(req.id, true)}
            className="bg-[#005D85] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#004766] transition"
          >
            Aprobar
          </button>
          <button
            onClick={() => onDecide(req.id, false)}
            className="border border-[#005D85] text-[#005D85] px-4 py-1.5 rounded-md text-sm hover:border-red-500 hover:text-red-600 transition"
          >
            Rechazar
          </button>
        </div>
      ) : underAudit ? (
        <div className="mt-4 inline-block bg-yellow-400 text-white px-4 py-1.5 rounded-md text-sm">
          En auditoría
        </div>
      ) : (
        <button
          onClick={() => onStartAudit(req.id)}
          className="border border-yellow-500 text-yellow-600 px-4 py-1.5 rounded-md text-sm hover:bg-yellow-400 hover:text-black transition mt-4"
        >
          Iniciar Proceso de Auditoría
        </button>
      )}
    </ViewCard>
  )
}

const ImportExportData: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole('ministry', location, navigate)

  const [mode, setMode] = useState<Mode>('recibidos')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pending, setPending] = useState<AccountRequest[]>([])
  const [approved, setApproved] = useState<AccountRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [auditing, setAuditing] = useState<Set<number>>(new Set())

  // read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auditingIds')
    if (stored) {
      setAuditing(new Set(JSON.parse(stored)))
    }
  }, [])

  // persist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auditingIds', JSON.stringify(Array.from(auditing)))
  }, [auditing])

  // fetch both modes
  const fetchData = useCallback(async () => {
    setLoading(true)
    const offset = (page - 1) * PER_PAGE

    try {
      if (mode === 'recibidos') {
        const { data } = await api.get('/auth/cola-solicitudes/', {
          params: { requests: PER_PAGE, offset }
        })
        setTotalPages(Math.max(1, Math.ceil(data.count / PER_PAGE)))
        const enriched: AccountRequest[] = data.results.map((r: RawRequest) => ({
          id: r.id,
          aprobado: r.aprobado,
          requested_date: r.requested_date,
          usuario: { full_name: `${r.first_name} ${r.last_name}`, email: r.email },
          centro_educativo: r.centro_educativo_id
            ? { nombre_centro_educativo: '— sin nombre —' }
            : undefined,
          requestedRoleId: r.roles[0]?.id_rol ?? 2
        }))
        setPending(enriched.filter(r => !r.aprobado))
      } else {
        const { data } = await api.get('/academic/centro-educativo/list/', {
          params: { centers: PER_PAGE, offset }
        })
        setTotalPages(Math.max(1, Math.ceil(data.count / PER_PAGE)))
        setApproved(
          data.results.map((c: RawCenter) => ({
            id: c.id,
            aprobado: true,
            requested_date: '',
            usuario: { full_name: '', email: '' },
            centro_educativo: { nombre_centro_educativo: c.nombre_centro_educativo },
            requestedRoleId: 5
          }))
        )
      }
    } catch (err) {
      console.error(err)
      toast.error(
        mode === 'recibidos'
          ? 'No se pudo cargar la cola de solicitudes'
          : 'No se pudo cargar los centros registrados'
      )
    } finally {
      setLoading(false)
    }
  }, [mode, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  /** Approve / reject */
  const handleDecide = async (id: number, approve: boolean) => {
    const req = pending.find(r => r.id === id)
    if (!req) return
    try {
      await api.put(`/auth/account-approval/${id}`, {
        approved: approve,
        ...(approve ? { role_ids: [{ id_rol: req.requestedRoleId }] } : {})
      })
      toast.success(approve ? 'Cuenta aprobada' : 'Solicitud rechazada')
      setPending(p => p.filter(r => r.id !== id))
      if (approve) {
        setApproved(a => [{ ...req, aprobado: true }, ...a])
        await api.post('/auth/reset-password/', { email: req.usuario.email })
        toast.info('Correo de activación enviado')
      }
    } catch {
      toast.error('No se pudo actualizar la solicitud')
    }
  }

  const handleStartAudit = (id: number) => {
    setAuditing(prev => new Set(prev).add(id))
    toast.info('Proceso de auditoría iniciado')
  }

  const list = mode === 'recibidos' ? pending : approved

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar />
      <LayoutWrapper
        title="I/O de Datos"
        subtitle="Gestiona las solicitudes de instituciones educativas: aprueba, rechaza o consulta los centros ya registrados."
        navItems={navItems}
        headerRightSection={
          <TabToggle
            active={mode}
            onChange={m => {
              setMode(m)
              setPage(1)
            }}
          />
        }
      >
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 py-8">Cargando…</p>
          ) : list.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {mode === 'recibidos' ? 'Sin solicitudes pendientes' : 'Sin centros registrados'}
            </p>
          ) : (
            list.map(r => (
              <RequestCard
                key={r.id}
                req={r}
                mode={mode}
                onDecide={handleDecide}
                onStartAudit={handleStartAudit}
                auditing={auditing}
              />
            ))
          )}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={p => setPage(p)}
            />
          )}
        </div>
      </LayoutWrapper>
    </>
  )
}

export default ImportExportData
