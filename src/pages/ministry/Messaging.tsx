import { useLocation, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  AcademicCapIcon,
  CircleStackIcon,
  DocumentMagnifyingGlassIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'

import LayoutWrapper from '../../components/LayoutWrapper'
import MessagingLayout from '../../components/MessagingLayout'
import type { Message } from '../../components/MessageInbox'

const mockMessages: Message[] = [
  {
    id: '1',
    title: 'Recordatorio de reunión',
    content: 'La reunión será el viernes a las 10:00 AM.',
    timestamp: '2025-04-16 09:00',
    isRead: false,
    sender: 'Dirección Nacional',
    type: 'recibido'
  }
]

const MinistryMessagingPage = () => {
  const user = { name: 'Juan Pérez', id: '0034' }
  const location = useLocation()
  const navigate = useNavigate()

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
    <LayoutWrapper title="Comunicaciones Internas" user={user} navItems={navItems}>
      <MessagingLayout senderRole="Ministry" initialMessages={mockMessages} />
    </LayoutWrapper>
  )
}

export default MinistryMessagingPage
