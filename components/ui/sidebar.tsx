'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Settings, 
  Wrench, 
  Award, 
  Users, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: Home, label: 'ダッシュボード', href: '/' },
  { icon: Settings, label: '設備管理', href: '/equipment' },
  { icon: Wrench, label: '作業指示', href: '/work-orders' },
  { icon: Award, label: 'スキル管理', href: '/skills' },
  { icon: Users, label: 'チーム', href: '/team' },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // モバイルでサイドバーが開いているときは背景スクロールを無効化
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* モバイル用ハンバーガーメニューボタン */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden p-2"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* モバイル用オーバーレイ */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* サイドバー */}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30",
        // モバイル・タブレット
        "lg:hidden",
        isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
        // PC
        "lg:translate-x-0 lg:relative lg:block",
        isExpanded ? "lg:w-64" : "lg:w-16"
      )}>
        {/* サイドバーヘッダー */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {/* サービス名 */}
          <div className={cn(
            "flex items-center space-x-3 transition-all duration-300",
            !isExpanded && "lg:justify-center lg:space-x-0"
          )}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className={cn(
              "font-bold text-lg text-gray-900 whitespace-nowrap transition-all duration-300",
              !isExpanded && "lg:hidden",
              isMobileOpen || isExpanded ? "block" : "lg:hidden"
            )}>
              SkillMaint
            </span>
          </div>

          {/* 閉じるボタン（モバイル・タブレット用） */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* 展開/縮小ボタン（PC用） */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:block p-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                      isActive 
                        ? "bg-blue-50 text-blue-600 border border-blue-200" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      !isExpanded && "lg:justify-center lg:space-x-0"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                    )} />
                    <span className={cn(
                      "font-medium whitespace-nowrap transition-all duration-300",
                      !isExpanded && "lg:hidden",
                      isMobileOpen || isExpanded ? "block" : "lg:hidden"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* PC縮小時のツールチップ */}
                    {!isExpanded && (
                      <div className="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ユーザー情報（下部） */}
        <div className="border-t border-gray-200 p-4">
          <div className={cn(
            "flex items-center space-x-3 transition-all duration-300",
            !isExpanded && "lg:justify-center lg:space-x-0"
          )}>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div className={cn(
              "transition-all duration-300",
              !isExpanded && "lg:hidden",
              isMobileOpen || isExpanded ? "block" : "lg:hidden"
            )}>
              <p className="text-sm font-medium text-gray-900">田中 太郎</p>
              <p className="text-xs text-gray-500">主任技師</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}