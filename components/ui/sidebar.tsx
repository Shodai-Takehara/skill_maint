'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Award,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
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
          'fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 flex flex-col',
          // デスクトップ: 折りたたみサイドバー
          'hidden lg:flex lg:transition-[width] lg:duration-300 lg:ease-in-out',
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        {/* ヘッダー部分 */}
        <div
          className={cn(
            'flex items-center h-16 border-b border-gray-200',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-6'
          )}
        >
          {/* ハンバーガーメニュー */}
          <Button variant="ghost" size="sm" className="p-2" onClick={onToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* サービス名 */}
          <div
            className={cn(
              'flex items-center overflow-hidden transition-opacity',
              contentVisible
                ? 'opacity-100 transition-delay-200'
                : 'opacity-0 w-0'
            )}
          >
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
              SkillMaint
            </span>
          </div>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            if (isCollapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center w-full h-10 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-blue-700' : 'text-gray-400'
                        )}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 h-10 text-sm font-medium rounded-lg transition-colors overflow-hidden',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  )}
                />
                <span
                  className={cn(
                    'ml-3 whitespace-nowrap transition-opacity',
                    contentVisible
                      ? 'opacity-100 transition-delay-200'
                      : 'opacity-0'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ユーザー情報 (下部固定) */}
        <div className="border-t border-gray-200 p-4">
          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 bg-blue-600 cursor-pointer">
                    <AvatarFallback className="text-white font-semibold">
                      田中
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">田中 太郎</p>
                    <p className="text-xs text-gray-500">主任技師</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-12 h-10 p-0">
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>プロフィール</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-12 h-10 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>設定</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-10 p-0 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>ログアウト</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-3 overflow-hidden">
                <Avatar className="h-10 w-10 bg-blue-600 flex-shrink-0">
                  <AvatarFallback className="text-white font-semibold">
                    田中
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'ml-3 flex-1 transition-opacity',
                    contentVisible
                      ? 'opacity-100 transition-delay-200'
                      : 'opacity-0'
                  )}
                >
                  <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    田中 太郎
                  </p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    主任技師
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 text-gray-700 hover:bg-gray-50 overflow-hidden"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      'ml-2 whitespace-nowrap transition-opacity',
                      contentVisible
                        ? 'opacity-100 transition-delay-200'
                        : 'opacity-0'
                    )}
                  >
                    プロフィール
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 text-gray-700 hover:bg-gray-50 overflow-hidden"
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      'ml-2 whitespace-nowrap transition-opacity',
                      contentVisible
                        ? 'opacity-100 transition-delay-200'
                        : 'opacity-0'
                    )}
                  >
                    設定
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 text-red-600 hover:bg-red-50 overflow-hidden"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      'ml-2 whitespace-nowrap transition-opacity',
                      contentVisible
                        ? 'opacity-100 transition-delay-200'
                        : 'opacity-0'
                    )}
                  >
                    ログアウト
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* モバイルサイドバー */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          {/* サービス名 */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">SkillMaint</span>
          </div>

          {/* 閉じるボタン */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={onMobileMenuClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center px-3 h-10 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 mr-3',
                    isActive ? 'text-blue-700' : 'text-gray-400'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ユーザー情報 */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <Avatar className="h-10 w-10 bg-blue-600">
              <AvatarFallback className="text-white font-semibold">
                田中
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">田中 太郎</p>
              <p className="text-xs text-gray-500">主任技師</p>
            </div>
          </div>

          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-10 text-gray-700 hover:bg-gray-50"
            >
              <User className="h-4 w-4 mr-2" />
              プロフィール
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-10 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-10 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
