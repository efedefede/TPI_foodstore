import apiInstance from './api'

export default function setupInterceptors() {
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const url: string = error.config?.url ?? ''
      const status: number = error.response?.status

      if (
        status === 401 &&
        !url.includes('/auth/token') &&
        !url.includes('/auth/me')
      ) {
        const { useAuthStore } = await import('@/features/auth')
        useAuthStore.getState().clearUser()
        window.location.href = '/login'
      }

      if (status === 403) {
        const { useNotificationStore } = await import('@/store/notificationStore')
        useNotificationStore.getState().showNotification('Acceso denegado')
      }

      return Promise.reject(error)
    }
  )
}
