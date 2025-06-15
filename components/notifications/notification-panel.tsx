"use client"

import { useState, useEffect } from 'react'
import { X, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: Date
  read: boolean
}

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: '1',
        title: '点検期限切れ',
        message: 'CNCフライス盤 #3の日常点検が2時間超過しています',
        type: 'error',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false
      },
      {
        id: '2',
        title: '温度警告',
        message: '油圧システムの温度が上限に近づいています',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false
      },
      {
        id: '3',
        title: '点検完了',
        message: 'プレス機 #2の朝の点検が正常に完了しました',
        type: 'success',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true
      }
    ])
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-danger" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />
      default:
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-soft-lg z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">通知</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            通知がありません
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-accent transition-colors cursor-pointer",
                  !notification.read && "bg-primary/5"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" size="sm">
          すべての通知を表示
        </Button>
      </div>
    </div>
  )
}