import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'

import { PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'

const logs = [
  {
    userInitials: 'JP',
    userName: 'Juan Pérez',
    role: 'Administrador',
    action: 'Inició un proceso de auditoría',
    target: 'Colegio Feliz',
    timestamp: '04/06/2025',
    type: 'create'
  },
  {
    userInitials: 'MA',
    userName: 'María Alvarado',
    role: 'Docente',
    action: 'Descargó el informe de rendimiento',
    target: 'Escuela Central',
    timestamp: '15/07/2025',
    type: 'download'
  },
  {
    userInitials: 'RG',
    userName: 'Ricardo Gómez',
    role: 'Administrador',
    action: 'Eliminó datos del sistema',
    target: 'Edificio Norte',
    timestamp: '22/08/2025',
    type: 'delete'
  },
  {
    userInitials: 'LM',
    userName: 'Laura Martínez',
    role: 'Institución',
    action: 'Actualizó el registro',
    target: 'Colegio Nacional',
    timestamp: '01/09/2025',
    type: 'update'
  },
  {
    userInitials: 'AC',
    userName: 'Ana Córdova',
    role: 'Director',
    action: 'Descargó listado de beneficiarios',
    target: 'Región Sur',
    timestamp: '10/10/2025',
    type: 'download'
  },
  {
    userInitials: 'FP',
    userName: 'Fernando Pérez',
    role: 'Docente',
    action: 'Creó un nuevo registro',
    target: 'Instituto Técnico',
    timestamp: '15/11/2025',
    type: 'create'
  },
  {
    userInitials: 'ES',
    userName: 'Elena Sánchez',
    role: 'Director',
    action: 'Actualizó información de beneficiarios',
    target: 'Escuela Primaria',
    timestamp: '20/12/2025',
    type: 'update'
  },
  {
    userInitials: 'MG',
    userName: 'Mario García',
    role: 'Administrador',
    action: 'Eliminó un registro de auditoría',
    target: 'Colegio Secundario',
    timestamp: '25/01/2026',
    type: 'delete'
  }
]

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
  }
}

const AuditLog: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole('ministry', location, navigate)

  const [roleFilter, setRoleFilter] = useState('Todos')
  const [typeFilter, setTypeFilter] = useState('Todos')

  const filteredLogs = logs.filter(log => {
    const roleMatch = roleFilter === 'Todos' || log.role === roleFilter
    const typeMatch = typeFilter === 'Todos' || log.type === typeFilter
    return roleMatch && typeMatch
  })

  return (
    <LayoutWrapper
      title="Auditorías"
      subtitle="Visualiza toda la actividad realizada por los usuarios dentro del sistema."
      navItems={navItems}
      headerRightSection={
        <div className="flex gap-4 items-center text-sm">
          <label className="flex gap-1 font-bold items-center">
            Filtrar Usuario
            <select
              className="ml-1 border font-light rounded-md px-2 py-1 text-sm cursor-pointer text-[#29638A]"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option>Todos</option>
              <option>Administrador</option>
              <option>Director</option>
              <option>Docente</option>
              <option>Institución</option>
            </select>
          </label>

          <label className="flex gap-1 font-bold items-center">
            Filtrar Actividad
            <select
              className="ml-1 border font-light rounded-md px-2 py-1 text-sm cursor-pointer text-[#29638A]"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option>Todos</option>
              <option value="create">Creaciones</option>
              <option value="update">Actualizaciones</option>
              <option value="delete">Eliminaciones</option>
              <option value="download">Descargas</option>
            </select>
          </label>
        </div>
      }
    >
      <div className="space-y-4">
        {filteredLogs.map((log, index) => {
          const activity = iconByType[log.type as keyof typeof iconByType]

          return (
            <div
              key={index}
              className={`bg-[#f1f5f9] flex items-center justify-between p-4 rounded-xl shadow-sm border-l-4 ${activity.border}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold text-slate-800">
                  {log.userInitials}
                </div>
                <div>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">{log.userName}</span> {log.action}{' '}
                    <span className="font-semibold text-slate-800">{log.target}</span>
                  </p>
                  <p className="text-xs text-gray-400">{log.timestamp}</p>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}
              >
                {activity.icon}
              </div>
            </div>
          )
        })}
      </div>
    </LayoutWrapper>
  )
}

export default AuditLog
