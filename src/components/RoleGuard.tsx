import React from 'react'
import { Navigate } from 'react-router-dom'
import Unauthorized from '../pages/Unauthorized'
import { useAuthStore } from '../store/authStore'

interface RoleGuardProps {
  allowedRoles: Array<'student' | 'teacher' | 'director' | 'ministry'>
  children: React.ReactNode
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { role, isAuthenticated } = useAuthStore()

  // if not logged in at all, send to login
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />
  }

  // if logged in but no matching role, show 403
  if (!allowedRoles.includes(role)) {
    return <Unauthorized />
  }

  // otherwise render the protected page
  return <>{children}</>
}

export default RoleGuard
