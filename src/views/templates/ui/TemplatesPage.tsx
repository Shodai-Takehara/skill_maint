'use client';

import { useState, useEffect } from 'react';

import {
  FileText,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  Clock,
  Users,
  Shield,
  Wrench,
  Settings,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { cn } from '@shared/lib';

import { MainLayout } from '@widgets/layout';
import { CreateTemplateModal } from '@features/template-management';

interface InspectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  fieldCount: number;
  estimatedDuration: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  usageCount: number;
  equipmentTypes: string[];
  priority: 'low' | 'medium' | 'high';
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function TemplatesPage() {
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<InspectionTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // モックデータ
    const mockTemplates: InspectionTemplate[] = [
      {
        id: '1',
        name: 'CNC日常安全点検',
        description: 'CNCフライス盤の包括的な日常安全点検項目',
        category: 'safety',
        version: '2.1',
        status: 'active',
        fieldCount: 12,
        estimatedDuration: 15,
        createdBy: '田中 太郎',
        createdAt: '2024-01-15T10:00:00Z',
        lastModified: '2024-01-20T14:30:00Z',
        usageCount: 45,
        equipmentTypes: ['CNCフライス盤', 'CNC旋盤'],
        priority: 'high',
      },
      {
        id: '2',
        name: '油圧システム点検',
        description: '油圧機器の圧力と流体レベル点検',
        category: 'maintenance',
        version: '1.3',
        status: 'active',
        fieldCount: 8,
        estimatedDuration: 20,
        createdBy: '佐藤 花子',
        createdAt: '2024-01-10T09:15:00Z',
        lastModified: '2024-01-18T11:45:00Z',
        usageCount: 32,
        equipmentTypes: ['プレス機', '油圧機器'],
        priority: 'medium',
      },
      {
        id: '3',
        name: '品質管理チェックリスト',
        description: '製品品質検証と測定確認項目',
        category: 'quality',
        version: '3.0',
        status: 'draft',
        fieldCount: 18,
        estimatedDuration: 25,
        createdBy: '山田 一郎',
        createdAt: '2024-01-22T16:20:00Z',
        lastModified: '2024-01-25T13:10:00Z',
        usageCount: 0,
        equipmentTypes: ['測定器', 'その他'],
        priority: 'medium',
      },
      {
        id: '4',
        name: 'ベルト張力点検',
        description: 'コンベアベルトの張力と位置調整確認',
        category: 'maintenance',
        version: '1.0',
        status: 'active',
        fieldCount: 6,
        estimatedDuration: 10,
        createdBy: '高橋 次郎',
        createdAt: '2024-01-05T08:30:00Z',
        lastModified: '2024-01-05T08:30:00Z',
        usageCount: 28,
        equipmentTypes: ['コンベア'],
        priority: 'low',
      },
      {
        id: '5',
        name: '電気安全点検',
        description: '電気系統の安全性とアース確認',
        category: 'safety',
        version: '2.0',
        status: 'archived',
        fieldCount: 10,
        estimatedDuration: 12,
        createdBy: '鈴木 三郎',
        createdAt: '2023-12-01T14:00:00Z',
        lastModified: '2023-12-15T10:20:00Z',
        usageCount: 67,
        equipmentTypes: ['全設備'],
        priority: 'high',
      },
    ];

    setTemplates(mockTemplates);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.equipmentTypes.some((type) =>
            type.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // カテゴリーフィルター
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((template) => template.category === categoryFilter);
    }

    // ステータスフィルター
    if (statusFilter !== 'all') {
      filtered = filtered.filter((template) => template.status === statusFilter);
    }

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">運用中</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500 text-white">下書き</Badge>;
      case 'archived':
        return <Badge className="bg-gray-500 text-white">アーカイブ</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">不明</Badge>;
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'safety':
        return { icon: Shield, color: 'bg-red-100 text-red-800', label: '安全点検' };
      case 'maintenance':
        return { icon: Wrench, color: 'bg-blue-100 text-blue-800', label: '保守点検' };
      case 'quality':
        return { icon: Settings, color: 'bg-green-100 text-green-800', label: '品質管理' };
      default:
        return { icon: FileText, color: 'bg-gray-100 text-gray-800', label: 'その他' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-white">高</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">中</Badge>;
      case 'low':
        return <Badge className="bg-gray-500 text-white">低</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">-</Badge>;
    }
  };

  const categories = [
    { value: 'all', label: 'すべてのカテゴリー' },
    { value: 'safety', label: '安全点検' },
    { value: 'maintenance', label: '保守点検' },
    { value: 'quality', label: '品質管理' },
  ];

  const handleTemplateCreate = (templateData: any) => {
    const newTemplate: InspectionTemplate = {
      id: Date.now().toString(),
      ...templateData,
      version: '1.0',
      status: 'draft' as const,
      fieldCount: 0,
      createdBy: '現在のユーザー',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      usageCount: 0,
    };

    setTemplates((prev) => [newTemplate, ...prev]);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              点検テンプレート
            </h2>
            <p className="text-gray-600">
              設備の点検項目テンプレートを作成・管理します
            </p>
          </div>
          <CreateTemplateModal onTemplateCreate={handleTemplateCreate} />
        </div>

        {/* 統計カード */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    総テンプレート数
                  </p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">運用中</p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.filter((t) => t.status === 'active').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">下書き</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {templates.filter((t) => t.status === 'draft').length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    総使用回数
                  </p>
                  <p className="text-2xl font-bold">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルター */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="テンプレート名、説明、設備タイプで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="active">運用中</option>
                  <option value="draft">下書き</option>
                  <option value="archived">アーカイブ</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* テンプレートグリッド */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const categoryInfo = getCategoryInfo(template.category);
            return (
              <Card
                key={template.id}
                className="transition-all hover:shadow-lg cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={categoryInfo.color}>
                          <categoryInfo.icon className="h-3 w-3 mr-1" />
                          {categoryInfo.label}
                        </Badge>
                        {getStatusBadge(template.status)}
                        {getPriorityBadge(template.priority)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">項目数</p>
                      <p className="font-medium">{template.fieldCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">所要時間</p>
                      <p className="font-medium">{template.estimatedDuration}分</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">バージョン</p>
                      <p className="font-medium">v{template.version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">使用回数</p>
                      <p className="font-medium">{template.usageCount}回</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">対象設備</p>
                    <div className="flex flex-wrap gap-1">
                      {template.equipmentTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>作成者: {template.createdBy}</p>
                    <p>更新: {formatDate(template.lastModified)}</p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      プレビュー
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      編集
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    テンプレートが見つかりません
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    検索条件を変更するか、新しいテンプレートを作成してください
                  </p>
                  <CreateTemplateModal onTemplateCreate={handleTemplateCreate} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default TemplatesPage;