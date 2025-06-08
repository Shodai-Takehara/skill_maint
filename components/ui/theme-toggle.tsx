'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (showLabel) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          'w-full justify-start h-11 rounded-xl transition-all duration-300',
          'hover:bg-primary-200/30 dark:hover:bg-surface-dark-tertiary/40',
          'text-primary-700 dark:text-primary-300 hover:shadow-md',
          'border border-transparent hover:border-primary-300/20 dark:hover:border-surface-dark-tertiary/20'
        )}
      >
        <div className="flex items-center">
          <div className="relative mr-3">
            <Sun
              className={cn(
                'h-4 w-4 transition-all duration-300',
                'text-primary-500 dark:text-primary-400',
                isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
              )}
            />
            <Moon
              className={cn(
                'absolute top-0 left-0 h-4 w-4 transition-all duration-300',
                'text-primary-500 dark:text-primary-400',
                isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
              )}
            />
          </div>
          <span className="font-medium">
            {isDark ? 'ライトモード' : 'ダークモード'}
          </span>
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'relative h-10 w-10 p-0 rounded-xl transition-all duration-300',
        'hover:bg-primary-100/50 dark:hover:bg-surface-dark-secondary/50',
        'border border-primary-200/30 dark:border-surface-dark-tertiary/30',
        'backdrop-blur-sm shadow-sm'
      )}
    >
      <Sun
        className={cn(
          'h-5 w-5 transition-all duration-300',
          'text-primary-600 dark:text-primary-300',
          isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        )}
      />
      <Moon
        className={cn(
          'absolute h-5 w-5 transition-all duration-300',
          'text-primary-600 dark:text-primary-300',
          isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        )}
      />
      <span className="sr-only">テーマを切り替え</span>
    </Button>
  );
}
