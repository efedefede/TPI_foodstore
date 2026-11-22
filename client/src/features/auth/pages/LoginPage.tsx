import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  async function handleLogin(email: string, password: string) {
    setErrorServidor(null)
    try {
      await login(email, password)
      navigate('/categorias', { replace: true })
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? 'Credenciales inválidas'
      setErrorServidor(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar sesión</h1>
        <LoginForm onSubmit={handleLogin} error={errorServidor} />
      </div>
    </div>
  )
}
