'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ArrowLeft, Plus, Trash2, Settings, Eye, Save } from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Textarea } from '@shared/ui/textarea';

import { MainLayout } from '@widgets/layout';

// フィールドタイプの定義
export type FieldType =
  | 'numeric'
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'temperature'
  | 'pressure'
  | 'photo'
  | 'pass_fail'
  | 'signature';

// フィールド設定の型定義
export interface InspectionField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required: boolean;

  // 数値系フィールド用設定
  minValue?: number;
  maxValue?: number;
  unit?: string;
  normalMin?: number;
  normalMax?: number;
  warningMin?: number;
  warningMax?: number;

  // 選択系フィールド用設定
  options?: string[];
  allowMultiple?: boolean;

  // 条件表示設定
  showWhen?: {
    fieldId: string;
    condition: 'equals' | 'greater' | 'less';
    value: string | number;
  };

  // デフォルト値
  defaultValue?: string | number | boolean;
}

// テンプレート設定の型定義
export interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  equipmentType: string;
  version: number;

  // シフト別設定
  shifts: {
    id: string;
    name: string;
    fields: InspectionField[];
  }[];

  // スケジュール設定
  schedules: {
    id: string;
    name: string;
    times: string[];
    shiftId: string;
    daysOfWeek: number[];
  }[];

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const FIELD_TYPES: {
  value: FieldType;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'numeric',
    label: '数値入力',
    description: '数値データの入力（閾値設定可能）',
    icon: '123',
  },
  {
    value: 'temperature',
    label: '温度計測',
    description: '温度の測定と正常範囲の設定',
    icon: '🌡️',
  },
  {
    value: 'pressure',
    label: '圧力計測',
    description: '圧力・流量・回転数等の測定',
    icon: '⚡',
  },
  {
    value: 'text',
    label: 'テキスト入力',
    description: '短いテキストの入力',
    icon: 'Aa',
  },
  {
    value: 'textarea',
    label: '長文入力',
    description: '詳細なコメントや説明の入力',
    icon: '📝',
  },
  {
    value: 'select',
    label: '選択肢',
    description: '単一または複数選択',
    icon: '☑️',
  },
  {
    value: 'pass_fail',
    label: '合否判定',
    description: '合格/不合格の二択判定',
    icon: '✓',
  },
  {
    value: 'photo',
    label: '写真撮影',
    description: '現場写真の撮影とアップロード',
    icon: '📷',
  },
  {
    value: 'signature',
    label: 'デジタル署名',
    description: '点検者のデジタル署名',
    icon: '✍️',
  },
];

