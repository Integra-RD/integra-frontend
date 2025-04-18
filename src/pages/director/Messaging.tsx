import { useLocation, useNavigate } from 'react-router-dom'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import LayoutWrapper from '../../components/LayoutWrapper'
import MessagingLayout from '../../components/MessagingLayout'
import type { Message } from '../../components/MessageInbox'
import { BuildingLibraryIcon, DocumentMagnifyingGlassIcon, MegaphoneIcon, UsersIcon } from '@heroicons/react/24/outline'

const mockMessages: Message[] = [
  {
    id: '1',
    title: 'Nuevo horario docente',
    content: 'El horario actualizado para los docentes ya está disponible.',
    timestamp: '2025-04-16 08:45',
    isRead: false,
    sender: 'Dirección Nacional',
    type: 'recibido'
  }
]

const DirectorMessagingPage = () => {
  const user = { name: 'Laura García', id: 'D123' }
  const location = useLocation()
  const navigate = useNavigate()

    const navItems = [
        {
          label: 'Gestión de Personas',
          icon: <UsersIcon className="w-5 h-5" />,
          active: location.pathname === '/director/members',
          onClick: () => navigate('/director/members')
        },
        {
          label: 'Gestión de Centro Educativo',
          icon: <BuildingLibraryIcon className="w-5 h-5" />,
          active: location.pathname === '/director/institution',
          onClick: () => navigate('/director/institution')
        },
        {
          label: 'Reportes',
          icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
          active: location.pathname === '/director/reports',
          onClick: () => navigate('/director/reports')
        },
        {
          label: 'Comunicaciones',
          icon: <MegaphoneIcon className="w-5 h-5" />,
          active: location.pathname === '/director/messaging',
          onClick: () => navigate('/director/messaging')
        }
      ]

  return (
    <LayoutWrapper title="Comunicaciones Internas" user={user} navItems={navItems}>
      <MessagingLayout senderRole="Director" initialMessages={mockMessages} />
    </LayoutWrapper>
  )
}

export default DirectorMessagingPage
