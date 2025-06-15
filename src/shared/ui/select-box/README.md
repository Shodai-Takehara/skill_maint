# SelectBox コンポーネント

拡張性と再利用性を重視した共通セレクトボックスコンポーネントです。shadcn/ui Select をベースに、様々な使用パターンに対応できる機能を提供します。

## 特徴

- **統一されたUI/UX**: 一貫したデザインシステム
- **高い拡張性**: 多様な使用ケースに対応
- **アクセシビリティ**: Radix UI による完全なキーボードナビゲーション
- **TypeScript完全対応**: 型安全な実装
- **パフォーマンス最適化**: 必要な機能のみを読み込み

## コンポーネント一覧

### 基本コンポーネント

#### `SelectBox`
最も汎用性の高い基本コンポーネント

```tsx
import { SelectBox } from '@shared/ui';

<SelectBox
  value={selectedValue}
  onValueChange={setSelectedValue}
  placeholder="選択してください"
  options={[
    { value: 'option1', label: 'オプション1' },
    { value: 'option2', label: 'オプション2' },
  ]}
/>
```

### 用途別バリアント

#### `FormSelectBox`
フォーム内での使用に最適化

```tsx
import { FormSelectBox } from '@shared/ui';

<FormSelectBox
  name="category"
  placeholder="カテゴリを選択"
  options={categoryOptions}
  required={true}
  error={!!errors.category}
  helperText={errors.category?.message}
/>
```

#### `FilterSelectBox`
フィルター機能として使用

```tsx
import { FilterSelectBox } from '@shared/ui';

<FilterSelectBox
  value={filterValue}
  onValueChange={setFilterValue}
  placeholder="フィルター"
  options={filterOptions}
  showClearAll={true}
  compact={true}
/>
```

#### `StatusSelectBox`
ステータス選択用

```tsx
import { StatusSelectBox } from '@shared/ui';

<StatusSelectBox
  value={status}
  onValueChange={setStatus}
  placeholder="ステータス選択"
  statuses={[
    { value: 'active', label: '稼働中', color: 'green' },
    { value: 'maintenance', label: 'メンテナンス', color: 'yellow' },
    { value: 'error', label: 'エラー', color: 'red' },
  ]}
/>
```

#### `SearchableSelectBox`
検索機能付き

```tsx
import { SearchableSelectBox } from '@shared/ui';

<SearchableSelectBox
  placeholder="検索して選択"
  options={largeOptionList}
  searchPlaceholder="項目を検索..."
  onSearch={handleSearch}
/>
```

#### `UserSelectBox`
ユーザー選択用

```tsx
import { UserSelectBox } from '@shared/ui';

<UserSelectBox
  placeholder="担当者を選択"
  users={[
    {
      id: 'user1',
      name: '田中 太郎',
      email: 'tanaka@example.com',
      role: 'エンジニア',
      isOnline: true
    }
  ]}
/>
```

#### `HierarchicalSelectBox`
階層データ用

```tsx
import { HierarchicalSelectBox } from '@shared/ui';

<HierarchicalSelectBox
  placeholder="組織を選択"
  hierarchy={[
    { id: 'factory1', label: '工場A', level: 0 },
    { id: 'line1', label: 'ライン1', level: 1, parentId: 'factory1' },
    { id: 'section1', label: 'セクション1', level: 2, parentId: 'line1' },
  ]}
/>
```

## プロパティ詳細

### 基本プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----- |
| `value` | `string` | `undefined` | 選択された値 |
| `defaultValue` | `string` | `undefined` | デフォルト値 |
| `placeholder` | `string` | `'選択してください'` | プレースホルダーテキスト |
| `onValueChange` | `(value: string) => void` | `undefined` | 値変更時のコールバック |

### オプション設定

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----- |
| `options` | `SelectOption[]` | `[]` | 選択肢のリスト |
| `groups` | `SelectGroup[]` | `[]` | グループ化された選択肢 |

### 外観・サイズ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | コンポーネントサイズ |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | 見た目のバリアント |
| `fullWidth` | `boolean` | `true` | 幅を100%にするか |

### 機能オプション

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----- |
| `searchable` | `boolean` | `false` | 検索機能を有効にするか |
| `clearable` | `boolean` | `false` | クリア機能を有効にするか |
| `loading` | `boolean` | `false` | ローディング状態 |
| `disabled` | `boolean` | `false` | 無効状態 |

