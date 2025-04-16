import React, { useEffect, useState } from 'react'
import {
  PaperAirplaneIcon,
  UserIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

type Role = 'Ministry' | 'Director' | 'Docente' | 'Estudiante'
type RecipientType = 'persona' | 'rol' | 'global'

interface MessageComposerProps {
  senderRole: Role
  onSend?: (payload: {
    title: string
    content: string
    recipientType: RecipientType
    roles?: string[]
    name?: string
    attachment?: File
  }) => void
}

const roleMessagingMap: Record<Role, { persona: string[]; rol: string[]; global: boolean }> = {
  Ministry: {
    persona: ['Administrador', 'Director', 'Docente', 'Estudiante'],
    rol: ['Administrador', 'Director', 'Docente', 'Estudiante'],
    global: true
  },
  Director: {
    persona: ['MINERD', 'Docente', 'Estudiante'],
    rol: ['Docente', 'Estudiante'],
    global: true
  },
  Docente: {
    persona: ['Director', 'Estudiante'],
    rol: ['Estudiante'],
    global: false
  },
  Estudiante: {
    persona: [],
    rol: [],
    global: false
  }
}

const MessageComposer: React.FC<MessageComposerProps> = ({ senderRole, onSend }) => {
  const [recipientType, setRecipientType] = useState<RecipientType>('persona')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [roleInput, setRoleInput] = useState('')

  const personaRoles = roleMessagingMap[senderRole].persona
  const rolTargets = roleMessagingMap[senderRole].rol
  const canSendGlobal = roleMessagingMap[senderRole].global
  const canSend = senderRole !== 'Estudiante'

  useEffect(() => {
    if (recipientType === 'persona') {
      setSelectedRoles([])
    }
    if (recipientType === 'rol' && selectedRoles.length === 0 && rolTargets.length > 0) {
      setSelectedRoles([rolTargets[0]])
    }
  }, [recipientType, senderRole])

  const toggleRole = (newRole: string) => {
    if (selectedRoles.includes(newRole)) return
    setSelectedRoles(prev => [...prev, newRole])
  }

  const removeRole = (target: string) => {
    setSelectedRoles(prev => prev.filter(r => r !== target))
  }

  const handleSend = () => {
    if (!title || !content) return

    onSend?.({
      title,
      content,
      recipientType,
      roles: recipientType === 'rol' || recipientType === 'global' ? selectedRoles : undefined,
      name: recipientType === 'persona' ? name : undefined,
      attachment: attachment ?? undefined
    })

    setTitle('')
    setContent('')
    setAttachment(null)
    setName('')
    setSelectedRoles([])
  }

  const clearForm = () => {
    setTitle('')
    setContent('')
    setAttachment(null)
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow border overflow-hidden">
      <aside className="w-full lg:w-1/3 border-r p-4 bg-slate-50">
        <div className="flex gap-2 mb-4">
          {(['persona', 'rol', 'global'] as RecipientType[])
            .filter(type => type !== 'global' || canSendGlobal)
            .map(type => {
              const icons = {
                persona: <UserIcon className="w-4 h-4" />,
                rol: <UserGroupIcon className="w-4 h-4" />,
                global: <UsersIcon className="w-4 h-4" />
              }

              return (
                <button
                  key={type}
                  onClick={() => setRecipientType(type)}
                  className={`flex-1 px-2 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition ${
                    recipientType === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-gray-600 border'
                  }`}
                >
                  {icons[type]}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )
            })}
        </div>

        {recipientType === 'persona' && (
          <>
            <label className="block text-sm text-gray-600 mb-1">Rol</label>
            <select
              value={selectedRoles[0] || ''}
              onChange={e => setSelectedRoles([e.target.value])}
              className="w-full mb-4 border rounded-md px-3 py-2 text-sm"
            >
              {personaRoles.map(role => (
                <option key={role}>{role}</option>
              ))}
            </select>

            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: María Gómez"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </>
        )}

        {recipientType === 'rol' && (
          <>
            <label className="block text-sm text-gray-600 mb-1">Seleccionar roles destino:</label>
            <select
              value={roleInput}
              onChange={e => {
                setRoleInput('')
                toggleRole(e.target.value)
              }}
              className="w-full border rounded-md px-3 py-2 text-sm mb-3"
            >
              <option value="" disabled>
                Seleccionar...
              </option>
              {rolTargets
                .filter(role => !selectedRoles.includes(role))
                .map(role => (
                  <option key={role}>{role}</option>
                ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {selectedRoles.map(r => (
                <span
                  key={r}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                >
                  {r}
                  <XMarkIcon
                    onClick={() => removeRole(r)}
                    className="w-4 h-4 cursor-pointer hover:text-red-500"
                  />
                </span>
              ))}
            </div>
          </>
        )}

        {recipientType === 'global' && (
          <p className="text-sm text-gray-700 font-medium mt-2">
            El comunicado será enviado a todos los usuarios con el rol de:{' '}
            <span className="text-blue-700">{rolTargets.join(', ') || 'Ninguno'}</span>.
          </p>
        )}

        {senderRole === 'Estudiante' && (
          <p className="text-sm text-red-500 font-medium mt-4">
            Los estudiantes no pueden enviar mensajes
          </p>
        )}
      </aside>

      <main className="w-full lg:w-2/3 p-6 bg-slate-100">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Enviar Comunicado</h2>
          <p className="text-sm text-gray-500">
            Comparta información importante con sus estudiantes y docentes
          </p>
        </div>

        <div className="space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título del comunicado"
            className="w-full px-4 py-2 border rounded-md text-sm"
            disabled={!canSend}
          />

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            placeholder="Escriba aquí el contenido de su comunicado..."
            className="w-full px-4 py-2 border rounded-md text-sm"
            disabled={!canSend}
          />

          <div className="text-sm text-gray-600">
            Fecha de publicación: {new Date().toLocaleDateString('es-DO')}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={clearForm}
              disabled={!canSend}
              className="px-4 py-2 border rounded-md text-sm transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="px-4 py-2 bg-[#D3E4F6] text-black rounded-md text-sm flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              Enviar Comunicado
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MessageComposer
