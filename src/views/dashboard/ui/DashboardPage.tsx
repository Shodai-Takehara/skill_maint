'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';

import {
  Settings,
  Wrench,
  Clock,
  Users,
  CheckCircle,
  Calendar,
  ArrowRight,
  QrCode,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Progress } from '@shared/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/ui/dialog';

import { MainLayout } from '@widgets/layout';

interface WorkOrder {
  id: string;
  equipment: string;
  description: string;
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  createdAt: string;
}

interface InspectionCheckItem {
  id: string;
  category: string;
  item: string;
  checkMethod: string;
  standardValue?: string;
  notes?: string;
}

interface MaintenanceItem {
  id: string;
  equipment: string;
  type: string;
  dueDate: string;
  technician: string;
  template?: {
    name: string;
    description: string;
    checkItems: InspectionCheckItem[];
    estimatedTime: number;
    requiredTools: string[];
    safetyNotes: string[];
  };
}

function DashboardPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<
    MaintenanceItem[]
  >([]);
  const [selectedInspection, setSelectedInspection] = useState<MaintenanceItem | null>(null);

  useEffect(() => {
    setWorkOrders([
      {
        id: 'WO-001',
        equipment: 'CNCフライス盤 #3',
        description: '冷却液ポンプの異音',
        priority: 'urgent',
        status: 'in-progress',
        assignee: '田中 太郎',
        createdAt: '2024-12-30T09:30:00',
      },
      {
        id: 'WO-002',
        equipment: 'プレス機 #7',
        description: '油圧シリンダーの点検',
        priority: 'normal',
        status: 'pending',
        assignee: '佐藤 花子',
        createdAt: '2024-12-30T08:15:00',
      },
      {
        id: 'WO-003',
        equipment: 'コンベア #2',
        description: 'ベルト交換',
        priority: 'normal',
        status: 'completed',
        assignee: '山田 一郎',
        createdAt: '2024-12-29T14:20:00',
      },
    ]);

    setMaintenanceSchedule([
      {
        id: 'M-001',
        equipment: 'CNCフライス盤 #1',
        type: '定期点検',
        dueDate: '2025-01-05',
        technician: '田中 太郎',
        template: {
          name: 'CNCフライス盤定期点検テンプレート',
          description: 'CNCフライス盤の月次定期点検を実施します。',
          estimatedTime: 120,
          requiredTools: ['デジタルノギス', '振動測定器', '温度計', '潤滑油'],
          safetyNotes: [
            '作業前に電源を完全に切断してください',
            '保護具（安全眼鏡、手袋）を着用してください',
            '作業完了後は清掃を行ってください'
          ],
          checkItems: [
            {
              id: 'C-001',
              category: '外観確認',
              item: 'フレーム・ガイドウェイの損傷確認',
              checkMethod: '目視点検',
              standardValue: '亀裂・変形なし',
              notes: 'カバー類も含めて確認'
            },
            {
              id: 'C-002',
              category: '潤滑系統',
              item: '潤滑油レベル確認',
              checkMethod: 'レベルゲージ確認',
              standardValue: '規定範囲内',
              notes: '不足時は指定油種で補充'
            },
            {
              id: 'C-003',
              category: '動作確認',
              item: 'X軸・Y軸・Z軸の動作確認',
              checkMethod: '手動運転',
              standardValue: 'スムーズな動作',
              notes: '異音・振動がないことを確認'
            },
            {
              id: 'C-004',
              category: '精度確認',
              item: '位置決め精度測定',
              checkMethod: 'ダイヤルゲージ測定',
              standardValue: '±0.01mm以内',
              notes: '各軸で3点測定し平均値を記録'
            },
            {
              id: 'C-005',
              category: '安全装置',
              item: '非常停止ボタン動作確認',
              checkMethod: '機能テスト',
              standardValue: '正常動作',
              notes: '全ての非常停止ボタンを確認'
            }
          ]
        }
      },
      {
        id: 'M-002',
        equipment: 'プレス機 #5',
        type: 'オイル交換',
        dueDate: '2025-01-07',
        technician: '佐藤 花子',
        template: {
          name: 'プレス機オイル交換テンプレート',
          description: 'プレス機の油圧オイル交換作業を実施します。',
          estimatedTime: 90,
          requiredTools: ['オイルポンプ', '廃油受けタンク', 'フィルター', '新油20L'],
          safetyNotes: [
            '高圧配管に注意してください',
            '廃油の適切な処理を実施してください',
            '作業中は他の作業者の接近を制限してください'
          ],
          checkItems: [
            {
              id: 'C-006',
              category: '事前確認',
              item: '現在のオイル状態確認',
              checkMethod: '目視・臭気確認',
              standardValue: '劣化状況を記録'
            },
            {
              id: 'C-007',
              category: 'オイル交換',
              item: '古いオイルの抜き取り',
              checkMethod: 'ドレンプラグ開放',
              standardValue: '完全排出'
            },
            {
              id: 'C-008',
              category: 'フィルター交換',
              item: 'オイルフィルター交換',
              checkMethod: '新品フィルターと交換',
              standardValue: '適正トルクで締付'
            }
          ]
        }
      },
      {
        id: 'M-003',
        equipment: '溶接機 #3',
        type: '安全点検',
        dueDate: '2025-01-10',
        technician: '山田 一郎',
        template: {
          name: '溶接機安全点検テンプレート',
          description: '溶接機の安全機能および絶縁性能の点検を実施します。',
          estimatedTime: 60,
          requiredTools: ['絶縁抵抗計', 'テスター', '接地抵抗計'],
          safetyNotes: [
            '電気作業のため、電気取扱者が実施してください',
            '測定前に電源を切断してください',
            '湿気の多い環境では作業を避けてください'
          ],
          checkItems: [
            {
              id: 'C-009',
              category: '電気安全',
              item: '絶縁抵抗測定',
              checkMethod: '絶縁抵抗計による測定',
              standardValue: '1MΩ以上',
              notes: '1次-2次間、1次-アース間を測定'
            },
            {
              id: 'C-010',
              category: '接地確認',
              item: '保護接地の導通確認',
              checkMethod: 'テスターによる導通確認',
              standardValue: '1Ω以下'
            }
          ]
        }
      },
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-500 text-white';
      case 'urgent':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return '緊急';
      case 'urgent':
        return '至急';
      default:
        return '通常';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '作業中';
      default:
        return '待機中';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ダッシュボードタイトル */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ダッシュボード
          </h2>
          <p className="text-gray-600 font-medium">
            製造設備の保守状況とチームパフォーマンスの概要
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    総設備数
                  </p>
                  <p className="text-3xl font-bold text-gray-900">42</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <Settings className="h-8 w-8 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    アクティブ作業指示
                  </p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-2xl">
                  <Wrench className="h-8 w-8 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    保守完了率
                  </p>
                  <p className="text-3xl font-bold text-gray-900">94%</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <CheckCircle className="h-8 w-8 text-emerald-700" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={94} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    チームスキルカバレッジ
                  </p>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Users className="h-8 w-8 text-purple-700" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={87} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最新作業指示 */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50">
            <CardHeader className="border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900">
                  最新作業指示
                </CardTitle>
                <Link href="/work-orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
                  >
                    すべて表示 <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100/50">
                {workOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {order.equipment}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          {order.description}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          担当: {order.assignee}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          className={`${getPriorityColor(order.priority)} font-medium`}
                        >
                          {getPriorityText(order.priority)}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(order.status)} font-medium`}
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 今後の保守スケジュール */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50">
            <CardHeader className="border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900">
                  今後の保守スケジュール
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
                >
                  スケジュール表示 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100/50">
                {maintenanceSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.equipment}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          {item.type}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          担当: {item.technician}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-900 mb-1 font-medium">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.dueDate).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium border-gray-300 text-gray-600"
                        >
                          {Math.ceil(
                            (new Date(item.dueDate).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                          日後
                        </Badge>
                      </div>
                    </div>
                    {item.template && (
                      <div className="mt-3 pt-3 border-t border-gray-100/50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                          onClick={() => setSelectedInspection(item)}
                        >
                          詳細を見る
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクション */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            クイックアクション
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/work-orders/new">
              <Button className="w-full h-20 bg-gray-900 hover:bg-gray-800 text-white flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Wrench className="h-6 w-6" />
                <span className="text-sm font-semibold">新規作業指示</span>
              </Button>
            </Link>
            <Link href="/equipment/scan">
              <Button className="w-full h-20 bg-gray-900 hover:bg-gray-800 text-white flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                <QrCode className="h-6 w-6" />
                <span className="text-sm font-semibold">QRスキャン</span>
              </Button>
            </Link>
            <Link href="/equipment">
              <Button className="w-full h-20 bg-gray-900 hover:bg-gray-800 text-white flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Calendar className="h-6 w-6" />
                <span className="text-sm font-semibold">設備一覧</span>
              </Button>
            </Link>
            <Link href="/team">
              <Button className="w-full h-20 bg-gray-900 hover:bg-gray-800 text-white flex flex-col items-center justify-center space-y-2 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                <Users className="h-6 w-6" />
                <span className="text-sm font-semibold">チーム管理</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 点検詳細モーダル */}
        {selectedInspection && selectedInspection.template && (
          <Dialog 
            open={selectedInspection !== null} 
            onOpenChange={(open) => !open && setSelectedInspection(null)}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {selectedInspection.template.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">基本情報</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">対象設備</p>
                      <p className="font-medium text-gray-900">{selectedInspection.equipment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">作業種別</p>
                      <p className="font-medium text-gray-900">{selectedInspection.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">担当者</p>
                      <p className="font-medium text-gray-900">{selectedInspection.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">予定日</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedInspection.dueDate).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">予想作業時間</p>
                      <p className="font-medium text-gray-900">{selectedInspection.template.estimatedTime}分</p>
                    </div>
                  </div>
                  {selectedInspection.template.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">作業概要</p>
                      <p className="text-gray-900">{selectedInspection.template.description}</p>
                    </div>
                  )}
                </div>

                {/* 安全注意事項 */}
                {selectedInspection.template.safetyNotes.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">重要</span>
                      安全注意事項
                    </h3>
                    <ul className="space-y-2">
                      {selectedInspection.template.safetyNotes.map((note, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 text-lg mr-2">•</span>
                          <span className="text-red-800 text-sm">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 必要工具 */}
                {selectedInspection.template.requiredTools.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">必要工具・部品</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInspection.template.requiredTools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 点検項目 */}
                {selectedInspection.template.checkItems.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">点検項目</h3>
                    <div className="space-y-4">
                      {selectedInspection.template.checkItems.map((checkItem) => (
                        <div key={checkItem.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {checkItem.category}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {checkItem.item}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">方法:</span> {checkItem.checkMethod}
                              </p>
                              {checkItem.standardValue && (
                                <p className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">基準値:</span> {checkItem.standardValue}
                                </p>
                              )}
                              {checkItem.notes && (
                                <p className="text-xs text-gray-500">
                                  <span className="font-medium">備考:</span> {checkItem.notes}
                                </p>
                              )}
                            </div>
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
export default DashboardPage;
