'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Copy, Edit, Eye, Plus, Search, Settings, Trash2 } from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';

import { MainLayout } from '@widgets/layout';

interface InspectionCheckItem {
  id: string;
  category: string;
  item: string;
  checkMethod: string;
  standardValue?: string;
  notes?: string;
  order: number; // 点検順序
}

interface EquipmentSection {
  id: string;
  name: string;
  description?: string;
  checkItems: InspectionCheckItem[];
  estimatedTime: number;
  requiredTools?: string[];
  order: number; // セクション順序
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
  templateType: 'equipment' | 'line' | 'area'; // テンプレートタイプ
  targetIds: string[]; // 対象設備IDまたはラインID
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastUsed?: string;
  usageCount: number;
}

export default function Templates() {
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] =
    useState<InspectionTemplate | null>(null);

  useEffect(() => {
    // サンプルテンプレートデータ
    const sampleTemplates: InspectionTemplate[] = [
      {
        id: 'temp-001',
        name: '第1ライン 後面日常点検テンプレート',
        description:
          '第1ライン後面部の日常点検を実施し、異常の早期発見と予防保全を行います。',
        targetArea: '後面',
        templateType: 'line',
        targetIds: ['line-001'],
        totalEstimatedTime: 45,
        commonTools: [
          'デジタルノギス',
          '温度計',
          '潤滑油',
          'ウエス',
          '懐中電灯',
        ],
        safetyNotes: [
          '点検前に必ず電源を切断してください',
          '回転部品に手を近づけないでください',
          '保護具（安全眼鏡、手袋）を着用してください',
          '高所作業時はヘルメットを着用してください',
        ],
        isActive: true,
        createdAt: '2024-12-01T09:00:00',
        updatedAt: '2024-12-25T14:30:00',
        createdBy: '管理者',
        lastUsed: '2024-12-30T08:00:00',
        usageCount: 127,
        sections: [
          {
            id: 'sec-001',
            name: '結束機',
            description: '結束機の動作確認と清掃',
            order: 1,
            estimatedTime: 12,
            requiredTools: ['グリス', 'エアーガン'],
            checkItems: [
              {
                id: 'C-001',
                category: '外観確認',
                item: '結束機本体の損傷確認',
                checkMethod: '目視点検',
                standardValue: '亀裂・変形・腐食なし',
                notes: 'カバー、ガードも含めて確認',
                order: 1,
              },
              {
                id: 'C-002',
                category: '動作確認',
                item: '結束モーター動作確認',
                checkMethod: '手動運転',
                standardValue: 'スムーズな動作、異音なし',
                notes: '異常振動の有無を確認',
                order: 2,
              },
              {
                id: 'C-003',
                category: '清掃・潤滑',
                item: '可動部の清掃と潤滑',
                checkMethod: '清掃後グリス塗布',
                standardValue: '汚れなし、適量グリス塗布',
                notes: '古いグリスは拭き取ってから新しいグリスを塗布',
                order: 3,
              },
            ],
          },
          {
            id: 'sec-002',
            name: 'リール',
            description: 'リールの巻き取り動作とテンション確認',
            order: 2,
            estimatedTime: 10,
            requiredTools: ['テンションメーター'],
            checkItems: [
              {
                id: 'C-004',
                category: 'テンション確認',
                item: 'リールテンション確認',
                checkMethod: 'テンションメーター測定',
                standardValue: '80-120N',
                notes: '規定値外の場合は調整必要',
                order: 1,
              },
              {
                id: 'C-005',
                category: '外観確認',
                item: 'リール表面の損傷確認',
                checkMethod: '目視点検',
                standardValue: '傷・毛羽立ちなし',
                notes: '特に縁部の状態を重点確認',
                order: 2,
              },
            ],
          },
          {
            id: 'sec-003',
            name: 'コイルカー',
            description: 'コイルカーの走行部とサスペンション確認',
            order: 3,
            estimatedTime: 8,
            requiredTools: ['グリス'],
            checkItems: [
              {
                id: 'C-006',
                category: '走行部確認',
                item: 'レールと車輪の確認',
                checkMethod: '目視点検と手動確認',
                standardValue: 'スムーズな動作、異音なし',
                notes: 'レールの清掃状態も確認',
                order: 1,
              },
            ],
          },
          {
            id: 'sec-004',
            name: 'ロール',
            description: 'ロールの回転動作とベアリング確認',
            order: 4,
            estimatedTime: 15,
            requiredTools: ['振動計', 'グリス'],
            checkItems: [
              {
                id: 'C-007',
                category: '振動確認',
                item: 'ロールベアリング振動測定',
                checkMethod: '振動計による測定',
                standardValue: '2.5mm/s以下',
                notes: '異常振動時はベアリング交換検討',
                order: 1,
              },
              {
                id: 'C-008',
                category: '潤滑確認',
                item: 'ベアリンググリス確認',
                checkMethod: '目視点検',
                standardValue: '適量グリス有り',
                notes: '不足時は補充、汚れ時は交換',
                order: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'temp-002',
        name: 'プレス機安全点検テンプレート',
        description:
          'プレス機の安全機能と操作部の点検を実施し、作業者の安全を確保します。',
        targetArea: '単一設備',
        templateType: 'equipment',
        targetIds: ['eq-002', 'eq-005'],
        totalEstimatedTime: 25,
        commonTools: ['テスター', 'メジャー', '清掃用具'],
        safetyNotes: [
          '点検中は他の作業者の接近を禁止してください',
          '高圧配管に注意してください',
          '作業前に非常停止ボタンの動作を確認してください',
        ],
        isActive: true,
        createdAt: '2024-11-15T10:30:00',
        updatedAt: '2024-12-20T16:45:00',
        createdBy: '安全管理者',
        lastUsed: '2024-12-28T07:30:00',
        usageCount: 89,
        sections: [
          {
            id: 'sec-005',
            name: '安全装置',
            description: 'プレス機の安全機能確認',
            order: 1,
            estimatedTime: 15,
            checkItems: [
              {
                id: 'C-009',
                category: '安全装置',
                item: '非常停止ボタン動作確認',
                checkMethod: '機能テスト',
                standardValue: '正常動作',
                notes: '全ての非常停止ボタンを確認',
                order: 1,
              },
              {
                id: 'C-010',
                category: '安全装置',
                item: 'ライトカーテン動作確認',
                checkMethod: '手動テスト',
                standardValue: '正常停止',
                notes: 'カーテンの整列状態も確認',
                order: 2,
              },
            ],
          },
          {
            id: 'sec-006',
            name: '油圧系統',
            description: '油圧システムの動作確認',
            order: 2,
            estimatedTime: 10,
            requiredTools: ['潤滑油'],
            checkItems: [
              {
                id: 'C-011',
                category: '油圧系統',
                item: '油圧プレッシャー確認',
                checkMethod: 'ゲージ読み取り',
                standardValue: '10-15MPa',
                notes: '異常音の有無も確認',
                order: 1,
              },
              {
                id: 'C-012',
                category: '油圧系統',
                item: '油漏れ確認',
                checkMethod: '目視点検',
                standardValue: '漏れなし',
                notes: 'ホース、ジョイント部を重点確認',
                order: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'temp-003',
        name: '第2ライン 前面日常点検テンプレート',
        description: '第2ライン前面部の日常点検テンプレート',
        targetArea: '前面',
        templateType: 'line',
        targetIds: ['line-002'],
        totalEstimatedTime: 35,
        commonTools: ['デジタルノギス', '温度計', '潤滑油'],
        safetyNotes: ['点検前に電源確認', '保護具着用'],
        isActive: true,
        createdAt: '2024-12-10T11:00:00',
        updatedAt: '2024-12-15T09:20:00',
        createdBy: '現場責任者',
        lastUsed: '2024-12-30T16:00:00',
        usageCount: 45,
        sections: [],
      },
    ];

    setTemplates(sampleTemplates);
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.targetArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'all' || template.templateType === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equipment':
        return 'bg-blue-100 text-blue-800';
      case 'line':
        return 'bg-green-100 text-green-800';
      case 'area':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'equipment':
        return '設備';
      case 'line':
        return 'ライン';
      case 'area':
        return 'エリア';
      default:
        return '不明';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              点検テンプレート管理
            </h1>
            <p className="text-gray-600 mt-2">
              点検テンプレートの作成・編集・管理を行います
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Link href="/templates/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新規テンプレート
              </Button>
            </Link>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    総テンプレート数
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {templates.length}
                  </p>
                </div>
                <Settings className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    アクティブ
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.filter((t) => t.isActive).length}
                  </p>
                </div>
                <Settings className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ライン用</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {templates.filter((t) => t.templateType === 'line').length}
                  </p>
                </div>
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">設備用</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      templates.filter((t) => t.templateType === 'equipment')
                        .length
                    }
                  </p>
                </div>
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="テンプレート名、説明で検索..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterType(e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">すべてのタイプ</option>
                <option value="equipment">設備用</option>
                <option value="line">ライン用</option>
                <option value="area">エリア用</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* テンプレート一覧 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(template.templateType)}>
                        {getTypeText(template.templateType)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.targetArea}
                      </Badge>
                      {template.isActive ? (
                        <Badge className="bg-green-500 text-white text-xs">
                          アクティブ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          非アクティブ
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">セクション数:</span>
                    <span className="ml-1 font-medium">
                      {template.sections.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">所要時間:</span>
                    <span className="ml-1 font-medium">
                      {template.totalEstimatedTime}分
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">使用回数:</span>
                    <span className="ml-1 font-medium">
                      {template.usageCount}回
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">最終使用:</span>
                    <span className="ml-1 font-medium">
                      {template.lastUsed
                        ? new Date(template.lastUsed).toLocaleDateString(
                            'ja-JP',
                            {
                              month: 'short',
                              day: 'numeric',
                            }
                          )
                        : '未使用'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      詳細
                    </Button>
                    <Link href={`/templates/${template.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        編集
                      </Button>
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      複製
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当するテンプレートがありません
            </h3>
            <p className="text-gray-600 mb-4">
              検索条件を変更するか、新しいテンプレートを作成してください。
            </p>
            <Link href="/templates/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新規テンプレート作成
              </Button>
            </Link>
          </div>
        )}

        {/* テンプレート詳細モーダル */}
        {selectedTemplate && (
          <Dialog
            open={selectedTemplate !== null}
            onOpenChange={(open) => !open && setSelectedTemplate(null)}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {selectedTemplate.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        テンプレート名
                      </p>
                      <p className="font-medium text-gray-900">
                        {selectedTemplate.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">対象エリア</p>
                      <p className="font-medium text-gray-900">
                        {selectedTemplate.targetArea}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        テンプレートタイプ
                      </p>
                      <Badge
                        className={getTypeColor(selectedTemplate.templateType)}
                      >
                        {getTypeText(selectedTemplate.templateType)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">所要時間</p>
                      <p className="font-medium text-gray-900">
                        {selectedTemplate.totalEstimatedTime}分
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">作成者</p>
                      <p className="font-medium text-gray-900">
                        {selectedTemplate.createdBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">使用回数</p>
                      <p className="font-medium text-gray-900">
                        {selectedTemplate.usageCount}回
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">説明</p>
                    <p className="text-gray-900">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>

                {/* 安全注意事項 */}
                {selectedTemplate.safetyNotes.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                        重要
                      </span>
                      安全注意事項
                    </h3>
                    <ul className="space-y-2">
                      {selectedTemplate.safetyNotes.map((note, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 text-lg mr-2">•</span>
                          <span className="text-red-800 text-sm">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 共通工具 */}
                {selectedTemplate.commonTools.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      共通工具・部品
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.commonTools.map(
                        (tool: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm"
                          >
                            {tool}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* セクション情報 */}
                {selectedTemplate.sections.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      セクション構成
                    </h3>
                    <div className="space-y-4">
                      {selectedTemplate.sections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                          <div
                            key={section.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {index + 1}. {section.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {section.estimatedTime}分
                              </Badge>
                            </div>
                            {section.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {section.description}
                              </p>
                            )}
                            <div className="text-sm text-gray-500">
                              点検項目: {section.checkItems.length}件
                              {section.requiredTools &&
                                section.requiredTools.length > 0 && (
                                  <span className="ml-4">
                                    専用工具: {section.requiredTools.join(', ')}
                                  </span>
                                )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}

