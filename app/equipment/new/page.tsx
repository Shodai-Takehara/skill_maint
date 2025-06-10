'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  MapPin,
  Building,
  Layers,
  Settings,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Textarea } from '@shared/ui/textarea';

import { MainLayout } from '@widgets/layout';

// 既存ラインマスタデータ（上位で登録済み）
const LINES = [
  { id: 'GAPL', name: 'GAPLライン', location: 'G4棟', description: 'GAPL製造ライン' },
  { id: 'LINE1', name: '第1ライン', location: 'A1棟', description: '組立第1ライン' },
  { id: 'LINE2', name: '第2ライン', location: 'A2棟', description: '組立第2ライン' },
  { id: 'PRESS1', name: 'プレス1ライン', location: 'B1棟', description: 'プレス加工ライン1' },
  { id: 'PRESS2', name: 'プレス2ライン', location: 'B2棟', description: 'プレス加工ライン2' },
  { id: 'WELD', name: '溶接ライン', location: 'G5棟', description: '溶接専用ライン' },
];

// セクションマスタデータ
const SECTIONS = [
  { id: 'front', name: '前面', description: 'ライン前面部' },
  { id: 'rear', name: '後面', description: 'ライン後面部' },
  { id: 'center', name: '中央', description: 'ライン中央部' },
  { id: 'furnace', name: '炉部', description: '加熱炉・乾燥炉部' },
  { id: 'control', name: '制御部', description: '制御盤・操作盤部' },
  { id: 'utility', name: 'ユーティリティ', description: '電気・空気・水関連' },
];

// 設備詳細設定項目
interface EquipmentDetail {
  id: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
  required: boolean;
}

// 設備情報
interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  installDate: string;
  warrantyExpiry: string;
  specifications: string;
  details: EquipmentDetail[];
}

// セクション情報
interface Section {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  equipment: Equipment[];
}

// 設備登録情報
interface EquipmentRegistration {
  id: string;
  lineId: string;
  useSections: boolean; // セクション構造を使用するかどうか
  sections: Section[]; // セクション使用時
  equipment: Equipment[]; // セクション未使用時（直接ライン配下）
  createdAt: string;
  updatedAt: string;
}

