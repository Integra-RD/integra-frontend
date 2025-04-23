import { JSX } from 'react'
import {
  UsersIcon,
  BuildingLibraryIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
  AcademicCapIcon,
  CircleStackIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

import type { Location } from 'react-router-dom'

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
          active: location.pathname === '/director/members',
          onClick: () => navigate('/director/members')
        },
        {
          label: 'Gestión de Centro Educativo',
          icon: <BuildingLibraryIcon className="w-5 h-5" />,
          active: location.pathname === '/director/institution',
          onClick: () => navigate('/director/institution')
        },
        {
          label: 'Reportes',
          icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
          active: location.pathname === '/director/reports',
          onClick: () => navigate('/director/reports')
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
        }
      ]

    default:
      return []
  }
}
