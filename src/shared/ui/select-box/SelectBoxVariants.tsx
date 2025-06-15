'use client';

import { forwardRef } from 'react';

import { cn } from '@shared/lib';

import { SelectBox, SelectBoxProps, SelectOption } from './SelectBox';

// フォーム用セレクトボックス
interface FormSelectBoxProps extends Omit<SelectBoxProps, 'variant' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const FormSelectBox = forwardRef<HTMLButtonElement, FormSelectBoxProps>(
  ({ size = 'md', required, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <SelectBox
          ref={ref}
          size={size}
          variant="default"
          className={cn(
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          aria-required={required}
          aria-invalid={error}
          aria-describedby={helperText ? `${props.id}-helper` : props['aria-describedby']}
          {...props}
        />
        {helperText && (
          <p
            id={props.id ? `${props.id}-helper` : undefined}
            className={cn(
              'text-xs',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelectBox.displayName = 'FormSelectBox';

// フィルター用セレクトボックス
interface FilterSelectBoxProps extends Omit<SelectBoxProps, 'variant' | 'clearable'> {
  showClearAll?: boolean;
}

export const FilterSelectBox = forwardRef<HTMLButtonElement, FilterSelectBoxProps>(
  ({ showClearAll = true, size = 'sm', ...props }, ref) => {
    return (
      <SelectBox
        ref={ref}
        variant="outline"
        size={size}
        clearable={showClearAll}
        fullWidth={false}
        {...props}
      />
    );
  }
);

FilterSelectBox.displayName = 'FilterSelectBox';

// ステータス用セレクトボックス
interface StatusSelectBoxProps extends Omit<SelectBoxProps, 'options' | 'showBadges'> {
  statuses: Array<{
    value: string;
    label: string;
    color: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
    description?: string;
  }>;
}

export const StatusSelectBox = forwardRef<HTMLButtonElement, StatusSelectBoxProps>(
  ({ statuses, ...props }, ref) => {
    const getStatusBadgeVariant = (color: string) => {
      switch (color) {
        case 'green': return 'default';
        case 'yellow': return 'secondary';
        case 'red': return 'destructive';
        case 'blue': return 'outline';
        default: return 'secondary';
      }
    };

    const statusOptions: SelectOption[] = statuses.map(status => ({
      value: status.value,
      label: status.label,
      description: status.description,
      badge: {
        text: status.label,
        variant: getStatusBadgeVariant(status.color)
      }
    }));

    return (
      <SelectBox
        ref={ref}
        options={statusOptions}
        showBadges={true}
        showDescriptions={!!statuses.some(s => s.description)}
        {...props}
      />
    );
  }
);

StatusSelectBox.displayName = 'StatusSelectBox';

// 検索可能なセレクトボックス
interface SearchableSelectBoxProps extends SelectBoxProps {
  onAsyncSearch?: (searchTerm: string) => Promise<SelectOption[]>;
  searchPlaceholder?: string;
  minSearchLength?: number;
}

export const SearchableSelectBox = forwardRef<HTMLButtonElement, SearchableSelectBoxProps>(
  ({ 
    onAsyncSearch, 
    searchPlaceholder = '検索...', 
    minSearchLength = 2,
    ...props 
  }, ref) => {
    return (
      <SelectBox
        ref={ref}
        searchable={true}
        placeholder={searchPlaceholder}
        {...props}
      />
    );
  }
);

SearchableSelectBox.displayName = 'SearchableSelectBox';

// ユーザー選択用セレクトボックス
interface UserSelectBoxProps extends Omit<SelectBoxProps, 'options' | 'showIcons'> {
  users: Array<{
    id: string;
    name: string;
    email?: string;
    role?: string;
    avatar?: string;
    isOnline?: boolean;
  }>;
}

export const UserSelectBox = forwardRef<HTMLButtonElement, UserSelectBoxProps>(
  ({ users, ...props }, ref) => {
    const userOptions: SelectOption[] = users.map(user => ({
      value: user.id,
      label: user.name,
      description: user.email || user.role,
      icon: user.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-6 h-6 rounded-full"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
          {user.name.charAt(0).toUpperCase()}
        </div>
      ),
      badge: user.isOnline ? {
        text: 'オンライン',
        variant: 'default' as const
      } : undefined
    }));

    return (
      <SelectBox
        ref={ref}
        options={userOptions}
        showIcons={true}
        showDescriptions={true}
        showBadges={true}
        {...props}
      />
    );
  }
);

UserSelectBox.displayName = 'UserSelectBox';

// 多層階層用セレクトボックス
interface HierarchicalSelectBoxProps extends Omit<SelectBoxProps, 'options' | 'groups'> {
  hierarchy: Array<{
    id: string;
    label: string;
    level: number;
    parentId?: string;
    children?: Array<{
      id: string;
      label: string;
      level: number;
    }>;
  }>;
  maxLevel?: number;
}

export const HierarchicalSelectBox = forwardRef<HTMLButtonElement, HierarchicalSelectBoxProps>(
  ({ hierarchy, maxLevel = 3, ...props }, ref) => {
    const buildHierarchicalOptions = (items: typeof hierarchy): SelectOption[] => {
      return items.map(item => ({
        value: item.id,
        label: '　'.repeat(item.level) + item.label,
        description: `レベル ${item.level + 1}`,
        icon: item.level === 0 ? '📁' : item.level === 1 ? '📂' : '📄'
      }));
    };

    const hierarchicalOptions = buildHierarchicalOptions(hierarchy);

    return (
      <SelectBox
        ref={ref}
        options={hierarchicalOptions}
        showIcons={true}
        showDescriptions={true}
        {...props}
      />
    );
  }
);

HierarchicalSelectBox.displayName = 'HierarchicalSelectBox';