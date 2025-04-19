import api from '../services/api'
import { useAuthStore } from '../store/authStore'

type BackendRole = 'estudiante' | 'docente' | 'director' | 'minerd' | 'administrador del sistema'

export type FrontendRole = 'student' | 'teacher' | 'director' | 'ministry'

const roleMap: Record<BackendRole, FrontendRole> = {
  estudiante: 'student',
  docente: 'teacher',
  director: 'director',
  minerd: 'ministry',
  'administrador del sistema': 'ministry'
}

export const useAuth = () => {
  const { setTokens, setRole, logout } = useAuthStore()

  const login = async (usernameOrEmail: string, password: string): Promise<FrontendRole> => {
    // build payload with either username or email
    const payload: Record<string, string> = { password }
    if (usernameOrEmail.includes('@')) payload.email = usernameOrEmail
    else payload.username = usernameOrEmail

    const res = await api.post('/auth/login/', payload)
    const { access, refresh, roles } = res.data

    const raw = roles?.[0]?.nombre_rol?.toLowerCase() as BackendRole | undefined
    const frontendRole = raw ? roleMap[raw] : null

    setTokens(access, refresh)
    setRole(frontendRole)

    if (!frontendRole) throw new Error('No role assigned to this user')
    return frontendRole
  }

  return { login, logout }
}
