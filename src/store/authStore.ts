import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'superadmin' | 'student' | 'teacher' | 'director' | 'ministry' | null

export interface UserInfo {
  id: string
  name: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: Role
  userId: string | null
  userProfile: UserInfo | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  setRole: (role: Role) => void
  setUserId: (id: string) => void
  setUserProfile: (profile: UserInfo) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      userId: null,
      userProfile: null,
      isAuthenticated: false,
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),
      setRole: role => set({ role }),
      setUserId: id => set({ userId: id }),
      setUserProfile: profile => set({ userProfile: profile }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
          userId: null,
          userProfile: null,
          isAuthenticated: false
        })
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        role: state.role,
        userId: state.userId,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
