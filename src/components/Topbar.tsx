import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import integraLogo from '../assets/integraLogo.svg'

interface NavItem {
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
}

interface UserInfo {
  name: string
  id: string
}

interface TopbarProps {
  navItems: NavItem[]
  user: UserInfo
  onNotificationClick?: () => void
}

const Topbar: React.FC<TopbarProps> = ({ navItems, user, onNotificationClick }) => {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 pointer-events-none">
      <div className="pointer-events-auto">
        <img src={integraLogo} alt="Logo INTEGRA" className="h-10 w-auto" />
      </div>
      <div className="flex items-center space-x-6 ml-auto pointer-events-auto">
        {/* Nav Buttons */}
        <div className="flex items-center space-x-4 bg-[#f5faff]/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-white border border-[#1f4e79] text-[#1f4e79]'
                  : 'text-gray-800 hover:text-blue-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Notification + Profile */}
        <div className="flex items-center space-x-4 bg-[#f5faff]/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <button onClick={onNotificationClick} aria-label="Notificaciones">
            <BellIcon className="w-5 h-5 text-gray-700 hover:text-blue-600 transition" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#2c6e91] text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <div className="text-sm leading-tight">
              <div className="text-gray-900 font-medium">{user.name}</div>
              <div className="text-gray-500 text-xs">ID{user.id}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
