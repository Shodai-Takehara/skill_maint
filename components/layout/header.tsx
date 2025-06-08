'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationPanel } from '@/components/notifications/notification-panel';
import { LineSelector } from '@/components/line-selector/line-selector';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isOnline] = useState(true);
  const [notifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string>('line-1-1');

  const handleLineSelect = (lineId: string, _lineName: string) => {
    setSelectedLineId(lineId);
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 h-16 w-full">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* 左側: ハンバーガーメニュー（モバイルのみ）とライン選択 */}
        <div className="flex items-center space-x-4 flex-1">
          {/* モバイルハンバーガーメニュー */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* ライン選択 */}
          <div className="flex-1 max-w-xs min-w-0">
            <LineSelector
              selectedLineId={selectedLineId}
              onLineSelect={handleLineSelect}
            />
          </div>
        </div>

        {/* 右側: 通知・接続ステータス・バージョン */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* 接続ステータス */}
          <div className="hidden md:flex items-center space-x-2">
            {isOnline ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">
                  オンライン
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">
                  オフライン
                </span>
              </div>
            )}
          </div>

          {/* バージョン情報 */}
          <div className="hidden md:block">
            <Badge
              variant="outline"
              className="text-xs font-medium border-gray-300 text-gray-600 bg-gray-50/50"
            >
              v2.1.0
            </Badge>
          </div>

          {/* 通知 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-10 w-10 p-0 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-gray-700" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold border-2 border-white shadow-sm">
                  {notifications}
                </div>
              )}
            </Button>

            {showNotifications && (
              <NotificationPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
