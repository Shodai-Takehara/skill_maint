'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  Wifi,
  WifiOff
} from 'lucide-react';

export function Header() {
  const [isOnline, setIsOnline] = useState(true);
  const [notifications] = useState(3);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16 w-full">
      <div className="flex items-center justify-end h-full px-4 lg:px-6 ml-0 lg:ml-0">
        {/* 右側: 通知・設定・ユーザー */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* 接続ステータス */}
          <div className="hidden md:flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs text-gray-500">
              {isOnline ? 'オンライン' : 'オフライン'}
            </span>
          </div>

          {/* バージョン情報 */}
          <div className="hidden md:block">
            <Badge variant="outline" className="text-xs">
              v2.1.0
            </Badge>
          </div>

          {/* 通知 */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* 設定 */}
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="h-4 w-4" />
          </Button>

          {/* ユーザーメニュー */}
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 p-2">
            <User className="h-4 w-4" />
            <ChevronDown className="h-3 w-3 hidden lg:block" />
          </Button>
        </div>
      </div>
    </header>
  );
}