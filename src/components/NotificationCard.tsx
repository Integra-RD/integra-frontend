import { BellIcon } from '@heroicons/react/24/outline'
import { cn } from '../utils/cn'

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  isRead?: boolean
  isUrgent?: boolean
  category?: 'general' | 'academic' | 'alert' | 'message'
  actions?: {
    label: string
    onClick: () => void
  }[]
}

const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
  return (
    <div
      className={cn(
        'relative bg-[#f1f5f9] rounded-xl px-4 py-4 border-l-4 shadow-sm transition-all',
        notification.isUrgent
          ? 'border-red-500'
          : notification.category === 'academic'
            ? 'border-blue-500'
            : notification.category === 'message'
              ? 'border-emerald-500'
              : 'border-gray-300'
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="flex items-center justify-center h-full">
            <BellIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

            {notification.actions && (
              <div className="mt-3 flex flex-wrap gap-2">
                {notification.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap ml-4 mt-1">
          {notification.timestamp}
        </div>
      </div>

      {!notification.isRead && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
      )}
    </div>
  )
}

export default NotificationCard
