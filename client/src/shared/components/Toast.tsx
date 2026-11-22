import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

export default function Toast() {
  const { message, visible, hideNotification } = useNotificationStore()

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(hideNotification, 3000)
    return () => clearTimeout(timer)
  }, [visible, hideNotification])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3 max-w-xs">
      <span>{message}</span>
      <button onClick={hideNotification} className="ml-auto text-gray-400 hover:text-white transition">
        ✕
      </button>
    </div>
  )
}
