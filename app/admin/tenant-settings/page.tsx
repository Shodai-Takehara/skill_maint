'use client';

import { useState } from 'react';

import {
  Building,
  Factory,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';

import { MainLayout } from '@widgets/layout';

// テナント設定の型定義
interface Building {
  id: string;
  name: string;
  description: string;
  lines: Line[];
}

interface Line {
  id: string;
  name: string;
  description: string;
  buildingId: string;
  defaultSections: string[]; // デフォルトセクション
}

interface Factory {
  id: string;
  name: string;
  location: string;
  description: string;
  buildings: Building[];
}

interface TenantSettings {
  id: string;
  companyName: string;
  industry: string;
  factories: Factory[];
  defaultSections: string[]; // 全社共通セクション
  userRoles: string[];
}

export default function TenantSettingsPage() {
  const [settings, setSettings] = useState<TenantSettings>({
    id: 'tenant-001',
    companyName: '株式会社サンプル製作所',
    industry: '自動車部品製造',
    factories: [
      {
        id: 'factory-001',
        name: '本社工場',
        location: '愛知県豊田市',
        description: '主力製造工場',
        buildings: [
          {
            id: 'building-g4',
            name: 'G4棟',
            description: '第4製造棟',
            lines: [
              {
                id: 'gapl',
                name: 'GAPLライン',
                description: 'GAPL製造ライン',
                buildingId: 'building-g4',
                defaultSections: ['前面', '後面', '中央'],
              },
            ],
          },
        ],
      },
    ],
    defaultSections: ['前面', '後面', '中央', '炉部', '制御部', 'ユーティリティ'],
    userRoles: ['管理者', '現場責任者', '作業者', '閲覧者'],
  });

  const [activeTab, setActiveTab] = useState('factories');
  const [_editMode, _setEditMode] = useState<{ [key: string]: boolean }>({});

  // 工場追加
  const addFactory = () => {
    const newFactory: Factory = {
      id: `factory-${Date.now()}`,
      name: '新規工場',
      location: '',
      description: '',
      buildings: [],
    };
    setSettings(prev => ({
      ...prev,
      factories: [...prev.factories, newFactory],
    }));
  };

  // 棟追加
  const addBuilding = (factoryId: string) => {
    const newBuilding: Building = {
      id: `building-${Date.now()}`,
      name: '新規棟',
      description: '',
      lines: [],
    };
    setSettings(prev => ({
      ...prev,
      factories: prev.factories.map(factory =>
        factory.id === factoryId
          ? { ...factory, buildings: [...factory.buildings, newBuilding] }
          : factory
      ),
    }));
  };

  // ライン追加
  const addLine = (factoryId: string, buildingId: string) => {
    const newLine: Line = {
      id: `line-${Date.now()}`,
      name: '新規ライン',
      description: '',
      buildingId,
      defaultSections: [...settings.defaultSections.slice(0, 3)],
    };
    setSettings(prev => ({
      ...prev,
      factories: prev.factories.map(factory =>
        factory.id === factoryId
          ? {
              ...factory,
              buildings: factory.buildings.map(building =>
                building.id === buildingId
                  ? { ...building, lines: [...building.lines, newLine] }
                  : building
              ),
            }
          : factory
      ),
    }));
  };

  // 設定保存
  const saveSettings = () => {
    // TODO: API呼び出し
    alert('設定を保存しました');
    _setEditMode({});
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">テナント設定</h1>
            <p className="text-gray-600 mt-2">
              工場・ライン構成とユーザー管理
            </p>
          </div>
          <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            設定を保存
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="factories" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              工場・ライン管理
            </TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              セクション管理
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              ユーザー・権限
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              会社情報
            </TabsTrigger>
          </TabsList>

          {/* 工場・ライン管理 */}
          <TabsContent value="factories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>工場・棟・ライン構成</CardTitle>
                  <Button onClick={addFactory} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    工場追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {settings.factories.map(factory => (
                    <div key={factory.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Factory className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{factory.name}</h3>
                            <p className="text-sm text-gray-600">{factory.location}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => addBuilding(factory.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            棟追加
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 棟一覧 */}
                      <div className="ml-8 space-y-4">
                        {factory.buildings.map(building => (
                          <div key={building.id} className="border-l-2 border-gray-200 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{building.name}</span>
                                <Badge variant="outline">{building.lines.length}ライン</Badge>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => addLine(factory.id, building.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                ライン追加
                              </Button>
                            </div>

                            {/* ライン一覧 */}
                            <div className="ml-6 space-y-2">
                              {building.lines.map(line => (
                                <div key={line.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-sm font-medium">{line.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {line.defaultSections.length}セクション
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* セクション管理 */}
          <TabsContent value="sections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>デフォルトセクション設定</CardTitle>
                <p className="text-sm text-gray-600">
                  新規ライン作成時に自動で設定されるセクションを管理
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {settings.defaultSections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{section}</span>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input placeholder="新しいセクション名" className="flex-1" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    追加
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ユーザー・権限管理 */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー権限設定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.userRoles.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <div className="font-medium">{role}</div>
                        <div className="text-sm text-gray-600">
                          {/* 権限詳細 */}
                          {role === '管理者' && '全機能アクセス可能'}
                          {role === '現場責任者' && '点検・設備管理可能'}
                          {role === '作業者' && '点検実行・データ入力可能'}
                          {role === '閲覧者' && 'データ閲覧のみ可能'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        編集
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 会社情報 */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>会社基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">会社名</Label>
                  <Input 
                    id="companyName" 
                    value={settings.companyName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      companyName: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">業界</Label>
                  <Input 
                    id="industry" 
                    value={settings.industry}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      industry: e.target.value
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}