export default function NewEquipmentPage() {
  const [registration, setRegistration] = useState<EquipmentRegistration>({
    id: '',
    lineId: '',
    useSections: false, // デフォルトはセクション構造なし
    sections: [],
    equipment: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 選択されたライン情報を取得
  const selectedLine = LINES.find((line) => line.id === registration.lineId);

  // セクション構造の切り替え
  const toggleSectionStructure = (useSections: boolean) => {
    setRegistration((prev) => ({
      ...prev,
      useSections,
      sections: useSections ? prev.sections : [],
      equipment: !useSections ? prev.equipment : [],
    }));
  };

  // セクション追加
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      sectionId: '',
      name: '',
      description: '',
      equipment: [],
    };
    setRegistration((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  // セクション削除
  const removeSection = (sectionId: string) => {
    setRegistration((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  // セクション更新
  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setRegistration((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));

    // セクションタイプが変更された場合、名前と説明を自動設定
    if (updates.sectionId) {
      const sectionMaster = SECTIONS.find((sm) => sm.id === updates.sectionId);
      if (sectionMaster) {
        setTimeout(() => {
          updateSection(sectionId, {
            name: sectionMaster.name,
            description: sectionMaster.description,
          });
        }, 0);
      }
    }
  };

  // 設備追加（セクション指定）
  const addEquipment = (sectionId?: string) => {
    const newEquipment: Equipment = {
      id: `equipment-${Date.now()}`,
      name: '新しい設備',
      model: '',
      serialNumber: '',
      manufacturer: '',
      installDate: '',
      warrantyExpiry: '',
      specifications: '',
      details: [],
    };

    if (sectionId) {
      // セクション配下に追加
      setRegistration((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? { ...s, equipment: [...s.equipment, newEquipment] }
            : s
        ),
      }));
    } else {
      // 直接ライン配下に追加
      setRegistration((prev) => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment],
      }));
    }
  };

  // 設備削除
  const removeEquipment = (equipmentId: string, sectionId?: string) => {
    if (sectionId) {
      // セクションから削除
      setRegistration((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                equipment: s.equipment.filter((e) => e.id !== equipmentId),
              }
            : s
        ),
      }));
    } else {
      // 直接ラインから削除
      setRegistration((prev) => ({
        ...prev,
        equipment: prev.equipment.filter((e) => e.id !== equipmentId),
      }));
    }
  };

  // 設備更新
  const updateEquipment = (
    equipmentId: string,
    updates: Partial<Equipment>,
    sectionId?: string
  ) => {
    if (sectionId) {
      // セクション内の設備を更新
      setRegistration((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                equipment: s.equipment.map((e) =>
                  e.id === equipmentId ? { ...e, ...updates } : e
                ),
              }
            : s
        ),
      }));
    } else {
      // 直接ラインの設備を更新
      setRegistration((prev) => ({
        ...prev,
        equipment: prev.equipment.map((e) =>
          e.id === equipmentId ? { ...e, ...updates } : e
        ),
      }));
    }
  };

  // 設備詳細設定項目追加
  const addEquipmentDetail = (equipmentId: string, sectionId?: string) => {
    const newDetail: EquipmentDetail = {
      id: `detail-${Date.now()}`,
      key: '',
      label: '新しい項目',
      value: '',
      type: 'text',
      required: false,
    };

    let existingDetails: EquipmentDetail[] = [];
    if (sectionId) {
      existingDetails = registration.sections
        .find((s) => s.id === sectionId)
        ?.equipment.find((e) => e.id === equipmentId)?.details || [];
    } else {
      existingDetails = registration.equipment
        .find((e) => e.id === equipmentId)?.details || [];
    }

    updateEquipment(equipmentId, {
      details: [...existingDetails, newDetail],
    }, sectionId);
  };

  // 設備詳細設定項目削除
  const removeEquipmentDetail = (
    equipmentId: string,
    detailId: string,
    sectionId?: string
  ) => {
    let equipment: Equipment | undefined;
    if (sectionId) {
      equipment = registration.sections
        .find((s) => s.id === sectionId)
        ?.equipment.find((e) => e.id === equipmentId);
    } else {
      equipment = registration.equipment.find((e) => e.id === equipmentId);
    }

    if (equipment) {
      updateEquipment(equipmentId, {
        details: equipment.details.filter((d) => d.id !== detailId),
      }, sectionId);
    }
  };

  // 設備詳細設定項目更新
  const updateEquipmentDetail = (
    equipmentId: string,
    detailId: string,
    updates: Partial<EquipmentDetail>,
    sectionId?: string
  ) => {
    let equipment: Equipment | undefined;
    if (sectionId) {
      equipment = registration.sections
        .find((s) => s.id === sectionId)
        ?.equipment.find((e) => e.id === equipmentId);
    } else {
      equipment = registration.equipment.find((e) => e.id === equipmentId);
    }

    if (equipment) {
      updateEquipment(equipmentId, {
        details: equipment.details.map((d) =>
          d.id === detailId ? { ...d, ...updates } : d
        ),
      }, sectionId);
    }
  };

  // 保存処理
  const saveEquipmentRegistration = () => {
    // 実際の保存処理をここに実装
    // TODO: 実際の保存処理を実装
    alert('設備情報を保存しました！');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/equipment">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                設備登録
              </h1>
              <p className="text-gray-600 mt-2">
                既存ラインに設備を柔軟に登録できます
              </p>
            </div>
          </div>
          <Button
            onClick={saveEquipmentRegistration}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: 基本設定 */}
          <div className="lg:col-span-1 space-y-6">
            {/* ライン選択 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  ライン選択
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="line">
                    対象ライン <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="line"
                    value={registration.lineId}
                    onChange={(e) =>
                      setRegistration((prev) => ({
                        ...prev,
                        lineId: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ラインを選択</option>
                    {LINES.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.name} - {line.location}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedLine && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-blue-800">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="font-medium">{selectedLine.name}</span>
                      </div>
                      <div className="text-sm text-blue-600">
                        {selectedLine.description}
                      </div>
                      <div className="text-xs text-blue-500">
                        ロケーション: {selectedLine.location}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* セクション構造設定 */}
            {registration.lineId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Layers className="h-5 w-5 mr-2" />
                    構造設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>設備構造</Label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="structure"
                          checked={!registration.useSections}
                          onChange={() => toggleSectionStructure(false)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">シンプル構造 (ライン → 設備)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="structure"
                          checked={registration.useSections}
                          onChange={() => toggleSectionStructure(true)}
                          className="text-blue-600"
                        />
                        <span className="text-sm">セクション構造 (ライン → セクション → 設備)</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600">
                      <div className="font-medium mb-1">構造イメージ:</div>
                      {registration.useSections ? (
                        <div>{selectedLine?.name} → セクション(前面/後面等) → 設備</div>
                      ) : (
                        <div>{selectedLine?.name} → 設備</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右側: 設備設定 */}
          <div className="lg:col-span-2">
            {!registration.lineId ? (
              <Card>
                <CardContent className="text-center py-12 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>まずラインを選択してください</p>
                </CardContent>
              </Card>
            ) : registration.useSections ? (
              // セクション構造
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Layers className="h-5 w-5 mr-2" />
                      セクション・設備構成
                    </CardTitle>
                    <Button onClick={addSection} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      セクション追加
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {registration.sections.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>セクションを追加して設備構成を設定してください</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {registration.sections.map((section, index) => (
                        <div
                          key={section.id}
                          className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                          {/* セクションヘッダー */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3 flex-1">
                              <Badge variant="outline" className="text-xs">
                                {index + 1}
                              </Badge>
                              <div className="grid grid-cols-2 gap-3 flex-1">
                                <div>
                                  <Label className="text-xs text-gray-600">
                                    セクションタイプ
                                  </Label>
                                  <select
                                    value={section.sectionId}
                                    onChange={(e) =>
                                      updateSection(section.id, {
                                        sectionId: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="">セクションを選択</option>
                                    {SECTIONS.map((sectionType) => (
                                      <option
                                        key={sectionType.id}
                                        value={sectionType.id}
                                      >
                                        {sectionType.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">
                                    セクション名
                                  </Label>
                                  <Input
                                    value={section.name}
                                    onChange={(e) =>
                                      updateSection(section.id, {
                                        name: e.target.value,
                                      })
                                    }
                                    className="text-sm"
                                    placeholder="カスタム名"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEquipment(section.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                設備追加
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeSection(section.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* セクション説明 */}
                          <div className="mb-4">
                            <Textarea
                              value={section.description}
                              onChange={(e) =>
                                updateSection(section.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="セクションの説明（任意）"
                              rows={2}
                              className="text-sm"
                            />
                          </div>

                          {/* 設備一覧 */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                              設備一覧
                            </h4>
                            {section.equipment.length === 0 ? (
                              <div className="text-center py-6 border border-dashed border-gray-300 rounded-md bg-gray-50">
                                <p className="text-sm text-gray-500">
                                  設備を追加してください
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {section.equipment.map((equipment) => (
                                  <EquipmentEditor
                                    key={equipment.id}
                                    equipment={equipment}
                                    sectionId={section.id}
                                    onUpdate={(updates) =>
                                      updateEquipment(
                                        equipment.id,
                                        updates,
                                        section.id
                                      )
                                    }
                                    onRemove={() =>
                                      removeEquipment(equipment.id, section.id)
                                    }
                                    onAddDetail={() =>
                                      addEquipmentDetail(equipment.id, section.id)
                                    }
                                    onRemoveDetail={(detailId) =>
                                      removeEquipmentDetail(
                                        equipment.id,
                                        detailId,
                                        section.id
                                      )
                                    }
                                    onUpdateDetail={(detailId, updates) =>
                                      updateEquipmentDetail(
                                        equipment.id,
                                        detailId,
                                        updates,
                                        section.id
                                      )
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              // シンプル構造（直接ライン配下）
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      設備一覧
                    </CardTitle>
                    <Button onClick={() => addEquipment()} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      設備追加
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {registration.equipment.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>設備を追加してください</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registration.equipment.map((equipment) => (
                        <EquipmentEditor
                          key={equipment.id}
                          equipment={equipment}
                          onUpdate={(updates) =>
                            updateEquipment(equipment.id, updates)
                          }
                          onRemove={() => removeEquipment(equipment.id)}
                          onAddDetail={() => addEquipmentDetail(equipment.id)}
                          onRemoveDetail={(detailId) =>
                            removeEquipmentDetail(equipment.id, detailId)
                          }
                          onUpdateDetail={(detailId, updates) =>
                            updateEquipmentDetail(equipment.id, detailId, updates)
                          }
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// 設備編集コンポーネント
interface EquipmentEditorProps {
  equipment: Equipment;
  sectionId?: string;
  onUpdate: (updates: Partial<Equipment>) => void;
  onRemove: () => void;
  onAddDetail: () => void;
  onRemoveDetail: (detailId: string) => void;
  onUpdateDetail: (detailId: string, updates: Partial<EquipmentDetail>) => void;
}

function EquipmentEditor({
  equipment,
  onUpdate,
  onRemove,
  onAddDetail,
  onRemoveDetail,
  onUpdateDetail,
}: EquipmentEditorProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
      <div className="flex items-start space-x-3">
        <div className="flex-1 space-y-3">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-gray-600">設備名</Label>
              <Input
                value={equipment.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="設備名"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">型式</Label>
              <Input
                value={equipment.model}
                onChange={(e) => onUpdate({ model: e.target.value })}
                placeholder="型式"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">メーカー</Label>
              <Input
                value={equipment.manufacturer}
                onChange={(e) => onUpdate({ manufacturer: e.target.value })}
                placeholder="メーカー"
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">シリアル番号</Label>
              <Input
                value={equipment.serialNumber}
                onChange={(e) => onUpdate({ serialNumber: e.target.value })}
                placeholder="シリアル番号"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">設置日</Label>
              <Input
                type="date"
                value={equipment.installDate}
                onChange={(e) => onUpdate({ installDate: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          {/* 詳細設定 */}
          {showDetails && (
            <div className="space-y-3 bg-white p-3 rounded border">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-sm">詳細設定</h5>
                <Button onClick={onAddDetail} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  項目追加
                </Button>
              </div>

              {equipment.details.map((detail) => (
                <div key={detail.id} className="flex items-center space-x-2">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <Input
                      value={detail.label}
                      onChange={(e) =>
                        onUpdateDetail(detail.id, { label: e.target.value })
                      }
                      placeholder="項目名"
                      className="text-xs"
                    />
                    <select
                      value={detail.type}
                      onChange={(e) =>
                        onUpdateDetail(detail.id, {
                          type: e.target.value as any,
                        })
                      }
                      className="px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      <option value="text">テキスト</option>
                      <option value="number">数値</option>
                      <option value="textarea">長文</option>
                      <option value="select">選択</option>
                    </select>
                    <Input
                      value={detail.value}
                      onChange={(e) =>
                        onUpdateDetail(detail.id, { value: e.target.value })
                      }
                      placeholder="値"
                      className="text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => onRemoveDetail(detail.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            size="sm"
            variant="ghost"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button onClick={onRemove} size="sm" variant="ghost" className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}