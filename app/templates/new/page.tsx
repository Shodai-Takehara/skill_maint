'use client';

import { useState } from 'react';

import Link from 'next/link';

// Temporarily commenting out drag and drop to fix import issue
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from '@hello-pangea/dnd';
import {
  Plus,
  Trash2,
  Settings,
  Save,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Textarea } from '@shared/ui/textarea';

import { MainLayout } from '@widgets/layout';

interface InspectionCheckItem {
  id: string;
  category: string;
  item: string;
  checkMethod: string;
  standardValue?: string;
  notes?: string;
  order: number;
}

interface EquipmentSection {
  id: string;
  name: string;
  description?: string;
  checkItems: InspectionCheckItem[];
  estimatedTime: number;
  requiredTools?: string[];
  order: number;
}

interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  sections: EquipmentSection[];
  totalEstimatedTime: number;
  commonTools: string[];
  safetyNotes: string[];
  targetArea: string;
  templateType: 'equipment' | 'line' | 'area';
  targetIds: string[];
  isActive: boolean;
}

export default function NewTemplatePage() {
  const [template, setTemplate] = useState<InspectionTemplate>({
    id: '',
    name: '',
    description: '',
    sections: [],
    totalEstimatedTime: 0,
    commonTools: [],
    safetyNotes: [],
    targetArea: '',
    templateType: 'line',
    targetIds: [],
    isActive: true,
  });

  const [newToolInput, setNewToolInput] = useState('');
  const [newSafetyNote, setNewSafetyNote] = useState('');

  // セクションの追加
  const addSection = () => {
    const newSection: EquipmentSection = {
      id: `section-${Date.now()}`,
      name: '新しいセクション',
      description: '',
      checkItems: [],
      estimatedTime: 0,
      requiredTools: [],
      order: template.sections.length + 1,
    };
    setTemplate((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  // セクションの削除
  const removeSection = (sectionId: string) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    updateTotalTime();
  };

  // セクション情報の更新
  const updateSection = (
    sectionId: string,
    updates: Partial<EquipmentSection>
  ) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
    if (updates.estimatedTime !== undefined) {
      updateTotalTime();
    }
  };

  // 点検項目の追加
  const addCheckItem = (sectionId: string) => {
    const newCheckItem: InspectionCheckItem = {
      id: `item-${Date.now()}`,
      category: '外観確認',
      item: '新しい点検項目',
      checkMethod: '目視点検',
      standardValue: '',
      notes: '',
      order: 1,
    };

    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              checkItems: [
                ...s.checkItems,
                {
                  ...newCheckItem,
                  order: s.checkItems.length + 1,
                },
              ],
            }
          : s
      ),
    }));
  };

  // 点検項目の削除
  const removeCheckItem = (sectionId: string, itemId: string) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              checkItems: s.checkItems.filter((item) => item.id !== itemId),
            }
          : s
      ),
    }));
  };

  // 点検項目の更新
  const updateCheckItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<InspectionCheckItem>
  ) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              checkItems: s.checkItems.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : s
      ),
    }));
  };

  // 共通工具の追加
  const addCommonTool = () => {
    if (newToolInput.trim()) {
      setTemplate((prev) => ({
        ...prev,
        commonTools: [...prev.commonTools, newToolInput.trim()],
      }));
      setNewToolInput('');
    }
  };

  // 共通工具の削除
  const removeCommonTool = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      commonTools: prev.commonTools.filter((_, i) => i !== index),
    }));
  };

  // 安全注意事項の追加
  const addSafetyNote = () => {
    if (newSafetyNote.trim()) {
      setTemplate((prev) => ({
        ...prev,
        safetyNotes: [...prev.safetyNotes, newSafetyNote.trim()],
      }));
      setNewSafetyNote('');
    }
  };

  // 安全注意事項の削除
  const removeSafetyNote = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      safetyNotes: prev.safetyNotes.filter((_, i) => i !== index),
    }));
  };

  // 総所要時間の更新
  const updateTotalTime = () => {
    const total = template.sections.reduce(
      (sum, section) => sum + section.estimatedTime,
      0
    );
    setTemplate((prev) => ({ ...prev, totalEstimatedTime: total }));
  };

  // セクション並び替え（上下ボタン版）
  const moveSectionUp = (sectionId: string) => {
    const sectionIndex = template.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex <= 0) return;

    const newSections = [...template.sections];
    [newSections[sectionIndex - 1], newSections[sectionIndex]] = [
      newSections[sectionIndex],
      newSections[sectionIndex - 1],
    ];

    // 順序を更新
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setTemplate((prev) => ({ ...prev, sections: updatedSections }));
  };

  const moveSectionDown = (sectionId: string) => {
    const sectionIndex = template.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex >= template.sections.length - 1) return;

    const newSections = [...template.sections];
    [newSections[sectionIndex], newSections[sectionIndex + 1]] = [
      newSections[sectionIndex + 1],
      newSections[sectionIndex],
    ];

    // 順序を更新
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setTemplate((prev) => ({ ...prev, sections: updatedSections }));
  };

  // 点検項目並び替え（上下ボタン版）
  const moveCheckItemUp = (sectionId: string, itemId: string) => {
    const section = template.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const itemIndex = section.checkItems.findIndex(
      (item) => item.id === itemId
    );
    if (itemIndex <= 0) return;

    const newItems = [...section.checkItems];
    [newItems[itemIndex - 1], newItems[itemIndex]] = [
      newItems[itemIndex],
      newItems[itemIndex - 1],
    ];

    // 順序を更新
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, checkItems: updatedItems } : s
      ),
    }));
  };

  const moveCheckItemDown = (sectionId: string, itemId: string) => {
    const section = template.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const itemIndex = section.checkItems.findIndex(
      (item) => item.id === itemId
    );
    if (itemIndex >= section.checkItems.length - 1) return;

    const newItems = [...section.checkItems];
    [newItems[itemIndex], newItems[itemIndex + 1]] = [
      newItems[itemIndex + 1],
      newItems[itemIndex],
    ];

    // 順序を更新
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, checkItems: updatedItems } : s
      ),
    }));
  };

  // テンプレート保存
  const saveTemplate = () => {
    // 実際の保存処理をここに実装
    // TODO: 実際の保存処理を実装
    alert('テンプレートを保存しました！');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                新規テンプレート作成
              </h1>
              <p className="text-gray-600 mt-2">
                点検テンプレートを柔軟に設定できます
              </p>
            </div>
          </div>
          <Button
            onClick={saveTemplate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: 基本設定 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    テンプレート名 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={template.name}
                    onChange={(e) =>
                      setTemplate((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="例: 第1ライン 後面日常点検"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明 <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={template.description}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="テンプレートの目的と概要を入力してください"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    テンプレートタイプ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={template.templateType}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        templateType: e.target.value as
                          | 'equipment'
                          | 'line'
                          | 'area',
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="line">ライン</option>
                    <option value="equipment">設備</option>
                    <option value="area">エリア</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    対象エリア <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={template.targetArea}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        targetArea: e.target.value,
                      }))
                    }
                    placeholder="例: 後面、前面、中央、炉部"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">総所要時間:</span>
                    <span className="font-semibold text-blue-600">
                      {template.totalEstimatedTime}分
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 共通工具 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  共通工具・部品
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newToolInput}
                    onChange={(e) => setNewToolInput(e.target.value)}
                    placeholder="工具名を入力"
                    onKeyDown={(e) => e.key === 'Enter' && addCommonTool()}
                  />
                  <Button onClick={addCommonTool} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.commonTools.map((tool, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tool}
                      <button
                        onClick={() => removeCommonTool(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 安全注意事項 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  安全注意事項
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSafetyNote}
                    onChange={(e) => setNewSafetyNote(e.target.value)}
                    placeholder="安全注意事項を入力"
                    onKeyDown={(e) => e.key === 'Enter' && addSafetyNote()}
                  />
                  <Button onClick={addSafetyNote} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {template.safetyNotes.map((note, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-red-50 rounded-md"
                    >
                      <span className="text-red-500 text-sm mt-0.5">•</span>
                      <span className="flex-1 text-sm text-red-800">
                        {note}
                      </span>
                      <button
                        onClick={() => removeSafetyNote(index)}
                        className="hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側: セクション設定 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    セクション構成
                  </CardTitle>
                  <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    セクション追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {template.sections.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>セクションを追加して点検項目を設定してください</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {template.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section, index) => (
                        <div
                          key={section.id}
                          className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                          {/* セクションヘッダー */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex flex-col space-y-1">
                                <button
                                  onClick={() => moveSectionUp(section.id)}
                                  disabled={index === 0}
                                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => moveSectionDown(section.id)}
                                  disabled={
                                    index === template.sections.length - 1
                                  }
                                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                >
                                  ↓
                                </button>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {index + 1}
                              </Badge>
                              <Input
                                value={section.name}
                                onChange={(e) =>
                                  updateSection(section.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="font-semibold"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={section.estimatedTime}
                                onChange={(e) =>
                                  updateSection(section.id, {
                                    estimatedTime:
                                      parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20 text-center"
                                placeholder="分"
                              />
                              <span className="text-sm text-gray-500">分</span>
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
                              value={section.description || ''}
                              onChange={(e) =>
                                updateSection(section.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="セクションの説明（任意）"
                              rows={2}
                            />
                          </div>

                          {/* 点検項目 */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                点検項目
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addCheckItem(section.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                項目追加
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {section.checkItems
                                .sort((a, b) => a.order - b.order)
                                .map((item, itemIndex) => (
                                  <div
                                    key={item.id}
                                    className="border border-gray-100 rounded-md p-3 bg-gray-50"
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="flex flex-col space-y-1 mt-2">
                                        <button
                                          onClick={() =>
                                            moveCheckItemUp(section.id, item.id)
                                          }
                                          disabled={itemIndex === 0}
                                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                                        >
                                          ↑
                                        </button>
                                        <button
                                          onClick={() =>
                                            moveCheckItemDown(
                                              section.id,
                                              item.id
                                            )
                                          }
                                          disabled={
                                            itemIndex ===
                                            section.checkItems.length - 1
                                          }
                                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                                        >
                                          ↓
                                        </button>
                                      </div>
                                      <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                              カテゴリ
                                            </label>
                                            <select
                                              value={item.category}
                                              onChange={(e) =>
                                                updateCheckItem(
                                                  section.id,
                                                  item.id,
                                                  {
                                                    category: e.target.value,
                                                  }
                                                )
                                              }
                                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                            >
                                              <option value="外観確認">
                                                外観確認
                                              </option>
                                              <option value="動作確認">
                                                動作確認
                                              </option>
                                              <option value="清掃・潤滑">
                                                清掃・潤滑
                                              </option>
                                              <option value="安全装置">
                                                安全装置
                                              </option>
                                              <option value="計測・測定">
                                                計測・測定
                                              </option>
                                              <option value="その他">
                                                その他
                                              </option>
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                              点検方法
                                            </label>
                                            <Input
                                              value={item.checkMethod}
                                              onChange={(e) =>
                                                updateCheckItem(
                                                  section.id,
                                                  item.id,
                                                  {
                                                    checkMethod: e.target.value,
                                                  }
                                                )
                                              }
                                              placeholder="例: 目視点検"
                                              className="text-sm"
                                            />
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            点検項目
                                          </label>
                                          <Input
                                            value={item.item}
                                            onChange={(e) =>
                                              updateCheckItem(
                                                section.id,
                                                item.id,
                                                {
                                                  item: e.target.value,
                                                }
                                              )
                                            }
                                            placeholder="具体的な点検項目を入力"
                                            className="text-sm"
                                          />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                              基準値（任意）
                                            </label>
                                            <Input
                                              value={item.standardValue || ''}
                                              onChange={(e) =>
                                                updateCheckItem(
                                                  section.id,
                                                  item.id,
                                                  {
                                                    standardValue:
                                                      e.target.value,
                                                  }
                                                )
                                              }
                                              placeholder="例: 規定範囲内"
                                              className="text-sm"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                              備考（任意）
                                            </label>
                                            <Input
                                              value={item.notes || ''}
                                              onChange={(e) =>
                                                updateCheckItem(
                                                  section.id,
                                                  item.id,
                                                  {
                                                    notes: e.target.value,
                                                  }
                                                )
                                              }
                                              placeholder="注意点など"
                                              className="text-sm"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          removeCheckItem(section.id, item.id)
                                        }
                                        className="text-red-600 hover:text-red-700 mt-2"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {section.checkItems.length === 0 && (
                              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-md">
                                <p className="text-sm">
                                  点検項目を追加してください
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
