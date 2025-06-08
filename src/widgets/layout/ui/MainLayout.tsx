'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@shared/ui/sidebar';
import { Header } from '@widgets/header';
import { cn } from '@shared/lib';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初回レンダリング時にlocalStorageから状態を読み込む
  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // 状態が変更されたらlocalStorageに保存
  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    if (mounted) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    }
  };

  return (
    <div
      className={cn(
        'flex h-screen',
        'bg-gradient-to-br from-primary-50/30 via-surface-light-secondary to-primary-100/20',
        'dark:from-surface-dark dark:via-surface-dark-secondary dark:to-surface-dark-tertiary'
      )}
    >
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />

      {/* モバイルオーバーレイ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-500 w-full min-w-0',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}