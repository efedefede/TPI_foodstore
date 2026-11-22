import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const checking = useAuthStore((s) => s.checking)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const isAdmin = user?.role === 'admin'
  return { user, checking, login, logout, checkAuth, isAdmin }
}
