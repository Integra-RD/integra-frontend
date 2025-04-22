import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BellIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import integraLogo from '../assets/integraLogo.svg'
import { useAuthStore } from '../store/authStore'

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
}

const Topbar: React.FC<TopbarProps> = ({ navItems, user }) => {
  const navigate = useNavigate()
  const { logout: storeLogout } = useAuthStore()

  // initials for avatar
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    // clear tokens & auth state
    storeLogout()
    // navigate back to login
    navigate('/login', { replace: true })
  }

  return (
    <div className="sticky top-0 z-50 px-8 sm:px-16 lg:px-20 2xl:px-80 py-2 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <img src={integraLogo} alt="INTEGRA Logo" className="h-10 w-auto" />

        <div className="flex items-center space-x-4">
          {/* Nav items */}
          <div className="flex items-center space-x-4 bg-[#f5faff]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
            {navItems.map(({ label, icon, active, onClick }, idx) => (
              <button
                key={idx}
                onClick={onClick}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white border border-[#1f4e79] text-[#1f4e79]'
                    : 'text-gray-800 hover:text-blue-600'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* // TODO: Bell notif should redirect to correct page based on role  */}
          {/* User area */}
          <div className="flex items-center space-x-3 bg-[#f5faff]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
            {/* notifications */}
            <button
              onClick={() => navigate('/student/notifications')}
              aria-label="Notificaciones"
              className="hover:text-blue-600 transition"
            >
              <BellIcon className="w-5 h-5 text-gray-700" />
            </button>

            {/* avatar + name */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#2c6e91] text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
              <div className="text-sm leading-tight">
                <div className="text-gray-900 font-medium">{user.name}</div>
                <div className="text-gray-500 text-xs">ID: {user.id}</div>
              </div>
            </div>

            {/* logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 px-2 py-1 transition rounded hover:bg-red-50"
            >
              <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
