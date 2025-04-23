import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import LayoutWrapper from '../../components/LayoutWrapper'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// TODO: Wire Updates and Deletes once it's fully setup.
interface AuditEntry {
  id_actividad: string
  fecha_actividad: string
  descripcion_actividad: string
  user: number
}

interface AuditResponse {
  count: number
  next: string | null
  previous: string | null
  results: AuditEntry[]
}

interface Role {
  nombre_rol: string
  id_rol: number
}
interface UserDetail {
  id: number
  first_name: string
  last_name: string
  username: string
  roles: Role[]
}

const iconByType = {
  create: {
    icon: <PencilIcon className="w-5 h-5 text-white" />,
    color: 'bg-blue-500',
    border: 'border-blue-500'
  },
  update: {
    icon: <PencilIcon className="w-5 h-5 text-white" />,
    color: 'bg-yellow-500',
    border: 'border-yellow-500'
  },
  delete: {
    icon: <TrashIcon className="w-5 h-5 text-white" />,
    color: 'bg-red-500',
    border: 'border-red-500'
  },
  download: {
    icon: <ArrowDownTrayIcon className="w-5 h-5 text-white" />,
    color: 'bg-emerald-500',
    border: 'border-emerald-500'
  },
  approve: {
    icon: <CheckCircleIcon className="w-5 h-5 text-white" />,
    color: 'bg-green-600',
    border: 'border-green-600'
  },
  reject: {
    icon: <XMarkIcon className="w-5 h-5 text-white" />,
    color: 'bg-red-600',
    border: 'border-red-600'
  }
}

const AuditLog: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole('ministry', location, navigate)

  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [userMap, setUserMap] = useState<Record<number, string>>({})
  const [roleMap, setRoleMap] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [roleFilter, setRoleFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get<AuditResponse>('/activity-audit/user/all/', {
          params: { activities: 100, offset: 0 }
        })
        setLogs(data.results)

        const ids = Array.from(new Set(data.results.map(e => e.user)))
        const profiles = await Promise.all(
          ids.map(id => api.get<UserDetail>(`/auth/users/detail/${id}/`))
        )
        const umap: Record<number, string> = {}
        const rmap: Record<number, string> = {}
        profiles.forEach(r => {
          const u = r.data
          umap[u.id] = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username
          rmap[u.id] = u.roles.map(r => r.nombre_rol).join(', ')
        })
        setUserMap(umap)
        setRoleMap(rmap)
      } catch {
        toast.error('No se pudo cargar registros de auditoría')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const parseAccountFlow = (desc: string) => {
    const m = desc.match(
      /(solicit[oa]|ha aprobado|ha denegado)[\s\S]*?una cuenta(?:[\s\S]*?)como\s+(.+)$/i
    )
    if (!m) return null
    return { action: m[1].toLowerCase(), role: m[2].trim() }
  }

  const extractAccountName = (desc: string) => {
    const m = desc.match(/(ha aprobado|ha denegado) una solicitud de cuenta\.\s*(.+)?$/i)
    return m && m[2] ? m[2].trim() : null
  }

  const getTypeKey = (desc: string): keyof typeof iconByType => {
    const d = desc.toLowerCase()
    if (d.includes('ha aprobado una solicitud')) return 'approve'
    if (d.includes('ha denegado una solicitud')) return 'reject'
    if (d.includes('descarg')) return 'download'
    if (d.includes('borr')) return 'delete'
    if (d.includes('actualiz')) return 'update'
    return 'create' // also catches 'solicitó una cuenta'
  }

  const filtered = logs.filter(entry => {
    const roleName = roleMap[entry.user] || ''
    const typeKey = getTypeKey(entry.descripcion_actividad)
    if (roleFilter !== 'Todos' && roleName !== roleFilter) return false
    if (typeFilter !== 'Todos' && typeFilter !== typeKey) return false
    return true
  })

  return (
    <>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar />
      <LayoutWrapper
        title="Auditorías"
        subtitle="Visualiza toda la actividad realizada por los usuarios dentro del sistema."
        navItems={navItems}
        headerRightSection={
          <div className="flex gap-4 items-center text-sm">
            <label className="flex gap-1 font-bold items-center">
              Filtrar Usuario
              <select
                className="ml-1 border rounded-md px-2 py-1 text-sm text-[#29638A]"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Administrador de la Plataforma</option>
                <option>Administrador del Sistema (MINERD)</option>
                <option>Administrador de Centro Educativo</option>
                <option>Docente</option>
                <option>Estudiante</option>
              </select>
            </label>
            <label className="flex gap-1 font-bold items-center">
              Filtrar Actividad
              <select
                className="ml-1 border rounded-md px-2 py-1 text-sm text-[#29638A]"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option>Todos</option>
                <option value="create">Creaciones</option>
                <option value="update">Actualizaciones</option>
                <option value="delete">Eliminaciones</option>
                <option value="download">Descargas</option>
                <option value="approve">Aprobaciones</option>
                <option value="reject">Denegaciones</option>
              </select>
            </label>
          </div>
        }
      >
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-gray-500">Cargando…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No hay actividades para los filtros seleccionados.
            </div>
          ) : (
            filtered.map(entry => {
              const text = entry.descripcion_actividad.trim()
              const typeKey = getTypeKey(text)
              const activity = iconByType[typeKey]
              const name = userMap[entry.user] || `Usuario ${entry.user}`
              const initials = name
                .split(' ')
                .map(w => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
              const desc = text.startsWith(name) ? text.slice(name.length).trim() : text
              const parsed = parseAccountFlow(desc)
              const extra = extractAccountName(text)

              return (
                <div
                  key={entry.id_actividad}
                  className={`bg-[#f1f5f9] flex flex-col gap-2 p-4 rounded-xl shadow-sm border-l-4 ${activity.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-800">
                        {initials}
                      </div>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">{name}</span> {desc}
                        {extra && (typeKey === 'approve' || typeKey === 'reject') && ` ${extra}`}
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}
                    >
                      {activity.icon}
                    </div>
                  </div>

                  {(typeKey === 'create' || typeKey === 'approve' || typeKey === 'reject') &&
                    parsed && (
                      <p className="ml-[3.2rem] text-xs text-gray-600">
                        <span className="font-semibold">
                          {typeKey === 'create'
                            ? 'Solicitud de cuenta'
                            : typeKey === 'approve'
                              ? 'Cuenta aprobada para'
                              : 'Cuenta denegada para'}
                          :
                        </span>{' '}
                        {parsed.role}
                      </p>
                    )}

                  <p className="ml-[3.2rem] text-xs text-gray-400">
                    {new Date(entry.fecha_actividad).toLocaleString()}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </LayoutWrapper>
    </>
  )
}

export default AuditLog
