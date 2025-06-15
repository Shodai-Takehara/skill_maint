// 基本コンポーネント
export { SelectBox } from './SelectBox';
export type { SelectBoxProps, SelectOption, SelectGroup } from './SelectBox';

// バリアントコンポーネント
export {
  FormSelectBox,
  FilterSelectBox,
  StatusSelectBox,
  SearchableSelectBox,
  UserSelectBox,
  HierarchicalSelectBox,
} from './SelectBoxVariants';

// よく使用される設定のプリセット
export const selectBoxPresets = {
  // フォーム用の標準設定
  form: {
    size: 'md' as const,
    variant: 'default' as const,
    fullWidth: true,
    clearable: false,
    showIcons: true,
    showBadges: false,
  },
  
  // フィルター用の標準設定
  filter: {
    size: 'sm' as const,
    variant: 'outline' as const,
    fullWidth: false,
    clearable: true,
    showIcons: false,
    showBadges: false,
  },
  
  // 検索用の標準設定
  search: {
    size: 'md' as const,
    variant: 'default' as const,
    fullWidth: true,
    searchable: true,
    clearable: true,
    showIcons: true,
    showDescriptions: true,
  },
  
  // ステータス用の標準設定
  status: {
    size: 'md' as const,
    variant: 'default' as const,
    fullWidth: false,
    showBadges: true,
    showIcons: false,
  },
} as const;