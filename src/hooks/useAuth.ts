import api from '../services/api'
import { useAuthStore } from '../store/authStore'

// exact DB values (lowercased + trimmed)
type BackendRole =
  | 'administrador de la plataforma'
  | 'administrador del sistema (minerd)'
  | 'estudiante'
  | 'docente'
  | 'administrador de centro educativo'

export type FrontendRole = 'superadmin' | 'ministry' | 'student' | 'teacher' | 'director'

const roleMap: Record<BackendRole, FrontendRole> = {
  'administrador de la plataforma': 'superadmin',
  'administrador del sistema (minerd)': 'ministry',
  estudiante: 'student',
  docente: 'teacher',
  'administrador de centro educativo': 'director'
}

export const useAuth = () => {
  const { setTokens, setRole, logout, setUserId, setUserProfile } = useAuthStore()

  const login = async (usernameOrEmail: string, password: string): Promise<FrontendRole> => {
    const payload: Record<string, string> = { password }

    if (usernameOrEmail.includes('@')) {
      payload.email = usernameOrEmail
    } else {
      payload.username = usernameOrEmail
    }

    const res = await api.post('/auth/login/', payload)
    const { access, refresh, roles, user_id } = res.data

    const raw = roles?.[0]?.nombre_rol?.toLowerCase().trim() as BackendRole | undefined
    const frontendRole = raw ? roleMap[raw] : undefined

    // Store tokens + user ID
    setTokens(access, refresh)
    setUserId(user_id.toString())

    if (!frontendRole) {
      setRole(null)
      logout()
      throw new Error(`Unrecognized role: ${roles?.[0]?.nombre_rol}`)
    }

    setRole(frontendRole)

    const profileRes = await api.get(`/auth/users/detail/${user_id}/`)
    const profile = profileRes.data

    const fullName =
      `${profile.first_name} ${profile.last_name}`.trim() ||
      profile.username ||
      `Usuario #${profile.id}`

    setUserProfile({
      id: profile.id.toString(),
      name: fullName
    })

    return frontendRole
  }

  return { login, logout }
}
