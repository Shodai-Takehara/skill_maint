'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  QrCode,
  User,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
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
}

interface EquipmentSection {
  id: string;
  name: string;
  description?: string;
  checkItems: InspectionCheckItem[];
  estimatedTime: number; // セクション単位の所要時間（分）
  requiredTools?: string[]; // セクション固有の工具
}

interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  sections: EquipmentSection[]; // 設備セクション別の点検項目
  totalEstimatedTime: number; // 全体の所要時間
  commonTools: string[]; // 共通で必要な工具
  safetyNotes: string[];
  targetArea: string; // 対象エリア（例：前面、後面、中央、炉など）
}

interface ScheduledInspection {
  id: string;
  templateId: string;
  templateName: string;
  lineId?: string; // ライン単位での点検の場合
  lineName?: string;
  equipmentId?: string; // 単一設備での点検の場合
  equipmentName?: string;
  targetArea: string; // 点検対象エリア（前面、後面、中央、炉など）
  location: string;
  scheduledTime: string;
  shift: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number; // minutes
  lastCompleted?: string;
  completionRate?: number;
  template?: InspectionTemplate;
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<ScheduledInspection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedInspection, setSelectedInspection] =
    useState<ScheduledInspection | null>(null);

  useEffect(() => {
    // サンプル点検データ
    const sampleInspections: ScheduledInspection[] = [
      {
        id: 'insp-001',
        templateId: 'temp-001',
        templateName: '第1ライン 後面日常点検',
        lineId: 'line-001',
        lineName: '第1ライン',
        targetArea: '後面',
        location: '第1工場 A棟',
        scheduledTime: '08:00',
        shift: '朝番',
        status: 'pending',
        priority: 'high',
        estimatedDuration: 45,
        lastCompleted: '2024-12-29T08:00:00',
        completionRate: 95,
        template: {
          id: 'temp-001',
          name: '第1ライン 後面日常点検テンプレート',
          description:
            '第1ライン後面部の日常点検を実施し、異常の早期発見と予防保全を行います。',
          targetArea: '後面',
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
          sections: [
            {
              id: 'sec-001',
              name: '結束機',
              description: '結束機の動作確認と清掃',
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
                },
                {
                  id: 'C-002',
                  category: '動作確認',
                  item: '結束モーター動作確認',
                  checkMethod: '手動運転',
                  standardValue: 'スムーズな動作、異音なし',
                  notes: '異常振動の有無を確認',
                },
                {
                  id: 'C-003',
                  category: '清掃・潤滑',
                  item: '可動部の清掃と潤滑',
                  checkMethod: '清掃後グリス塗布',
                  standardValue: '汚れなし、適量グリス塗布',
                  notes: '古いグリスは拭き取ってから新しいグリスを塗布',
                },
              ],
            },
            {
              id: 'sec-002',
              name: 'リール',
              description: 'リールの巻き取り動作とテンション確認',
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
                },
                {
                  id: 'C-005',
                  category: '外観確認',
                  item: 'リール表面の損傷確認',
                  checkMethod: '目視点検',
                  standardValue: '傷・毛羽立ちなし',
                  notes: '特に縁部の状態を重点確認',
                },
              ],
            },
            {
              id: 'sec-003',
              name: 'コイルカー',
              description: 'コイルカーの走行部とサスペンション確認',
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
                },
              ],
            },
            {
              id: 'sec-004',
              name: 'ロール',
              description: 'ロールの回転動作とベアリング確認',
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
                },
                {
                  id: 'C-008',
                  category: '潤滑確認',
                  item: 'ベアリンググリス確認',
                  checkMethod: '目視点検',
                  standardValue: '適量グリス有り',
                  notes: '不足時は補充、汚れ時は交換',
                },
              ],
            },
          ],
        },
      },
      {
        id: 'insp-002',
        templateId: 'temp-002',
        templateName: 'プレス機 #7 安全点検',
        equipmentId: 'eq-002',
        equipmentName: 'プレス機 #7',
        targetArea: '単一設備',
        location: '第2工場 B棟',
        scheduledTime: '07:30',
        shift: '朝番',
        status: 'overdue',
        assignedTo: '田中 太郎',
        priority: 'high',
        estimatedDuration: 25,
        lastCompleted: '2024-12-28T07:30:00',
        completionRate: 88,
        template: {
          id: 'temp-002',
          name: 'プレス機安全点検テンプレート',
          description:
            'プレス機の安全機能と操作部の点検を実施し、作業者の安全を確保します。',
          targetArea: '単一設備',
          totalEstimatedTime: 25,
          commonTools: ['テスター', 'メジャー', '清掃用具'],
          safetyNotes: [
            '点検中は他の作業者の接近を禁止してください',
            '高圧配管に注意してください',
            '作業前に非常停止ボタンの動作を確認してください',
          ],
          sections: [
            {
              id: 'sec-005',
              name: '安全装置',
              description: 'プレス機の安全機能確認',
              estimatedTime: 15,
              checkItems: [
                {
                  id: 'C-009',
                  category: '安全装置',
                  item: '非常停止ボタン動作確認',
                  checkMethod: '機能テスト',
                  standardValue: '正常動作',
                  notes: '全ての非常停止ボタンを確認',
                },
                {
                  id: 'C-010',
                  category: '安全装置',
                  item: 'ライトカーテン動作確認',
                  checkMethod: '手動テスト',
                  standardValue: '正常停止',
                  notes: 'カーテンの整列状態も確認',
                },
              ],
            },
            {
              id: 'sec-006',
              name: '油圧系統',
              description: '油圧システムの動作確認',
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
                },
                {
                  id: 'C-012',
                  category: '油圧系統',
                  item: '油漏れ確認',
                  checkMethod: '目視点検',
                  standardValue: '漏れなし',
                  notes: 'ホース、ジョイント部を重点確認',
                },
              ],
            },
          ],
        },
      },
      {
        id: 'insp-003',
        templateId: 'temp-003',
        templateName: '第2ライン 前面日常点検',
        lineId: 'line-002',
        lineName: '第2ライン',
        targetArea: '前面',
        location: '第1工場 A棟',
        scheduledTime: '16:00',
        shift: '昼番',
        status: 'completed',
        assignedTo: '佐藤 花子',
        priority: 'medium',
        estimatedDuration: 35,
        lastCompleted: '2024-12-30T16:05:00',
        completionRate: 100,
      },
      {
        id: 'insp-004',
        templateId: 'temp-004',
        templateName: '溶接機 #5 品質点検',
        equipmentId: 'eq-004',
        equipmentName: '溶接機 #5',
        targetArea: '単一設備',
        location: '第1工場 C棟',
        scheduledTime: '14:00',
        shift: '昼番',
        status: 'in_progress',
        assignedTo: '山田 一郎',
        priority: 'medium',
        estimatedDuration: 25,
        lastCompleted: '2024-12-29T14:00:00',
        completionRate: 92,
      },
      {
        id: 'insp-005',
        templateId: 'temp-005',
        templateName: '第3ライン 炉部点検',
        lineId: 'line-003',
        lineName: '第3ライン',
        targetArea: '炉部',
        location: '第2工場 B棟',
        scheduledTime: '00:30',
        shift: '夜番',
        status: 'pending',
        priority: 'high',
        estimatedDuration: 60,
        lastCompleted: '2024-12-29T00:30:00',
        completionRate: 85,
      },
      {
        id: 'insp-006',
        templateId: 'temp-006',
        templateName: '第1ライン 中央部週次点検',
        lineId: 'line-001',
        lineName: '第1ライン',
        targetArea: '中央部',
        location: '第2工場 A棟',
        scheduledTime: '09:00',
        shift: '朝番',
        status: 'pending',
        priority: 'low',
        estimatedDuration: 90,
        lastCompleted: '2024-12-23T09:00:00',
        completionRate: 78,
      },
    ];

    setInspections(sampleInspections);
  }, []);

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      inspection.templateName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (inspection.equipmentName &&
        inspection.equipmentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (inspection.lineName &&
        inspection.lineName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.targetArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || inspection.status === filterStatus;
    const matchesShift =
      filterShift === 'all' || inspection.shift === filterShift;
    return matchesSearch && matchesStatus && matchesShift;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      case 'overdue':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in_progress':
        return '実行中';
      case 'overdue':
        return '期限超過';
      case 'pending':
        return '待機中';
      default:
        return '不明';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '-';
    }
  };

  const getTimeUntilDue = (scheduledTime: string) => {
    const now = new Date();
    const scheduled = new Date(`${selectedDate}T${scheduledTime}`);
    const diff = scheduled.getTime() - now.getTime();
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
    const minutes = Math.floor(
      (Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (diff < 0) {
      return `${hours}時間${minutes}分超過`;
    } else {
      return `${hours}時間${minutes}分後`;
    }
  };

  const statusCounts = {
    total: inspections.length,
    pending: inspections.filter((i) => i.status === 'pending').length,
    in_progress: inspections.filter((i) => i.status === 'in_progress').length,
    completed: inspections.filter((i) => i.status === 'completed').length,
    overdue: inspections.filter((i) => i.status === 'overdue').length,
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              今日の点検スケジュール
            </h1>
            <p className="text-gray-600 mt-2">
              {new Date(selectedDate).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <QrCode className="h-4 w-4 mr-2" />
              QRスキャン
            </Button>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総点検数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.total}
                  </p>
                </div>
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">待機中</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {statusCounts.pending}
                  </p>
                </div>
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">実行中</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {statusCounts.in_progress}
                  </p>
                </div>
                <User className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">完了</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statusCounts.completed}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">期限超過</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statusCounts.overdue}
                  </p>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="設備名、点検テンプレート名で検索..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-4"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterStatus(e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">すべてのステータス</option>
                <option value="pending">待機中</option>
                <option value="in_progress">実行中</option>
                <option value="completed">完了</option>
                <option value="overdue">期限超過</option>
              </select>
              <select
                value={filterShift}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilterShift(e.target.value)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">すべてのシフト</option>
                <option value="朝番">朝番</option>
                <option value="昼番">昼番</option>
                <option value="夜番">夜番</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 点検一覧 */}
        <div className="space-y-4">
          {filteredInspections.map((inspection) => (
            <Card
              key={inspection.id}
              className={`hover:shadow-md transition-shadow duration-200 ${
                inspection.status === 'overdue'
                  ? 'border-l-4 border-l-red-500'
                  : inspection.status === 'in_progress'
                    ? 'border-l-4 border-l-blue-500'
                    : inspection.status === 'completed'
                      ? 'border-l-4 border-l-green-500'
                      : 'border-l-4 border-l-yellow-500'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {inspection.equipmentName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {inspection.templateName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {inspection.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          className={getStatusBadgeColor(inspection.status)}
                        >
                          {getStatusText(inspection.status)}
                        </Badge>
                        <Badge
                          className={getPriorityBadgeColor(inspection.priority)}
                        >
                          優先度: {getPriorityText(inspection.priority)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>予定時刻: {inspection.scheduledTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>シフト: {inspection.shift}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>所要時間: {inspection.estimatedDuration}分</span>
                      </div>
                      {inspection.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>担当: {inspection.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    {inspection.lastCompleted && (
                      <div className="mt-3 text-sm text-gray-500">
                        前回完了:{' '}
                        {new Date(inspection.lastCompleted).toLocaleDateString(
                          'ja-JP',
                          {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                        {inspection.completionRate && (
                          <span className="ml-2">
                            (完了率: {inspection.completionRate}%)
                          </span>
                        )}
                      </div>
                    )}

                    {(inspection.status === 'pending' ||
                      inspection.status === 'overdue') && (
                      <div className="mt-2 text-sm font-medium">
                        <span
                          className={
                            inspection.status === 'overdue'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }
                        >
                          {getTimeUntilDue(inspection.scheduledTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col space-y-2 lg:w-40">
                      {inspection.status === 'pending' && (
                        <Link href={`/inspections/${inspection.id}/execute`}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            点検開始
                          </Button>
                        </Link>
                      )}
                      {inspection.status === 'in_progress' && (
                        <Link href={`/inspections/${inspection.id}/execute`}>
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            点検再開
                          </Button>
                        </Link>
                      )}
                      {inspection.status === 'completed' && (
                        <Link href={`/inspections/${inspection.id}/result`}>
                          <Button variant="outline" className="w-full">
                            結果確認
                          </Button>
                        </Link>
                      )}
                      {inspection.status === 'overdue' && (
                        <Link href={`/inspections/${inspection.id}/execute`}>
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            至急点検
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedInspection(inspection)}
                      >
                        詳細表示
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInspections.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する点検がありません
            </h3>
            <p className="text-gray-600">
              検索条件を変更するか、別の日付を選択してください。
            </p>
          </div>
        )}

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
                    {selectedInspection.equipmentName && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">対象設備</p>
                        <p className="font-medium text-gray-900">
                          {selectedInspection.equipmentName}
                        </p>
                      </div>
                    )}
                    {selectedInspection.lineName && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">対象ライン</p>
                        <p className="font-medium text-gray-900">
                          {selectedInspection.lineName}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">設置場所</p>
                      <p className="font-medium text-gray-900">
                        {selectedInspection.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        点検対象エリア
                      </p>
                      <p className="font-medium text-gray-900">
                        {selectedInspection.targetArea}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        点検テンプレート
                      </p>
                      <p className="font-medium text-gray-900">
                        {selectedInspection.templateName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">予定時刻</p>
                      <p className="font-medium text-gray-900">
                        {selectedInspection.scheduledTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">シフト</p>
                      <p className="font-medium text-gray-900">
                        {selectedInspection.shift}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">所要時間</p>
                      <p className="font-medium text-gray-900">
                        {selectedInspection.template.totalEstimatedTime}分
                      </p>
                    </div>
                    {selectedInspection.assignedTo && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">担当者</p>
                        <p className="font-medium text-gray-900">
                          {selectedInspection.assignedTo}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">優先度</p>
                      <Badge
                        className={getPriorityBadgeColor(
                          selectedInspection.priority
                        )}
                      >
                        {getPriorityText(selectedInspection.priority)}
                      </Badge>
                    </div>
                  </div>
                  {selectedInspection.template.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">点検概要</p>
                      <p className="text-gray-900">
                        {selectedInspection.template.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* 安全注意事項 */}
                {selectedInspection.template.safetyNotes.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                        重要
                      </span>
                      安全注意事項
                    </h3>
                    <ul className="space-y-2">
                      {selectedInspection.template.safetyNotes.map(
                        (note, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 text-lg mr-2">•</span>
                            <span className="text-red-800 text-sm">{note}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* 必要工具 */}
                {selectedInspection.template.commonTools.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      必要工具・部品
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInspection.template.commonTools.map(
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

                {/* 点検項目（セクション別） */}
                {selectedInspection.template.sections.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      点検項目（セクション別）
                    </h3>
                    <div className="space-y-6">
                      {selectedInspection.template.sections.map(
                        (section: EquipmentSection) => (
                          <div
                            key={section.id}
                            className="border border-gray-300 rounded-lg p-4 bg-white"
                          >
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {section.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  所要時間: {section.estimatedTime}分
                                </Badge>
                              </div>
                              {section.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {section.description}
                                </p>
                              )}
                              {section.requiredTools &&
                                section.requiredTools.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <span className="text-xs text-gray-500 mr-2">
                                      セクション専用工具:
                                    </span>
                                    {section.requiredTools.map(
                                      (tool: string, index: number) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {tool}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                            <div className="space-y-3">
                              {section.checkItems.map(
                                (checkItem: InspectionCheckItem) => (
                                  <div
                                    key={checkItem.id}
                                    className="border border-gray-100 rounded-md p-3 bg-gray-50"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {checkItem.category}
                                          </Badge>
                                        </div>
                                        <h5 className="font-medium text-gray-900 mb-1">
                                          {checkItem.item}
                                        </h5>
                                        <p className="text-sm text-gray-600 mb-2">
                                          <span className="font-medium">
                                            方法:
                                          </span>{' '}
                                          {checkItem.checkMethod}
                                        </p>
                                        {checkItem.standardValue && (
                                          <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-medium">
                                              基準値:
                                            </span>{' '}
                                            {checkItem.standardValue}
                                          </p>
                                        )}
                                        {checkItem.notes && (
                                          <p className="text-xs text-gray-500">
                                            <span className="font-medium">
                                              備考:
                                            </span>{' '}
                                            {checkItem.notes}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* 点検履歴情報 */}
                {(selectedInspection.lastCompleted ||
                  selectedInspection.completionRate) && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      点検履歴
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInspection.lastCompleted && (
                        <div>
                          <p className="text-sm text-blue-600 mb-1">
                            前回完了日時
                          </p>
                          <p className="font-medium text-blue-900">
                            {new Date(
                              selectedInspection.lastCompleted
                            ).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}
                      {selectedInspection.completionRate && (
                        <div>
                          <p className="text-sm text-blue-600 mb-1">
                            前回完了率
                          </p>
                          <p className="font-medium text-blue-900">
                            {selectedInspection.completionRate}%
                          </p>
                        </div>
                      )}
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
('use client');

import { cn, formatTime, getTimeUntilDue } from '@/lib/utils';
import { MoreVertical, Play, Search } from 'lucide-react';

interface Inspection {
  id: string;
  equipmentName: string;
  equipmentId: string;
  templateName: string;
  templateId: string;
  scheduledTime: string;
  estimatedDuration: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo?: string;
  location: string;
  lastCompleted?: string;
  completionRate?: number;
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockInspections: Inspection[] = [
      {
        id: '1',
        equipmentName: 'CNC Machine #3',
        equipmentId: 'CNC-003',
        templateName: 'Daily Safety Check',
        templateId: 'template-1',
        scheduledTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        estimatedDuration: 15,
        priority: 'high',
        status: 'overdue',
        assignedTo: 'John Smith',
        location: 'Floor A, Station 3',
        lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completionRate: 95,
      },
      {
        id: '2',
        equipmentName: 'Hydraulic Press #1',
        equipmentId: 'HP-001',
        templateName: 'Pressure System Check',
        templateId: 'template-2',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        estimatedDuration: 20,
        priority: 'high',
        status: 'pending',
        assignedTo: 'Sarah Johnson',
        location: 'Floor B, Station 1',
        lastCompleted: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        completionRate: 88,
      },
      {
        id: '3',
        equipmentName: 'Conveyor Belt #2',
        equipmentId: 'CB-002',
        templateName: 'Belt Tension Check',
        templateId: 'template-3',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 10,
        priority: 'medium',
        status: 'pending',
        location: 'Floor A, Station 5',
        lastCompleted: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        completionRate: 92,
      },
      {
        id: '4',
        equipmentName: 'Welding Station #4',
        equipmentId: 'WS-004',
        templateName: 'Gas Level Check',
        templateId: 'template-4',
        scheduledTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedDuration: 5,
        priority: 'low',
        status: 'completed',
        assignedTo: 'Mike Wilson',
        location: 'Floor C, Station 4',
        lastCompleted: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        completionRate: 100,
      },
    ];

    setInspections(mockInspections);
  }, []);

  useEffect(() => {
    let filtered = inspections;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.equipmentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          inspection.templateName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          inspection.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (inspection) => inspection.status === statusFilter
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(
        (inspection) => inspection.priority === priorityFilter
      );
    }

    setFilteredInspections(filtered);
  }, [inspections, searchTerm, statusFilter, priorityFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const todayStats = {
    total: inspections.length,
    completed: inspections.filter((i) => i.status === 'completed').length,
    overdue: inspections.filter((i) => i.status === 'overdue').length,
    pending: inspections.filter((i) => i.status === 'pending').length,
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Daily Inspections
            </h1>
            <p className="text-muted-foreground mt-2">
              Today's inspection schedule and progress
            </p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Link href="/inspections/quick">
              <Button>
                <QrCode className="h-4 w-4 mr-2" />
                Quick Scan
              </Button>
            </Link>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="text-2xl font-bold">{todayStats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-success">
                    {todayStats.completed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-warning">
                    {todayStats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Overdue
                  </p>
                  <p className="text-2xl font-bold text-danger">
                    {todayStats.overdue}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-danger" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment, templates, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspections List */}
        <div className="space-y-4">
          {filteredInspections.map((inspection) => (
            <Card
              key={inspection.id}
              className={cn(
                'transition-all hover:shadow-soft-lg',
                inspection.status === 'overdue' && 'border-danger'
              )}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {inspection.equipmentName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {inspection.templateName}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(inspection.status)}
                        {getPriorityBadge(inspection.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {inspection.status === 'overdue'
                            ? 'Overdue by '
                            : 'Due in '}
                          {getTimeUntilDue(inspection.scheduledTime)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{inspection.estimatedDuration} min</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{inspection.location}</span>
                      </div>

                      {inspection.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">
                            Assigned:
                          </span>
                          <span>{inspection.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    {inspection.lastCompleted && (
                      <div className="text-sm text-muted-foreground">
                        Last completed: {formatTime(inspection.lastCompleted)}
                        {inspection.completionRate && (
                          <span className="ml-2">
                            ({inspection.completionRate}% completion rate)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 lg:ml-6">
                    {inspection.status === 'pending' ||
                    inspection.status === 'overdue' ? (
                      <Button className="touch-target">
                        <Play className="h-4 w-4 mr-2" />
                        Start Inspection
                      </Button>
                    ) : inspection.status === 'in-progress' ? (
                      <Button variant="warning" className="touch-target">
                        <Clock className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                    ) : (
                      <Button variant="outline" className="touch-target">
                        View Results
                      </Button>
                    )}

                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInspections.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No inspections found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
