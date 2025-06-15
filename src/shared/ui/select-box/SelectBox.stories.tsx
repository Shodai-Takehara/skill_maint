import { useState } from 'react';

import { Building2, MapPin, User, Wrench } from 'lucide-react';

import {
  SelectBox,
  FormSelectBox,
  FilterSelectBox,
  StatusSelectBox,
  SearchableSelectBox,
  UserSelectBox,
  HierarchicalSelectBox,
  SelectOption,
  SelectGroup,
} from './index';

// サンプルデータ
const basicOptions: SelectOption[] = [
  { value: 'option1', label: 'オプション1' },
  { value: 'option2', label: 'オプション2' },
  { value: 'option3', label: 'オプション3', disabled: true },
  { value: 'option4', label: 'オプション4' },
];

const optionsWithIcons: SelectOption[] = [
  { 
    value: 'factory', 
    label: '工場A', 
    icon: <Building2 className="h-4 w-4" />,
    description: '主要製造拠点'
  },
  { 
    value: 'warehouse', 
    label: '倉庫B', 
    icon: <MapPin className="h-4 w-4" />,
    description: '物流センター'
  },
  { 
    value: 'office', 
    label: 'オフィスC', 
    icon: <User className="h-4 w-4" />,
    description: '本社オフィス'
  },
];

const optionsWithBadges: SelectOption[] = [
  { 
    value: 'active', 
    label: 'アクティブ',
    badge: { text: '稼働中', variant: 'default' }
  },
  { 
    value: 'maintenance', 
    label: 'メンテナンス中',
    badge: { text: '停止', variant: 'destructive' }
  },
  { 
    value: 'standby', 
    label: 'スタンバイ',
    badge: { text: '待機', variant: 'secondary' }
  },
];

const groupedOptions: SelectGroup[] = [
  {
    label: '生産設備',
    options: [
      { value: 'cnc1', label: 'CNCフライス盤 #1', icon: <Wrench className="h-4 w-4" /> },
      { value: 'cnc2', label: 'CNCフライス盤 #2', icon: <Wrench className="h-4 w-4" /> },
    ]
  },
  {
    label: '検査設備',
    options: [
      { value: 'qc1', label: '品質検査装置 #1', icon: <Wrench className="h-4 w-4" /> },
      { value: 'qc2', label: '品質検査装置 #2', icon: <Wrench className="h-4 w-4" /> },
    ]
  }
];

const userList = [
  {
    id: 'user1',
    name: '田中 太郎',
    email: 'tanaka@example.com',
    role: 'エンジニア',
    isOnline: true
  },
  {
    id: 'user2',
    name: '佐藤 花子',
    email: 'sato@example.com',
    role: 'マネージャー',
    isOnline: false
  },
];

const statusList = [
  { value: 'normal', label: '正常', color: 'green' as const, description: '問題なし' },
  { value: 'warning', label: '警告', color: 'yellow' as const, description: '注意が必要' },
  { value: 'error', label: 'エラー', color: 'red' as const, description: '対応が必要' },
];

const hierarchyData = [
  { id: 'factory1', label: '工場A', level: 0 },
  { id: 'line1', label: 'ライン1', level: 1, parentId: 'factory1' },
  { id: 'section1', label: 'セクション1', level: 2, parentId: 'line1' },
  { id: 'section2', label: 'セクション2', level: 2, parentId: 'line1' },
  { id: 'line2', label: 'ライン2', level: 1, parentId: 'factory1' },
];

export function SelectBoxExamples() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [statusValue, setStatusValue] = useState<string>('');

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">SelectBox コンポーネント例</h1>
      
      {/* 基本的な使用例 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">基本的な使用例</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">基本セレクト</label>
            <SelectBox
              value={selectedValue}
              onValueChange={setSelectedValue}
              placeholder="選択してください"
              options={basicOptions}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">小さいサイズ</label>
            <SelectBox
              size="sm"
              placeholder="小さいセレクト"
              options={basicOptions}
            />
          </div>
        </div>
      </section>

      {/* アイコン付きオプション */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">アイコン・説明付きオプション</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">アイコン付き</label>
            <SelectBox
              placeholder="場所を選択"
              options={optionsWithIcons}
              showIcons={true}
              showDescriptions={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">バッジ付き</label>
            <SelectBox
              placeholder="ステータス選択"
              options={optionsWithBadges}
              showBadges={true}
            />
          </div>
        </div>
      </section>

      {/* グループ化されたオプション */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">グループ化されたオプション</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">設備選択</label>
          <SelectBox
            placeholder="設備を選択"
            groups={groupedOptions}
            showIcons={true}
          />
        </div>
      </section>

      {/* バリアントコンポーネント */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">用途別バリアント</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">フォーム用</label>
            <FormSelectBox
              placeholder="項目を選択"
              options={basicOptions}
              required={true}
              helperText="必須項目です"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">フィルター用</label>
            <FilterSelectBox
              value={filterValue}
              onValueChange={setFilterValue}
              placeholder="フィルター"
              options={basicOptions}
              showClearAll={true}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ステータス選択</label>
            <StatusSelectBox
              value={statusValue}
              onValueChange={setStatusValue}
              placeholder="ステータス選択"
              statuses={statusList}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">検索可能</label>
            <SearchableSelectBox
              placeholder="検索して選択"
              options={optionsWithIcons}
              searchPlaceholder="項目を検索..."
            />
          </div>
        </div>
      </section>

      {/* 特殊なバリアント */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">特殊なバリアント</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ユーザー選択</label>
            <UserSelectBox
              placeholder="担当者を選択"
              users={userList}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">階層選択</label>
            <HierarchicalSelectBox
              placeholder="組織を選択"
              hierarchy={hierarchyData}
            />
          </div>
        </div>
      </section>

      {/* 状態のバリエーション */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">状態のバリエーション</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">無効状態</label>
            <SelectBox
              placeholder="選択できません"
              options={basicOptions}
              disabled={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">読み込み中</label>
            <SelectBox
              placeholder="読み込み中..."
              options={[]}
              loading={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">クリア可能</label>
            <SelectBox
              placeholder="クリア可能"
              options={basicOptions}
              clearable={true}
              defaultValue="option1"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SelectBoxExamples;