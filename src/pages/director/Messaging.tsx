import { useLocation, useNavigate } from 'react-router-dom'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import LayoutWrapper from '../../components/LayoutWrapper'
import MessagingLayout from '../../components/MessagingLayout'
import type { Message } from '../../components/MessageInbox'

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

  const navItems = getNavItemsByRole('director', location, navigate)

  return (
    <LayoutWrapper title="Comunicaciones Internas" user={user} navItems={navItems}>
      <MessagingLayout senderRole="Director" initialMessages={mockMessages} />
    </LayoutWrapper>
  )
}

export default DirectorMessagingPage
