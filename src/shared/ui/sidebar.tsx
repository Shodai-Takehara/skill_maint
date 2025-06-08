'use client';

import { Avatar, AvatarFallback } from '@shared/ui/avatar';
import { Button } from '@shared/ui/button';
import { ThemeToggle } from '@shared/ui/theme-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/tooltip';
import { cn } from '@shared/lib';
import {
  Award,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: Home },
  { name: '設備管理', href: '/equipment', icon: Settings },
  { name: '作業指示', href: '/work-orders', icon: Wrench },
  { name: 'スキル管理', href: '/skills', icon: Award },
  { name: 'チーム', href: '/team', icon: Users },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export function Sidebar({
  isCollapsed = false,
  onToggle,
  mobileMenuOpen = false,
  onMobileMenuClose,
}: SidebarProps) {
  const pathname = usePathname();

  // サイドバーの内容の表示を遅延させる
  const contentVisible = !isCollapsed;

  // モバイルでナビゲーションクリック時にサイドバーを閉じる
  const handleNavClick = () => {
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  return (
    <TooltipProvider>
      {/* サイドバー */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col',
          'bg-gradient-to-b from-primary-50/90 via-primary-100/70 to-primary-200/50',
          'dark:from-surface-dark/95 dark:via-surface-dark-secondary/90 dark:to-surface-dark-tertiary/80',
          'backdrop-blur-xl border-r border-primary-200/30 dark:border-surface-dark-tertiary/30',
          'shadow-xl shadow-primary-500/5 dark:shadow-black/20',
          // デスクトップ: 折りたたみサイドバー
          'hidden lg:flex lg:transition-[width] lg:duration-500 lg:ease-out',
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        )}
      >
        {/* ヘッダー部分 */}
        <div
          className={cn(
            'flex items-center h-20 border-b border-primary-200/20 dark:border-surface-dark-tertiary/20',
            'bg-gradient-to-r from-primary-100/50 to-primary-200/30',
            'dark:from-surface-dark-secondary/50 dark:to-surface-dark-tertiary/30',
            isCollapsed ? 'justify-center px-3' : 'justify-between px-6'
          )}
        >
          {/* ハンバーガーメニュー */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'p-2.5 rounded-xl transition-all duration-300',
              'hover:bg-primary-200/40 dark:hover:bg-surface-dark-tertiary/40',
              'border border-primary-300/20 dark:border-surface-dark-tertiary/20',
              'shadow-sm backdrop-blur-sm',
              'text-primary-700 dark:text-primary-300'
            )}
            onClick={onToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* サービス名 */}
          <div
            className={cn(
              'flex items-center overflow-hidden transition-all duration-500',
              contentVisible
                ? 'opacity-100 translate-x-0 delay-200'
                : 'opacity-0 translate-x-4 w-0'
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600',
                  'flex items-center justify-center shadow-lg',
                  'border border-primary-400/20'
                )}
              >
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span
                className={cn(
                  'text-xl font-bold whitespace-nowrap bg-gradient-to-r',
                  'from-primary-700 to-primary-600 dark:from-primary-300 dark:to-primary-200',
                  'bg-clip-text text-transparent'
                )}
              >
                SkillMaint
              </span>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-5 py-8 space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            if (isCollapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center w-full h-12 rounded-xl transition-all duration-300',
                        'border border-transparent backdrop-blur-sm',
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-primary-400/20'
                          : 'text-primary-600 dark:text-primary-300 hover:bg-primary-200/30 dark:hover:bg-surface-dark-tertiary/40 hover:shadow-md hover:border-primary-300/20 dark:hover:border-surface-dark-tertiary/20'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-surface-light dark:bg-surface-dark-secondary border-primary-200/20 dark:border-surface-dark-tertiary/20"
                  >
                    <p className="text-primary-700 dark:text-primary-300 font-medium">
                      {item.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 h-12 text-sm font-medium rounded-xl transition-all duration-300 overflow-hidden group',
                  'border border-transparent backdrop-blur-sm',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-primary-400/20'
                    : 'text-primary-700 dark:text-primary-300 hover:bg-primary-200/30 dark:hover:bg-surface-dark-tertiary/40 hover:shadow-md hover:border-primary-300/20 dark:hover:border-surface-dark-tertiary/20'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-transform duration-300',
                    'group-hover:scale-110',
                    isActive
                      ? 'text-white'
                      : 'text-primary-500 dark:text-primary-400'
                  )}
                />
                <span
                  className={cn(
                    'ml-4 whitespace-nowrap transition-all duration-500',
                    contentVisible
                      ? 'opacity-100 translate-x-0 delay-200'
                      : 'opacity-0 translate-x-4'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ユーザー情報 (下部固定) */}
        <div
          className={cn(
            'border-t border-primary-200/20 dark:border-surface-dark-tertiary/20 p-5',
            'bg-gradient-to-r from-primary-100/30 to-primary-200/20',
            'dark:from-surface-dark-secondary/30 dark:to-surface-dark-tertiary/20'
          )}
        >
          {/* ユーザーアバターと情報 */}
          <div className="flex items-center mb-6 overflow-hidden">
            <Avatar
              className={cn(
                'h-8 w-8 flex-shrink-0 transition-all duration-300',
                'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg',
                'border-2 border-primary-300/30 dark:border-surface-dark-tertiary/30',
                isCollapsed ? 'cursor-pointer hover:scale-110' : ''
              )}
            >
              <AvatarFallback className="text-white font-bold text-xs bg-transparent">
                田中
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                'ml-4 flex-1 transition-all duration-500',
                contentVisible
                  ? 'opacity-100 translate-x-0 delay-200'
                  : 'opacity-0 translate-x-4'
              )}
            >
              <p
                className={cn(
                  'text-sm font-semibold whitespace-nowrap',
                  'text-primary-700 dark:text-primary-300'
                )}
              >
                田中 太郎
              </p>
              <p
                className={cn(
                  'text-xs whitespace-nowrap',
                  'text-primary-500 dark:text-primary-400'
                )}
              >
                主任技師
              </p>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            {/* テーマ切り替え */}
            {isCollapsed ? (
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            ) : (
              <ThemeToggle showLabel />
            )}

            {/* 設定ボタン */}
            {isCollapsed ? (
              <div className="flex justify-center">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'w-12 h-10 p-0 rounded-xl transition-all duration-300',
                        'hover:bg-primary-200/40 dark:hover:bg-surface-dark-tertiary/40',
                        'text-primary-600 dark:text-primary-300 hover:scale-110'
                      )}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-primary-700 dark:text-primary-300 font-medium">
                      設定
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start h-11 overflow-hidden rounded-xl transition-all duration-300',
                  'hover:bg-primary-200/30 dark:hover:bg-surface-dark-tertiary/40',
                  'text-primary-700 dark:text-primary-300 hover:shadow-md',
                  'border border-transparent hover:border-primary-300/20 dark:hover:border-surface-dark-tertiary/20'
                )}
              >
                <Settings className="h-4 w-4 flex-shrink-0 text-primary-500 dark:text-primary-400" />
                <span
                  className={cn(
                    'ml-3 whitespace-nowrap transition-all duration-500 font-medium',
                    contentVisible
                      ? 'opacity-100 translate-x-0 delay-200'
                      : 'opacity-0 translate-x-4'
                  )}
                >
                  設定
                </span>
              </Button>
            )}

            {/* ログアウトボタン */}
            {isCollapsed ? (
              <div className="flex justify-center">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'w-12 h-10 p-0 rounded-xl transition-all duration-300',
                        'text-accent-red hover:bg-accent-red/10 hover:scale-110'
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="text-accent-red font-medium">ログアウト</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start h-11 overflow-hidden rounded-xl transition-all duration-300',
                  'text-accent-red hover:bg-accent-red/10 hover:shadow-md',
                  'border border-transparent hover:border-accent-red/20'
                )}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    'ml-3 whitespace-nowrap transition-all duration-500 font-medium',
                    contentVisible
                      ? 'opacity-100 translate-x-0 delay-200'
                      : 'opacity-0 translate-x-4'
                  )}
                >
                  ログアウト
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* モバイルサイドバー */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          'bg-gradient-to-b from-primary-50/90 via-primary-100/70 to-primary-200/50',
          'dark:from-surface-dark/95 dark:via-surface-dark-secondary/90 dark:to-surface-dark-tertiary/80',
          'backdrop-blur-xl border-r border-primary-200/30 dark:border-surface-dark-tertiary/30',
          'shadow-xl shadow-primary-500/5 dark:shadow-black/20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* ヘッダー部分 */}
        <div
          className={cn(
            'flex items-center justify-between h-16 px-6',
            'border-b border-primary-200/20 dark:border-surface-dark-tertiary/20',
            'bg-gradient-to-r from-primary-100/50 to-primary-200/30',
            'dark:from-surface-dark-secondary/50 dark:to-surface-dark-tertiary/30'
          )}
        >
          {/* サービス名 */}
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                'w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600',
                'flex items-center justify-center shadow-lg',
                'border border-primary-400/20'
              )}
            >
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span
              className={cn(
                'text-xl font-bold bg-gradient-to-r',
                'from-primary-700 to-primary-600 dark:from-primary-300 dark:to-primary-200',
                'bg-clip-text text-transparent'
              )}
            >
              SkillMaint
            </span>
          </div>

          {/* 閉じるボタン */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'p-2.5 rounded-xl transition-all duration-300',
              'hover:bg-primary-200/40 dark:hover:bg-surface-dark-tertiary/40',
              'border border-primary-300/20 dark:border-surface-dark-tertiary/20',
              'shadow-sm backdrop-blur-sm',
              'text-primary-700 dark:text-primary-300'
            )}
            onClick={onMobileMenuClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-5 py-8 space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center px-4 h-12 text-sm font-medium rounded-xl transition-all duration-300',
                  'border border-transparent backdrop-blur-sm',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 border-primary-400/20'
                    : 'text-primary-700 dark:text-primary-300 hover:bg-primary-200/30 dark:hover:bg-surface-dark-tertiary/40 hover:shadow-md hover:border-primary-300/20 dark:hover:border-surface-dark-tertiary/20'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 mr-3 transition-transform duration-300',
                    'hover:scale-110',
                    isActive
                      ? 'text-white'
                      : 'text-primary-500 dark:text-primary-400'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ユーザー情報 */}
        <div
          className={cn(
            'border-t border-primary-200/20 dark:border-surface-dark-tertiary/20 p-5',
            'bg-gradient-to-r from-primary-100/30 to-primary-200/20',
            'dark:from-surface-dark-secondary/30 dark:to-surface-dark-tertiary/20'
          )}
        >
          <div className="flex items-center mb-6">
            <Avatar
              className={cn(
                'h-8 w-8 transition-all duration-300',
                'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg',
                'border-2 border-primary-300/30 dark:border-surface-dark-tertiary/30'
              )}
            >
              <AvatarFallback className="text-white font-bold text-xs bg-transparent">
                田中
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <p
                className={cn(
                  'text-sm font-semibold',
                  'text-primary-700 dark:text-primary-300'
                )}
              >
                田中 太郎
              </p>
              <p
                className={cn(
                  'text-xs',
                  'text-primary-500 dark:text-primary-400'
                )}
              >
                主任技師
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ThemeToggle showLabel />
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start h-11 rounded-xl transition-all duration-300',
                'hover:bg-primary-200/30 dark:hover:bg-surface-dark-tertiary/40',
                'text-primary-700 dark:text-primary-300 hover:shadow-md',
                'border border-transparent hover:border-primary-300/20 dark:hover:border-surface-dark-tertiary/20'
              )}
            >
              <Settings className="h-4 w-4 mr-3 text-primary-500 dark:text-primary-400" />
              設定
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start h-11 rounded-xl transition-all duration-300',
                'text-accent-red hover:bg-accent-red/10 hover:shadow-md',
                'border border-transparent hover:border-accent-red/20'
              )}
            >
              <LogOut className="h-4 w-4 mr-3" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
