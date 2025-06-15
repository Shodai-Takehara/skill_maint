'use client';

import { useEffect, useState } from 'react';

import { Factory, MapPin, Settings } from 'lucide-react';

import { SelectBox, SelectOption } from '@shared/ui';

interface LineSelectorProps {
  selectedLineId?: string;
  onLineSelect: (lineId: string, lineName: string) => void;
}

export function LineSelector({
  selectedLineId,
  onLineSelect,
}: LineSelectorProps) {
  const [organizationOptions, setOrganizationOptions] = useState<SelectOption[]>([]);

  // 組織データを平坦化してSelectOption形式に変換
  useEffect(() => {
    const flattenOrganizationData = (): SelectOption[] => {
      const options: SelectOption[] = [];

      // 工場データ
      const factories = [
        {
          id: 'factory-1',
          name: '第1工場',
          lines: [
            { id: 'line-1-1', name: 'A棟製造ライン' },
            { id: 'line-1-2', name: 'B棟製造ライン' },
            { id: 'line-1-3', name: 'C棟製造ライン' },
          ]
        },
        {
          id: 'factory-2',
          name: '第2工場',
          lines: [
            { id: 'line-2-1', name: 'プレス製造ライン' },
            { id: 'line-2-2', name: '自動化ライン' },
          ]
        },
        {
          id: 'factory-3',
          name: '第3工場',
          lines: [
            { id: 'line-3-1', name: '品質管理ライン' },
          ]
        }
      ];

      // 各工場とそのラインを展開
      factories.forEach((factory) => {
        // 工場レベル（選択不可、表示のみ）
        options.push({
          value: factory.id,
          label: factory.name,
          disabled: true,
          icon: <Factory className="h-4 w-4 text-gray-700" />,
          description: `${factory.lines.length}ライン`
        });

        // ラインレベル（選択可能）
        factory.lines.forEach((line) => {
          options.push({
            value: line.id,
            label: `　${line.name}`, // インデントで階層を表現
            icon: <MapPin className="h-4 w-4 text-gray-900" />,
            description: factory.name
          });
        });
      });

      return options;
    };

    setOrganizationOptions(flattenOrganizationData());
  }, []);

  const handleValueChange = (value: string) => {
    // 選択されたオプションを探す
    const selectedOption = organizationOptions.find(opt => opt.value === value);
    if (selectedOption && !selectedOption.disabled) {
      onLineSelect(value, selectedOption.label.trim()); // trimでインデント空白を除去
    }
  };

  return (
    <SelectBox
      value={selectedLineId}
      onValueChange={handleValueChange}
      placeholder="ラインを選択してください"
      options={organizationOptions}
      showIcons={true}
      showDescriptions={true}
      size="md"
      className="w-full"
      triggerClassName="h-10 px-4 border-gray-300 hover:bg-gray-50/80 rounded-xl font-semibold"
    />
  );
}
