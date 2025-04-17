import { JSX } from 'react'
import {
  UsersIcon,
  BuildingLibraryIcon,
  DocumentMagnifyingGlassIcon,
  MegaphoneIcon,
  HomeIcon,
  AcademicCapIcon,
  CircleStackIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

import type { Location } from 'react-router-dom'

// TODO: Feed this role from a global state or context
type UserRole = 'ministry' | 'director' | 'teacher' | 'student'

interface NavItem {
  label: string
  icon: JSX.Element
  active: boolean
  onClick: () => void
}

export const getNavItemsByRole = (
  role: UserRole,
  location: Location,
  navigate: (path: string) => void
): NavItem[] => {
  switch (role) {
    case 'director':
      return [
        {
          label: 'Gestión de Personas',
          icon: <UsersIcon className="w-5 h-5" />,
          active: location.pathname === '/director/personas',
          onClick: () => navigate('/director/personas')
        },
        {
          label: 'Gestión de Centro Educativo',
          icon: <BuildingLibraryIcon className="w-5 h-5" />,
          active: location.pathname === '/director/centro',
          onClick: () => navigate('/director/centro')
        },
        {
          label: 'Reportes',
          icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
          active: location.pathname === '/director/reportes',
          onClick: () => navigate('/director/reportes')
        },
        {
          label: 'Comunicaciones',
          icon: <MegaphoneIcon className="w-5 h-5" />,
          active: location.pathname === '/director/mensajes',
          onClick: () => navigate('/director/mensajes')
        }
      ]

    case 'ministry':
      return [
        {
          label: 'Inicio',
          icon: <HomeIcon className="w-5 h-5" />,
          active: location.pathname === '/ministry/home',
          onClick: () => navigate('/ministry/home')
        },
        {
          label: 'Becas y Programas',
          icon: <AcademicCapIcon className="w-5 h-5" />,
          active: location.pathname === '/ministry/scholarships',
          onClick: () => navigate('/ministry/scholarships')
        },
        {
          label: 'I/O de Datos',
          icon: <CircleStackIcon className="w-5 h-5" />,
          active: location.pathname === '/ministry/data',
          onClick: () => navigate('/ministry/data')
        },
        {
          label: 'Auditorías',
          icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
          active: location.pathname === '/ministry/audits',
          onClick: () => navigate('/ministry/audits')
        },
        {
          label: 'Comunicaciones',
          icon: <MegaphoneIcon className="w-5 h-5" />,
          active: location.pathname === '/ministry/messaging',
          onClick: () => navigate('/ministry/messaging')
        }
      ]

    case 'student':
      return [
        {
          label: 'Historial',
          icon: <ClockIcon className="w-5 h-5" />,
          active: location.pathname === '/student/grade-history',
          onClick: () => navigate('/student/grade-history')
        },
        {
          label: 'Promedios',
          icon: <ChartBarIcon className="w-5 h-5" />,
          active: location.pathname === '/student/grade-average',
          onClick: () => navigate('/student/grade-average')
        },
        {
          label: 'Rankings',
          icon: <TrophyIcon className="w-5 h-5" />,
          active: location.pathname === '/student/rankings',
          onClick: () => navigate('/student/rankings')
        }
      ]

    case 'teacher':
      return [
        {
          label: 'Reportes',
          icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
          active: location.pathname === '/teacher/reports',
          onClick: () => navigate('/teacher/reports')
        },
        {
          label: 'Comunicaciones',
          icon: <MegaphoneIcon className="w-5 h-5" />,
          active: location.pathname === '/teacher/messaging',
          onClick: () => navigate('/teacher/messaging')
        }
      ]

    default:
      return []
  }
}
