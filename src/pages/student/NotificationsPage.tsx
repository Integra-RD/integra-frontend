import { useLocation, useNavigate } from 'react-router-dom'
import LayoutWrapper from '../../components/LayoutWrapper'
import NotificationCard, { Notification } from '../../components/NotificationCard'

// TODO: Add logic to handle mark as read/unread, icons for type of notif, proper date extraction
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nuevo mensaje de tu profesor',
    message: 'Tu profesor de Matemáticas te ha enviado un nuevo mensaje.',
    timestamp: 'Hace 5 min',
    isRead: false,
    category: 'message'
  },
  {
    id: '2',
    title: 'Alerta de seguridad',
    message: 'Se ha detectado una actividad inusual en tu cuenta.',
    timestamp: 'Hoy, 08:12',
    isRead: false,
    isUrgent: true,
    category: 'alert'
  },
  {
    id: '3',
    title: 'Actualización académica',
    message: 'Tu promedio del 2do semestre ha sido actualizado.',
    timestamp: 'Ayer, 19:45',
    isRead: true,
    category: 'academic'
  }
]

const NotificationsPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      label: 'Historial',
      icon: <></>,
      active: location.pathname === '/grade-history',
      onClick: () => navigate('/grade-history')
    },
    {
      label: 'Promedios',
      icon: <></>,
      active: location.pathname === '/grade-average',
      onClick: () => navigate('/grade-average')
    },
    {
      label: 'Rankings',
      icon: <></>,
      active: location.pathname === '/rankings',
      onClick: () => navigate('/rankings')
    }
  ]

  const user = { name: 'Juan Pérez', id: '0034' }

  return (
    <LayoutWrapper navItems={navItems} user={user} title="Notificaciones">
      <div className="space-y-4">
        {mockNotifications.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </LayoutWrapper>
  )
}

export default NotificationsPage
