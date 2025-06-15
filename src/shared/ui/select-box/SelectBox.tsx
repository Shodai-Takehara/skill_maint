'use client';

import { forwardRef } from 'react';

import { Check, ChevronDown, Search } from 'lucide-react';

import { cn } from '@shared/lib';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectBoxProps {
  // 基本プロパティ
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  
  // 外観・サイズ
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  fullWidth?: boolean;
  
  // 機能
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  disabled?: boolean;
  
  // UI拡張
  showIcons?: boolean;
  showBadges?: boolean;
  showDescriptions?: boolean;
  maxDisplayItems?: number;
  
  // スタイル
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  
  // アクセシビリティ
  name?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  // イベント
  onSearch?: (searchTerm: string) => void;
  onClear?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const SelectBox = forwardRef<HTMLButtonElement, SelectBoxProps>(
  (
    {
      value,
      defaultValue,
      placeholder = '選択してください',
      onValueChange,
      options = [],
      groups = [],
      size = 'md',
      variant = 'default',
      fullWidth = true,
      searchable = false,
      clearable = false,
      multiple = false,
      loading = false,
      disabled = false,
      showIcons = true,
      showBadges = true,
      showDescriptions = true,
      maxDisplayItems = 100,
      className,
      triggerClassName,
      contentClassName,
      name,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      onSearch,
      onClear,
      onOpen,
      onClose,
    },
    ref
  ) => {
    // サイズバリアント
    const sizeClasses = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    // バリアントスタイル
    const variantClasses = {
      default: 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
      outline: 'border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      ghost: 'border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground',
    };

    // 全てのオプションを統合（グループ化されたものと個別のもの）
    const allOptions = [
      ...options,
      ...groups.flatMap(group => group.options)
    ].slice(0, maxDisplayItems);

    // 選択されたオプションを見つける
    const selectedOption = allOptions.find(opt => opt.value === value);

    // プレースホルダーの表示
    const displayValue = selectedOption 
      ? selectedOption.label 
      : placeholder;

    // クリア機能
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear?.();
      onValueChange?.('');
    };

    // オプションアイテムのレンダリング
    const renderSelectItem = (option: SelectOption) => (
      <SelectItem
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        className={cn(
          'flex items-center justify-between',
          showDescriptions && option.description && 'py-3'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showIcons && option.icon && (
            <span className="flex-shrink-0">{option.icon}</span>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{option.label}</div>
            {showDescriptions && option.description && (
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {option.description}
              </div>
            )}
          </div>
          {showBadges && option.badge && (
            <Badge
              variant={option.badge.variant || 'secondary'}
              className="text-xs flex-shrink-0"
            >
              {option.badge.text}
            </Badge>
          )}
          {value === option.value && (
            <Check className="h-4 w-4 flex-shrink-0" />
          )}
        </div>
      </SelectItem>
    );

    return (
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled || loading}
        onOpenChange={(open) => {
          if (open) {
            onOpen?.();
          } else {
            onClose?.();
          }
        }}
      >
        <SelectTrigger
          ref={ref}
          id={id}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={cn(
            sizeClasses[size],
            variantClasses[variant],
            fullWidth && 'w-full',
            'justify-between',
            disabled && 'opacity-50 cursor-not-allowed',
            loading && 'cursor-wait',
            triggerClassName,
            className
          )}
        >
          <SelectValue placeholder={placeholder}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOption && showIcons && selectedOption.icon && (
                <span className="flex-shrink-0">{selectedOption.icon}</span>
              )}
              <span className="truncate">{displayValue}</span>
              {selectedOption && showBadges && selectedOption.badge && (
                <Badge
                  variant={selectedOption.badge.variant || 'secondary'}
                  className="text-xs flex-shrink-0"
                >
                  {selectedOption.badge.text}
                </Badge>
              )}
            </div>
          </SelectValue>
          <div className="flex items-center gap-1">
            {clearable && value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleClear}
              >
                ×
              </Button>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </SelectTrigger>

        <SelectContent
          className={cn(
            'max-h-[300px]',
            contentClassName
          )}
        >
          {searchable && (
            <div className="flex items-center border-b px-3 pb-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="検索..."
                className="h-8 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              読み込み中...
            </div>
          ) : (
            <>
              {/* 個別オプション */}
              {options.map(renderSelectItem)}

              {/* グループ化されたオプション */}
              {groups.map((group) => (
                <div key={group.label}>
                  {groups.length > 1 && (
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t first:border-t-0">
                      {group.label}
                    </div>
                  )}
                  {group.options.map(renderSelectItem)}
                </div>
              ))}

              {allOptions.length === 0 && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  オプションがありません
                </div>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    );
  }
);

SelectBox.displayName = 'SelectBox';

export { SelectBox };