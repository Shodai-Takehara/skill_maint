'use client';

import { useState } from 'react';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { NotificationPanel } from '@widgets/notifications';
import { LineSelector } from '@widgets/line-selector';
import { Bell, Menu } from 'lucide-react';
import { cn } from '@shared/lib';

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
    <header
      className={cn(
        'sticky top-0 z-30 h-20 w-full',
        'bg-gradient-to-r from-surface-light/90 via-surface-light-secondary/80 to-primary-50/60',
        'dark:from-surface-dark/90 dark:via-surface-dark-secondary/80 dark:to-surface-dark-tertiary/60',
        'backdrop-blur-2xl border-b border-primary-200/30 dark:border-surface-dark-tertiary/30',
        'shadow-lg shadow-primary-500/5 dark:shadow-black/10'
      )}
    >
      <div className="flex items-center justify-between h-full px-6 lg:px-8">
        {/* 左側: ハンバーガーメニュー（モバイルのみ）とライン選択 */}
        <div className="flex items-center space-x-4 flex-1">
          {/* モバイルハンバーガーメニュー */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'lg:hidden p-2.5 rounded-xl transition-all duration-300',
              'hover:bg-primary-200/40 dark:hover:bg-surface-dark-tertiary/40',
              'border border-primary-300/20 dark:border-surface-dark-tertiary/20',
              'shadow-sm backdrop-blur-sm',
              'text-primary-700 dark:text-primary-300'
            )}
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
        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* 接続ステータス */}
          <div className="hidden md:flex items-center space-x-3">
            {isOnline ? (
              <div
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-xl',
                  'bg-accent-green/10 border border-accent-green/20',
                  'backdrop-blur-sm shadow-sm'
                )}
              >
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm text-accent-green font-semibold">
                  オンライン
                </span>
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-xl',
                  'bg-accent-red/10 border border-accent-red/20',
                  'backdrop-blur-sm shadow-sm'
                )}
              >
                <div className="w-2 h-2 bg-accent-red rounded-full shadow-sm"></div>
                <span className="text-sm text-accent-red font-semibold">
                  オフライン
                </span>
              </div>
            )}
          </div>

          {/* バージョン情報 */}
          <div className="hidden md:block">
            <Badge
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-xl',
                'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
                'border border-primary-400/20 shadow-md shadow-primary-500/25',
                'hover:from-primary-600 hover:to-primary-700 transition-all duration-300'
              )}
            >
              v2.1.0
            </Badge>
          </div>

          {/* 通知 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'relative h-12 w-12 p-0 rounded-xl transition-all duration-300',
                'hover:bg-primary-200/40 dark:hover:bg-surface-dark-tertiary/40',
                'border border-primary-300/20 dark:border-surface-dark-tertiary/20',
                'shadow-sm backdrop-blur-sm hover:shadow-md hover:scale-105',
                'text-primary-700 dark:text-primary-300'
              )}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <div
                  className={cn(
                    'absolute -top-1 -right-1 h-6 w-6 rounded-full',
                    'bg-gradient-to-r from-accent-red to-accent-red/90',
                    'text-white text-xs flex items-center justify-center font-bold',
                    'border-2 border-white dark:border-surface-dark shadow-lg',
                    'animate-bounce-gentle'
                  )}
                >
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