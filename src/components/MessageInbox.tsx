import React, { useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { cn } from '../utils/cn'

export interface Message {
  id: string
  title: string
  content: string
  timestamp: string
  isRead: boolean
  sender: string
  type: 'recibido' | 'enviado'
}

interface MessageInboxProps {
  messages: Message[]
}

const filters = ['recibido', 'enviado', 'leído', 'no leído'] as const
type Filter = (typeof filters)[number]

const MessageInbox: React.FC<MessageInboxProps> = ({ messages }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('recibido')

  const filteredMessages = messages.filter(message => {
    if (activeFilter === 'leído') return message.isRead
    if (activeFilter === 'no leído') return !message.isRead
    return message.type === activeFilter
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2 justify-start">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'text-sm px-4 py-1.5 rounded-full border transition',
              activeFilter === filter
                ? 'bg-[#005D85] text-white'
                : 'border-[#005D85] text-[#005D85] hover:bg-blue-50'
            )}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No hay mensajes para mostrar.</p>
        ) : (
          filteredMessages.map(msg => (
            <div
              key={msg.id}
              className={cn(
                'relative bg-[#f1f5f9] rounded-xl px-4 py-4 border-l-4 shadow-sm',
                msg.isRead ? 'border-gray-300' : 'border-blue-500'
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <BellIcon className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{msg.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {msg.type === 'recibido' ? 'Remitente' : 'Enviado a'}:{' '}
                      <span className="text-gray-500">{msg.sender}</span>
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap ml-4 mt-1">
                  {msg.timestamp}
                </div>
              </div>

              {!msg.isRead && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MessageInbox
