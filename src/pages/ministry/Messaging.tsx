import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import MessagingLayout from '../../components/MessagingLayout'
import type { Message } from '../../components/MessageInbox'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'

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
  const navItems = getNavItemsByRole('ministry', location, navigate)

  return (
    <LayoutWrapper title="Comunicaciones Internas" user={user} navItems={navItems}>
      <MessagingLayout senderRole="Ministry" initialMessages={mockMessages} />
    </LayoutWrapper>
  )
}

export default MinistryMessagingPage
