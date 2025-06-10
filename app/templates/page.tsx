'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Copy, Eye, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';

import { MainLayout } from '@widgets/layout';

interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  equipmentType: string;
  fieldsCount: number;
  shiftsCount: number;
  schedulesCount: number;
  lastModified: string;
  createdBy: string;
  status: 'active' | 'draft' | 'archived';
  usageCount: number;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // サンプルテンプレートデータ
    setTemplates([
      {
        id: 'temp-001',
        name: 'CNCフライス盤 日常点検',
        description: '毎日実施するCNCフライス盤の基本点検項目',
        category: 'daily',
        equipmentType: 'CNCフライス盤',
        fieldsCount: 15,
        shiftsCount: 3,
        schedulesCount: 3,
        lastModified: '2024-12-30',
        createdBy: '田中 太郎',
        status: 'active',
        usageCount: 125
      },
      {
        id: 'temp-002', 
        name: 'プレス機 安全点検',
        description: 'プレス機の安全装置と動作確認',
        category: 'safety',
        equipmentType: 'プレス機',
        fieldsCount: 12,
        shiftsCount: 2,
        schedulesCount: 2,
        lastModified: '2024-12-28',
        createdBy: '佐藤 花子',
        status: 'active',
        usageCount: 89
      },
      {
        id: 'temp-003',
        name: '溶接機 品質点検',
        description: '溶接品質の確認と機器状態チェック',
        category: 'quality',
        equipmentType: '溶接機',
        fieldsCount: 8,
        shiftsCount: 1,
        schedulesCount: 1,
        lastModified: '2024-12-25',
        createdBy: '山田 一郎',
        status: 'draft',
        usageCount: 0
      },
      {
        id: 'temp-004',
        name: 'コンベア 週次点検',
        description: 'コンベアベルトとモーターの定期点検',
        category: 'weekly',
        equipmentType: 'コンベア',
        fieldsCount: 20,
        shiftsCount: 1,
        schedulesCount: 7,
        lastModified: '2024-12-20',
        createdBy: '高橋 次郎',
        status: 'active',
        usageCount: 34
      }
    ]);
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.equipmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      filterCategory === 'all' || template.category === filterCategory;
    const matchesStatus = 
      filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { value: 'all', label: 'すべてのカテゴリ' },
    { value: 'safety', label: '安全点検' },
    { value: 'daily', label: '日常点検' },
    { value: 'weekly', label: '週次点検' },
    { value: 'monthly', label: '月次点検' },
    { value: 'quality', label: '品質点検' }
  ];

  const statuses = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: '運用中' },
    { value: 'draft', label: '下書き' },
    { value: 'archived', label: 'アーカイブ' }
  ];

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-100 text-red-800';
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'quality': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'draft': return 'bg-yellow-500 text-white';
      case 'archived': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '運用中';
      case 'draft': return '下書き';
      case 'archived': return 'アーカイブ';
      default: return '不明';
    }
  };

  const getCategoryText = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || category;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">点検テンプレート管理</h1>
            <p className="text-gray-600 mt-2">
              設備点検の効率化と標準化を実現するテンプレートを管理
            </p>
          </div>
          <Link href="/templates/create">
            <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              新しいテンプレート作成
            </Button>
          </Link>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総テンプレート数</p>
                  <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">運用中</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {templates.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">今月の使用回数</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">対象設備種別</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Set(templates.map(t => t.equipmentType)).size}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="テンプレート名、説明、設備種別で検索..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* テンプレート一覧 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryBadgeColor(template.category)}>
                        {getCategoryText(template.category)}
                      </Badge>
                      <Badge className={getStatusBadgeColor(template.status)}>
                        {getStatusText(template.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" title="プレビュー">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="編集">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="複製">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="削除">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">対象設備:</span>
                    <span className="font-medium">{template.equipmentType}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{template.fieldsCount}</div>
                      <div className="text-gray-500 text-xs">項目数</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{template.shiftsCount}</div>
                      <div className="text-gray-500 text-xs">シフト</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{template.schedulesCount}</div>
                      <div className="text-gray-500 text-xs">スケジュール</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div>
                      <span className="text-gray-500">作成者:</span>
                      <span className="ml-1 font-medium">{template.createdBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">使用回数:</span>
                      <span className="ml-1 font-medium text-blue-600">{template.usageCount}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    最終更新: {new Date(template.lastModified).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <Button className="w-full" size="sm">
                    テンプレート使用
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              テンプレートが見つかりません
            </h3>
            <p className="text-gray-600 mb-4">
              検索条件を変更するか、新しいテンプレートを作成してください。
            </p>
            <Link href="/templates/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新しいテンプレート作成
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}