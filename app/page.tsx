'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MainLayout } from '@/components/layout/main-layout';
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
import Link from 'next/link';

interface WorkOrder {
  id: string;
  equipment: string;
  description: string;
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  createdAt: string;
}

interface MaintenanceItem {
  id: string;
  equipment: string;
  type: string;
  dueDate: string;
  technician: string;
}

export default function Dashboard() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<
    MaintenanceItem[]
  >([]);

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
      },
      {
        id: 'M-002',
        equipment: 'プレス機 #5',
        type: 'オイル交換',
        dueDate: '2025-01-07',
        technician: '佐藤 花子',
      },
      {
        id: 'M-003',
        equipment: '溶接機 #3',
        type: '安全点検',
        dueDate: '2025-01-10',
        technician: '山田 一郎',
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
      </div>
    </MainLayout>
  );
}