export default function CreateTemplatePage() {
  const [template, setTemplate] = useState<Partial<InspectionTemplate>>({
    name: '',
    description: '',
    category: '',
    equipmentType: '',
    shifts: [
      {
        id: 'default',
        name: '標準点検',
        fields: [],
      },
    ],
    schedules: [],
  });

  const [activeShift, setActiveShift] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const addField = (type: FieldType) => {
    const newField: InspectionField = {
      id: `field_${Date.now()}`,
      type,
      label: `新しい${FIELD_TYPES.find((ft) => ft.value === type)?.label}`,
      required: false,
      ...(type === 'numeric' || type === 'temperature' || type === 'pressure'
        ? {
            unit:
              type === 'temperature' ? '℃' : type === 'pressure' ? 'kPa' : '',
            minValue: 0,
            maxValue: 100,
          }
        : {}),
      ...(type === 'select' || type === 'radio'
        ? {
            options: ['選択肢1', '選択肢2'],
            allowMultiple: type === 'select',
          }
        : {}),
    };

    const updatedShifts = [...(template.shifts || [])];
    updatedShifts[activeShift].fields.push(newField);

    setTemplate({ ...template, shifts: updatedShifts });
  };

  const updateField = (fieldId: string, updates: Partial<InspectionField>) => {
    const updatedShifts = [...(template.shifts || [])];
    const fieldIndex = updatedShifts[activeShift].fields.findIndex(
      (f) => f.id === fieldId
    );

    if (fieldIndex !== -1) {
      updatedShifts[activeShift].fields[fieldIndex] = {
        ...updatedShifts[activeShift].fields[fieldIndex],
        ...updates,
      };
      setTemplate({ ...template, shifts: updatedShifts });
    }
  };

  const removeField = (fieldId: string) => {
    const updatedShifts = [...(template.shifts || [])];
    updatedShifts[activeShift].fields = updatedShifts[
      activeShift
    ].fields.filter((f) => f.id !== fieldId);
    setTemplate({ ...template, shifts: updatedShifts });
  };

  const addShift = () => {
    const newShift = {
      id: `shift_${Date.now()}`,
      name: `シフト${(template.shifts?.length || 0) + 1}`,
      fields: [],
    };
    setTemplate({
      ...template,
      shifts: [...(template.shifts || []), newShift],
    });
  };

  const saveTemplate = () => {
    // テンプレート保存処理
    // TODO: 実際の保存処理を実装
    alert('テンプレートが保存されました！');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/templates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                テンプレート一覧に戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                点検テンプレート作成
              </h1>
              <p className="text-gray-600 mt-1">
                柔軟な点検項目を設定して、効率的な点検業務を実現
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              プレビュー
            </Button>
            <Button
              onClick={saveTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：基本設定 */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>基本設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">テンプレート名</Label>
                  <Input
                    id="name"
                    value={template.name}
                    onChange={(e) =>
                      setTemplate({ ...template, name: e.target.value })
                    }
                    placeholder="例：CNCフライス盤 日常点検"
                  />
                </div>
                <div>
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    value={template.description}
                    onChange={(e) =>
                      setTemplate({ ...template, description: e.target.value })
                    }
                    placeholder="このテンプレートの目的や使用方法を説明"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <select
                    id="category"
                    value={template.category}
                    onChange={(e) =>
                      setTemplate({ ...template, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">カテゴリを選択</option>
                    <option value="safety">安全点検</option>
                    <option value="daily">日常点検</option>
                    <option value="weekly">週次点検</option>
                    <option value="monthly">月次点検</option>
                    <option value="quality">品質点検</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="equipmentType">対象設備</Label>
                  <Input
                    id="equipmentType"
                    value={template.equipmentType}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        equipmentType: e.target.value,
                      })
                    }
                    placeholder="例：CNCフライス盤、プレス機"
                  />
                </div>
              </CardContent>
            </Card>

            {/* フィールドタイプ選択 */}
            <Card>
              <CardHeader>
                <CardTitle>点検項目を追加</CardTitle>
                <p className="text-sm text-gray-600">
                  下記から項目をクリックして追加、またはドラッグ&ドロップで配置
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {FIELD_TYPES.map((fieldType) => (
                    <div
                      key={fieldType.value}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      onClick={() => addField(fieldType.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{fieldType.icon}</span>
                        <div>
                          <div className="font-medium text-sm">
                            {fieldType.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {fieldType.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：フィールド設定エリア */}
          <div className="lg:col-span-2">
            {/* シフト切り替えタブ */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                {template.shifts?.map((shift, index) => (
                  <Button
                    key={shift.id}
                    variant={activeShift === index ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveShift(index)}
                  >
                    {shift.name}
                    <Badge variant="secondary" className="ml-2">
                      {shift.fields.length}
                    </Badge>
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addShift}>
                <Plus className="h-4 w-4 mr-1" />
                シフト追加
              </Button>
            </div>

            {/* フィールド一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {template.shifts?.[activeShift]?.name || '標準点検'} -
                  点検項目
                </CardTitle>
                <p className="text-sm text-gray-600">
                  点検項目をドラッグして並び替えできます
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {template.shifts?.[activeShift]?.fields.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">
                        左側から点検項目を追加してください
                      </p>
                    </div>
                  ) : (
                    template.shifts?.[activeShift]?.fields.map((field) => (
                      <FieldEditor
                        key={field.id}
                        field={field}
                        onUpdate={(updates) => updateField(field.id, updates)}
                        onRemove={() => removeField(field.id)}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// フィールド編集コンポーネント
interface FieldEditorProps {
  field: InspectionField;
  onUpdate: (updates: Partial<InspectionField>) => void;
  onRemove: () => void;
}

function FieldEditor({ field, onUpdate, onRemove }: FieldEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="outline">
              {FIELD_TYPES.find((ft) => ft.value === field.type)?.label}
            </Badge>
            <Input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="font-medium border-none p-0 h-auto bg-transparent focus:ring-0"
              placeholder="項目名を入力"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 基本設定 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="mr-2"
              />
              必須項目
            </Label>
          </div>
          <div>
            <Label htmlFor={`desc-${field.id}`}>説明</Label>
            <Input
              id={`desc-${field.id}`}
              value={field.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="この項目の説明"
            />
          </div>
        </div>

        {/* タイプ別設定 */}
        {(field.type === 'numeric' ||
          field.type === 'temperature' ||
          field.type === 'pressure') && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">数値設定</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`min-${field.id}`}>最小値</Label>
                <Input
                  id={`min-${field.id}`}
                  type="number"
                  value={field.minValue || ''}
                  onChange={(e) =>
                    onUpdate({ minValue: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`max-${field.id}`}>最大値</Label>
                <Input
                  id={`max-${field.id}`}
                  type="number"
                  value={field.maxValue || ''}
                  onChange={(e) =>
                    onUpdate({ maxValue: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`unit-${field.id}`}>単位</Label>
                <Input
                  id={`unit-${field.id}`}
                  value={field.unit || ''}
                  onChange={(e) => onUpdate({ unit: e.target.value })}
                  placeholder="℃, kPa, rpm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`normalMin-${field.id}`}>
                  正常範囲（下限）
                </Label>
                <Input
                  id={`normalMin-${field.id}`}
                  type="number"
                  value={field.normalMin || ''}
                  onChange={(e) =>
                    onUpdate({ normalMin: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`normalMax-${field.id}`}>
                  正常範囲（上限）
                </Label>
                <Input
                  id={`normalMax-${field.id}`}
                  type="number"
                  value={field.normalMax || ''}
                  onChange={(e) =>
                    onUpdate({ normalMax: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {(field.type === 'select' || field.type === 'radio') && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">選択肢設定</h4>
            <div className="space-y-2">
              {field.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[optionIndex] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = field.options?.filter(
                        (_, i) => i !== optionIndex
                      );
                      onUpdate({ options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(field.options || []), '新しい選択肢'];
                  onUpdate({ options: newOptions });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                選択肢追加
              </Button>
            </div>
          </div>
        )}

        {/* 詳細設定 */}
        {showAdvanced && (
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900">詳細設定</h4>
            <div>
              <Label htmlFor={`default-${field.id}`}>デフォルト値</Label>
              <Input
                id={`default-${field.id}`}
                value={field.defaultValue?.toString() || ''}
                onChange={(e) => onUpdate({ defaultValue: e.target.value })}
                placeholder="初期値を設定"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
