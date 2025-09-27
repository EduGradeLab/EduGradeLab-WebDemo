'use client'

import { useState } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification as Notification])

    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const showSuccess = (title: string, message: string) => {
    showNotification({ type: 'success', title, message })
  }

  const showError = (title: string, message: string) => {
    showNotification({ type: 'error', title, message })
  }

  const showInfo = (title: string, message: string) => {
    showNotification({ type: 'info', title, message })
  }

  const showWarning = (title: string, message: string) => {
    showNotification({ type: 'warning', title, message })
  }

  return {
    notifications,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

export const NotificationContainer = ({ notifications, onRemove }: {
  notifications: Notification[]
  onRemove: (id: string) => void
}) => {
  if (notifications.length === 0) return null

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
        >
          <div className="notification-icon">
            {getIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">
              {notification.title}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
          <button
            className="notification-close"
            onClick={() => onRemove(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}