'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/layout/main-layout';
import {
  Search,
  Plus,
  Settings,
  Calendar,
  Clock,
  User,
  Filter,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

interface WorkOrder {
  id: string;
  equipment: string;
  location: string;
  description: string;
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignee: string;
  reporter: string;
  createdAt: string;
  dueDate: string;
  estimatedTime: string;
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  useEffect(() => {
    // サンプル作業指示データ
    setWorkOrders([
      {
        id: 'WO-001',
        equipment: 'CNCフライス盤 #3',
        location: '第1工場 A棟',
        description:
          '冷却液ポンプから異音が発生。振動も確認されるため、ポンプの点検および必要に応じて交換作業をお願いします。',
        priority: 'urgent',
        status: 'in-progress',
        assignee: '田中 太郎',
        reporter: '山田 一郎',
        createdAt: '2024-12-30T09:30:00',
        dueDate: '2024-12-31T17:00:00',
        estimatedTime: '4時間',
      },
      {
        id: 'WO-002',
        equipment: 'プレス機 #7',
        location: '第2工場 B棟',
        description:
          '油圧シリンダーの定期点検を実施してください。オイル漏れの確認と圧力測定も含む。',
        priority: 'normal',
        status: 'pending',
        assignee: '佐藤 花子',
        reporter: '高橋 次郎',
        createdAt: '2024-12-30T08:15:00',
        dueDate: '2025-01-02T16:00:00',
        estimatedTime: '2時間',
      },
      {
        id: 'WO-003',
        equipment: 'コンベア #2',
        location: '第2工場 A棟',
        description: 'ベルト交換作業が完了しました。動作確認も実施済み。',
        priority: 'normal',
        status: 'completed',
        assignee: '山田 一郎',
        reporter: '佐藤 花子',
        createdAt: '2024-12-29T14:20:00',
        dueDate: '2024-12-30T12:00:00',
        estimatedTime: '3時間',
      },
      {
        id: 'WO-004',
        equipment: '溶接機 #5',
        location: '第1工場 C棟',
        description: '電源ケーブルの接続不良により停止。緊急対応が必要です。',
        priority: 'emergency',
        status: 'pending',
        assignee: '田中 太郎',
        reporter: '鈴木 三郎',
        createdAt: '2024-12-30T11:45:00',
        dueDate: '2024-12-30T15:00:00',
        estimatedTime: '1時間',
      },
      {
        id: 'WO-005',
        equipment: 'CNCフライス盤 #1',
        location: '第1工場 A棟',
        description: '定期保守メンテナンス（月次）を実施してください。',
        priority: 'normal',
        status: 'pending',
        assignee: '佐藤 花子',
        reporter: 'システム',
        createdAt: '2024-12-30T06:00:00',
        dueDate: '2025-01-05T17:00:00',
        estimatedTime: '6時間',
      },
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-500 text-white';
      case 'urgent':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-blue-500 text-white';
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
      case 'cancelled':
        return 'キャンセル';
      default:
        return '待機中';
    }
  };

  const filteredAndSortedOrders = workOrders
    .filter((order) => {
      const matchesSearch =
        order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.assignee.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' || order.status === filterStatus;
      const matchesPriority =
        filterPriority === 'all' || order.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { emergency: 3, urgent: 2, normal: 1 };
          return (
            priorityOrder[b.priority as keyof typeof priorityOrder] -
            priorityOrder[a.priority as keyof typeof priorityOrder]
          );
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              作業指示管理
            </h2>
            <p className="text-gray-600">設備の保守・修理作業指示の管理</p>
          </div>
          <Link href="/work-orders/new">
            <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              新規作業指示
            </Button>
          </Link>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべてのステータス</option>
                <option value="pending">待機中</option>
                <option value="in-progress">作業中</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべての優先度</option>
                <option value="emergency">緊急</option>
                <option value="urgent">至急</option>
                <option value="normal">通常</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">作成日時順</option>
                <option value="dueDate">期限順</option>
                <option value="priority">優先度順</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 作業指示リスト */}
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => (
            <Card
              key={order.id}
              className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <Link href={`/work-orders/${order.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mr-4">
                          {order.equipment}
                        </h3>
                        <div className="flex space-x-2">
                          <Badge className={getPriorityColor(order.priority)}>
                            {getPriorityText(order.priority)}
                          </Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {order.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>担当: {order.assignee}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>予想時間: {order.estimatedTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            期限:{' '}
                            {new Date(order.dueDate).toLocaleDateString(
                              'ja-JP',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span>場所: {order.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          詳細表示
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            作業開始
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredAndSortedOrders.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              作業指示が見つかりません
            </h3>
            <p className="text-gray-600">
              検索条件を変更するか、新しい作業指示を作成してください。
            </p>
            <Link href="/work-orders/new">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新規作業指示を作成
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
