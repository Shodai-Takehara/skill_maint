"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  Users,
  Wrench,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: '日常点検',
    href: '/inspections',
    icon: ClipboardCheck,
    children: [
      { name: '本日の予定', href: '/inspections' },
      { name: 'クイック点検', href: '/inspections/quick' },
      { name: '点検履歴', href: '/inspections/history' },
    ]
  },
  {
    name: 'テンプレート',
    href: '/templates',
    icon: FileText,
  },
  {
    name: '設備',
    href: '/equipment',
    icon: Settings,
  },
  {
    name: '作業指示',
    href: '/work-orders',
    icon: Wrench,
  },
  {
    name: '分析',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'チーム・スキル',
    href: '/team',
    icon: Users,
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b lg:hidden">
          <span className="font-bold text-xl">MaintEdu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const isExpanded = expandedItems.includes(item.name)
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center flex-1 px-3 py-3 text-sm font-medium rounded-lg transition-colors touch-target",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose()
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                  
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-1"
                      onClick={() => toggleExpanded(item.name)}
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )} />
                    </Button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors touch-target",
                          pathname === child.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose()
                          }
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}