import { useState, useCallback } from 'react'
import { ToastState } from '../types'

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString()
    const newToast: ToastState = {
      id,
      message,
      type,
      isVisible: true
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after 5 seconds
    setTimeout(() => {
      hideToast(id)
    }, 5000)

    return id
  }, [hideToast])

  const hideAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    hideToast,
    hideAllToasts
  }
} 