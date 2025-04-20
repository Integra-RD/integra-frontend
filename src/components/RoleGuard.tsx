import React from 'react'
import { Navigate } from 'react-router-dom'
import Unauthorized from '../pages/Unauthorized'
import { useAuthStore, Role } from '../store/authStore'

interface RoleGuardProps {
  allowedRoles: Exclude<Role, 'superadmin' | null>[]
  children: React.ReactNode
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />
  }

  if (role === 'superadmin') {
    return <>{children}</>
  }

  if (!allowedRoles.includes(role)) {
    return <Unauthorized />
  }

  return <>{children}</>
}

export default RoleGuard
