'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  BookmarkCheck as MarkAsRead,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications([
      {
        id: 'notif-001',
        title: '緊急: 設備故障',
        message:
          'CNCフライス盤 #3で冷却液ポンプの異音が発生しています。すぐに点検が必要です。',
        type: 'error',
        timestamp: '2024-12-30T11:45:00',
        isRead: false,
        priority: 'high',
      },
      {
        id: 'notif-002',
        title: '保守期限間近',
        message:
          'プレス機 #7の定期保守が明日期限です。作業の準備をお願いします。',
        type: 'warning',
        timestamp: '2024-12-30T09:30:00',
        isRead: false,
        priority: 'medium',
      },
      {
        id: 'notif-003',
        title: '作業完了',
        message:
          'コンベア #2のベルト交換作業が完了しました。動作確認も実施済みです。',
        type: 'success',
        timestamp: '2024-12-29T16:20:00',
        isRead: true,
        priority: 'low',
      },
      {
        id: 'notif-004',
        title: '新規作業指示',
        message:
          '溶接機 #5の電源ケーブル点検が割り当てられました。優先度は中程度です。',
        type: 'info',
        timestamp: '2024-12-29T14:15:00',
        isRead: false,
        priority: 'medium',
      },
      {
        id: 'notif-005',
        title: 'システム更新',
        message:
          'SkillMaintシステムがv2.1.0にアップデートされました。新機能をご確認ください。',
        type: 'info',
        timestamp: '2024-12-29T08:00:00',
        isRead: true,
        priority: 'low',
      },
      {
        id: 'notif-006',
        title: '資格期限警告',
        message:
          '田中太郎さんの第二種電気工事士資格が3月20日に期限切れとなります。',
        type: 'warning',
        timestamp: '2024-12-28T10:30:00',
        isRead: false,
        priority: 'medium',
      },
      {
        id: 'notif-007',
        title: '設備追加',
        message: '新しいCNCフライス盤 #8が第1工場A棟に設置されました。',
        type: 'info',
        timestamp: '2024-12-28T08:15:00',
        isRead: true,
        priority: 'low',
      },
      {
        id: 'notif-008',
        title: '緊急停止',
        message: 'プレス機 #3で安全装置が作動しました。緊急点検が必要です。',
        type: 'error',
        timestamp: '2024-12-27T15:45:00',
        isRead: false,
        priority: 'high',
      },
      {
        id: 'notif-009',
        title: '保守完了',
        message:
          '油圧ポンプ #2の定期保守が完了しました。次回は2025年3月予定です。',
        type: 'success',
        timestamp: '2024-12-27T13:20:00',
        isRead: true,
        priority: 'low',
      },
      {
        id: 'notif-010',
        title: 'スキル認定',
        message: '佐藤花子さんがPLC上級レベルの認定を取得しました。',
        type: 'success',
        timestamp: '2024-12-27T11:00:00',
        isRead: false,
        priority: 'low',
      },
      {
        id: 'notif-011',
        title: '部品在庫不足',
        message:
          'ベルト交換用部品の在庫が少なくなっています。発注をお願いします。',
        type: 'warning',
        timestamp: '2024-12-26T16:30:00',
        isRead: false,
        priority: 'medium',
      },
      {
        id: 'notif-012',
        title: '作業時間超過',
        message: 'CNCフライス盤 #1の保守作業が予定時間を超過しています。',
        type: 'warning',
        timestamp: '2024-12-26T14:45:00',
        isRead: true,
        priority: 'medium',
      },
    ]);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'success':
        return 'border-l-emerald-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* モバイル・タブレット用オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* 通知パネル */}
      <div className="fixed inset-x-4 top-20 bottom-4 z-[60] lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:mt-2 lg:w-96">
        <Card className="h-full lg:h-auto lg:max-h-[600px] bg-white/95 backdrop-blur-xl shadow-xl border border-gray-200/50 flex flex-col rounded-2xl">
          {/* ヘッダー（固定） */}
          <CardHeader className="flex-shrink-0 border-b border-gray-200/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-700" />
                <CardTitle className="text-lg font-bold text-gray-900">
                  通知
                </CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-semibold">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* アクションボタン */}
            {notifications.length > 0 && (
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex-1 h-9 text-xs font-semibold border-gray-300 hover:bg-gray-50 rounded-xl"
                >
                  <MarkAsRead className="h-3 w-3 mr-1" />
                  すべて既読
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="flex-1 h-9 text-xs font-semibold border-gray-300 hover:bg-gray-50 rounded-xl"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  すべて削除
                </Button>
              </div>
            )}
          </CardHeader>

          {/* コンテンツ（スクロール可能） */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-48">
                <Bell className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-medium">
                  通知はありません
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full custom-scrollbar">
                <div className="divide-y divide-gray-100/50">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50/50 transition-colors border-l-4 ${getNotificationBorderColor(notification.type)} ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4
                                className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}
                              >
                                {notification.title}
                              </h4>
                              {notification.priority !== 'low' && (
                                <Badge
                                  className={`text-xs flex-shrink-0 font-semibold ${getPriorityBadgeColor(notification.priority)}`}
                                >
                                  {notification.priority === 'high'
                                    ? '高'
                                    : '中'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1 flex-shrink-0 ml-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0 hover:bg-gray-200/80 rounded-lg"
                              title="既読にする"
                            >
                              <MarkAsRead className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="削除"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 leading-relaxed font-medium">
                        {notification.message}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>
                          {new Date(notification.timestamp).toLocaleString(
                            'ja-JP',
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