### UI拡張

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----- |
| `showIcons` | `boolean` | `true` | アイコン表示 |
| `showBadges` | `boolean` | `true` | バッジ表示 |
| `showDescriptions` | `boolean` | `true` | 説明文表示 |
| `maxDisplayItems` | `number` | `100` | 最大表示項目数 |

## SelectOption 型

```tsx
interface SelectOption {
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
```

## SelectGroup 型

```tsx
interface SelectGroup {
  label: string;
  options: SelectOption[];
}
```

## プリセット設定

よく使用される設定のプリセットが用意されています：

```tsx
import { selectBoxPresets } from '@shared/ui';

// フォーム用設定
<SelectBox {...selectBoxPresets.form} options={options} />

// フィルター用設定
<SelectBox {...selectBoxPresets.filter} options={options} />

// 検索用設定
<SelectBox {...selectBoxPresets.search} options={options} />

// ステータス用設定
<SelectBox {...selectBoxPresets.status} options={options} />
```

## 使用例

### 基本的な使用例

```tsx
import { useState } from 'react';
import { SelectBox } from '@shared/ui';

const BasicExample = () => {
  const [value, setValue] = useState('');
  
  const options = [
    { value: 'option1', label: 'オプション1' },
    { value: 'option2', label: 'オプション2' },
    { value: 'option3', label: 'オプション3', disabled: true },
  ];

  return (
    <SelectBox
      value={value}
      onValueChange={setValue}
      placeholder="選択してください"
      options={options}
    />
  );
};
```

### アイコン・説明付きオプション

```tsx
import { Building2, MapPin, Wrench } from 'lucide-react';

const IconExample = () => {
  const options = [
    {
      value: 'factory',
      label: '工場A',
      description: '主要製造拠点',
      icon: <Building2 className="h-4 w-4" />,
      badge: { text: '稼働中', variant: 'default' as const }
    },
    {
      value: 'warehouse',
      label: '倉庫B',
      description: '物流センター',
      icon: <MapPin className="h-4 w-4" />,
      badge: { text: '点検中', variant: 'secondary' as const }
    },
  ];

  return (
    <SelectBox
      placeholder="場所を選択"
      options={options}
      showIcons={true}
      showDescriptions={true}
      showBadges={true}
    />
  );
};
```

### グループ化されたオプション

```tsx
const GroupedExample = () => {
  const groups = [
    {
      label: '生産設備',
      options: [
        { value: 'cnc1', label: 'CNCフライス盤 #1' },
        { value: 'cnc2', label: 'CNCフライス盤 #2' },
      ]
    },
    {
      label: '検査設備',
      options: [
        { value: 'qc1', label: '品質検査装置 #1' },
        { value: 'qc2', label: '品質検査装置 #2' },
      ]
    }
  ];

  return (
    <SelectBox
      placeholder="設備を選択"
      groups={groups}
    />
  );
};
```

### React Hook Form との統合

```tsx
import { useForm } from 'react-hook-form';
import { FormSelectBox } from '@shared/ui';

const FormExample = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="category"
        rules={{ required: 'カテゴリを選択してください' }}
        render={({ field }) => (
          <FormSelectBox
            {...field}
            placeholder="カテゴリを選択"
            options={categoryOptions}
            required={true}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
        )}
      />
    </form>
  );
};
```

## ベストプラクティス

1. **適切なバリアントの選択**: 用途に応じて専用バリアントを使用
2. **アクセシビリティ**: `aria-label` や `aria-describedby` を適切に設定
3. **パフォーマンス**: 大量のオプションには `maxDisplayItems` を設定
4. **一貫性**: プロジェクト全体で統一したスタイルガイドを使用
5. **エラーハンドリング**: フォーム用途では適切なバリデーションを実装

## マイグレーション

既存の select 要素や shadcn/ui Select からの移行：

### ネイティブ select から

```tsx
// Before
<select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="">選択してください</option>
  <option value="option1">オプション1</option>
</select>

// After
<SelectBox
  value={value}
  onValueChange={setValue}
  placeholder="選択してください"
  options={[
    { value: 'option1', label: 'オプション1' }
  ]}
/>
```

### shadcn/ui Select から

```tsx
// Before
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="選択してください" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">オプション1</SelectItem>
  </SelectContent>
</Select>

// After
<SelectBox
  value={value}
  onValueChange={setValue}
  placeholder="選択してください"
  options={[
    { value: 'option1', label: 'オプション1' }
  ]}
/>
```

この SelectBox コンポーネントにより、アプリケーション全体で一貫したセレクトボックス体験を提供できます。