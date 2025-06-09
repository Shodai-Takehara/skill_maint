"use client"

import { useState } from 'react'
import { Menu, Bell, Search, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CompanySelector } from '@/components/company/company-selector'
import { NotificationPanel } from '@/components/notifications/notification-panel'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-2 mr-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">MaintEdu</span>
        </div>

        {/* Company selector */}
        <div className="hidden lg:block mr-6">
          <CompanySelector />
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          {showSearch ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment, inspections..."
                className="pl-10"
                onBlur={() => setShowSearch(false)}
                autoFocus
              />
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Search...</span>
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* QR Scanner */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <QrCode className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="danger" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>
            
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* Company selector mobile */}
          <div className="lg:hidden">
            <CompanySelector />
          </div>
        </div>
      </div>
    </header>
  )
}