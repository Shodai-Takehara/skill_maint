'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Bell, LogOut, Menu, Settings, Shield, User } from 'lucide-react';

import { cn } from '@shared/lib';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';

import { LineSelector } from '@widgets/line-selector';
import { NotificationPanel } from '@widgets/notifications';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isOnline] = useState(true);
  const [notifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string>('line-1-1');

  // ユーザー情報（実際のアプリではContextやStoreから取得）
  const currentUser = {
    name: '山田 太郎',
    email: 'yamada@example.com',
    role: 'tenant_admin', // tenant_admin | line_manager | operator | viewer
  };

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
                  'bg-green-50 border border-green-200',
                  'backdrop-blur-sm shadow-sm'
                )}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm text-green-600 font-semibold">
                  オンライン
                </span>
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-xl',
                  'bg-red-50 border border-red-200',
                  'backdrop-blur-sm shadow-sm'
                )}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-sm text-red-600 font-semibold">
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
                'bg-blue-600 text-white',
                'border border-blue-500/20 shadow-md',
                'hover:bg-blue-700 transition-all duration-300'
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
                    'bg-red-500',
                    'text-white text-xs flex items-center justify-center font-bold',
                    'border-2 border-white shadow-lg'
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

          {/* ユーザーメニュー */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-12 w-12 p-0 rounded-xl transition-all duration-300',
                  'hover:bg-primary-200/40 dark:hover:bg-surface-dark-tertiary/40',
                  'border border-primary-300/20 dark:border-surface-dark-tertiary/20',
                  'shadow-sm backdrop-blur-sm hover:shadow-md hover:scale-105',
                  'text-primary-700 dark:text-primary-300'
                )}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* 管理者メニュー（権限に応じて表示） */}
              {(currentUser.role === 'tenant_admin' ||
                currentUser.role === 'line_manager') && (
                <>
                  <Link href="/admin/tenant-settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>管理者設定</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                </>
              )}

              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>プロフィール</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>設定</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ログアウト</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
