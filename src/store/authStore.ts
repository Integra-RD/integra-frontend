import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'superadmin' | 'student' | 'teacher' | 'director' | 'ministry' | null

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: Role
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  setRole: (role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),
      setRole: role => set({ role }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, role: null, isAuthenticated: false })
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
