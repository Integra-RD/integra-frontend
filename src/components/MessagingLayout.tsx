import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import MessageComposer from './MessageComposer'
import MessageInbox, { Message } from './MessageInbox'

type Role = 'Ministry' | 'Director' | 'Docente'

interface MessagingLayoutProps {
  senderRole: Role
  initialMessages: Message[]
}

const MessagingLayout: React.FC<MessagingLayoutProps> = ({ senderRole, initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [composerOpen, setComposerOpen] = useState(true)

  const handleSendMessage = ({
    title,
    content
  }: {
    title: string
    content: string
    recipientType: string
    roles?: string[]
    name?: string
  }) => {
    const timestamp = new Date().toLocaleString('es-DO')
    const newMessage: Message = {
      id: crypto.randomUUID(),
      title,
      content,
      timestamp,
      isRead: true,
      sender: 'Tú',
      type: 'enviado'
    }

    setMessages(prev => [newMessage, ...prev])
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg border overflow-hidden">
        <div
          className="bg-[#D3E4F6] p-4 flex justify-between items-center border-b cursor-pointer hover:bg-[#b7dcfd] transition"
          onClick={() => setComposerOpen(prev => !prev)}
        >
          <h2 className="text-lg font-semibold text-slate-800">Comunicaciones</h2>
          {composerOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-slate-500" />
          )}
        </div>

        {composerOpen && (
          <div className="p-4 bg-[#f1f5f9]">
            <MessageComposer senderRole={senderRole} onSend={handleSendMessage} />
          </div>
        )}
      </div>

      {/* Inbox */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-2">Bandeja de Entrada</h3>
        <MessageInbox messages={messages} />
      </div>
    </div>
  )
}

export default MessagingLayout
