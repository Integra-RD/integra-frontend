import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import MessagingLayout from '../../components/MessagingLayout'
import type { Message } from '../../components/MessageInbox'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'

const mockMessages: Message[] = [
  {
    id: '1',
    title: 'Recordatorio de entrega',
    content: 'Recuerda subir las calificaciones antes del viernes.',
    timestamp: '2025-04-15 14:30',
    isRead: false,
    sender: 'Dirección Académica',
    type: 'recibido'
  },
  {
    id: '2',
    title: 'Mensaje a estudiantes',
    content: 'No olviden repasar el tema 5 para la próxima clase.',
    timestamp: '2025-04-12 10:15',
    isRead: true,
    sender: 'Tú',
    type: 'enviado'
  }
]

const TeacherMessagingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = getNavItemsByRole('teacher', location, navigate)

  return (
    <LayoutWrapper title="Comunicaciones Internas" navItems={navItems}>
      <MessagingLayout senderRole="Docente" initialMessages={mockMessages} />
    </LayoutWrapper>
  )
}

export default TeacherMessagingPage
