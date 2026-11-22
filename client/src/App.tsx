import { useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useThemeStore } from '@/store/themeStore'
import AppRouter from '@/routes/AppRouter'
import Toast from '@/shared/components/Toast'

export default function App() {
  const { checkAuth } = useAuth()
  const { darkMode } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}
