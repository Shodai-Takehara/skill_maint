'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  Settings, 
  Wrench, 
  Users, 
  Award,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: Home },
  { name: '設備管理', href: '/equipment', icon: Settings },
  { name: '作業指示', href: '/work-orders', icon: Wrench },
  { name: 'スキル管理', href: '/skills', icon: Award },
  { name: 'チーム', href: '/team', icon: Users },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // モバイルでナビゲーションクリック時にサイドバーを閉じる
  const handleNavClick = () => {
    setIsOpen(false);
  };

  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* モバイル・タブレット用ハンバーガーメニューボタン */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* オーバーレイ (モバイル・タブレット) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー */}
      <div className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col",
        "w-64", // 全デバイスで統一幅
        // モバイル・タブレット: スライドイン/アウト
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          {/* サービス名 */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">SkillMaint</span>
          </div>
          
          {/* 閉じるボタン (モバイル・タブレットのみ) */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setIsOpen(false)}
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
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-blue-700" : "text-gray-400"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* ユーザー情報 (下部固定) */}
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
              className="w-full justify-start text-gray-700 hover:bg-gray-50"
            >
              <User className="mr-2 h-4 w-4" />
              プロフィール
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-700 hover:bg-gray-50"
            >
              <Settings className="mr-2 h-4 w-4" />
              設定
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}