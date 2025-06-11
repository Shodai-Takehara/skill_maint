'use client';

import { useState } from 'react';

import {
  Building2,
  Users,
  Shield,
  Activity,
  CreditCard,
  Plus,
  Edit,
  ChevronRight,
} from 'lucide-react';

import Link from 'next/link';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';

// スーパー管理者用レイアウト（シンプル）
function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">スキルメンテ管理コンソール</h1>
          <Badge variant="secondary">SUPER ADMIN</Badge>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}

// テナント情報
interface Tenant {
  id: string;
  companyName: string;
  plan: 'starter' | 'standard' | 'enterprise';
  status: 'active' | 'trial' | 'suspended';
  createdAt: string;
  userCount: number;
  dataUsage: number; // GB
  organizationStructure: {
    levels: string[]; // ['事業部', '工場', '課', 'ライン'] など
  };
}

export default function SuperAdminPage() {
  const [tenants] = useState<Tenant[]>([
    {
      id: 'tenant-001',
      companyName: '株式会社サンプル製作所',
      plan: 'standard',
      status: 'active',
      createdAt: '2024-01-15',
      userCount: 45,
      dataUsage: 12.5,
      organizationStructure: {
        levels: ['事業部', '工場', '課', 'ライン'],
      },
    },
    {
      id: 'tenant-002',
      companyName: '山田工業株式会社',
      plan: 'starter',
      status: 'trial',
      createdAt: '2024-12-20',
      userCount: 12,
      dataUsage: 2.1,
      organizationStructure: {
        levels: ['工場', 'ライン'],
      },
    },
  ]);

  const [activeTab, setActiveTab] = useState('tenants');

  return (
    <SuperAdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">システム管理</h2>
        <p className="text-gray-600">全テナントの管理とシステム監視</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenants">
            <Building2 className="h-4 w-4 mr-2" />
            テナント管理
          </TabsTrigger>
          <TabsTrigger value="plans">
            <CreditCard className="h-4 w-4 mr-2" />
            プラン設定
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Activity className="h-4 w-4 mr-2" />
            システム監視
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Shield className="h-4 w-4 mr-2" />
            権限テンプレート
          </TabsTrigger>
        </TabsList>

        {/* テナント管理 */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">登録テナント一覧</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規テナント作成
            </Button>
          </div>

          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{tenant.companyName}</h4>
                        <Badge
                          variant={tenant.status === 'active' ? 'default' : 'secondary'}
                        >
                          {tenant.status === 'active' && '稼働中'}
                          {tenant.status === 'trial' && '試用中'}
                          {tenant.status === 'suspended' && '停止中'}
                        </Badge>
                        <Badge variant="outline">
                          {tenant.plan.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ユーザー数:</span> {tenant.userCount}名
                        </div>
                        <div>
                          <span className="font-medium">データ使用量:</span> {tenant.dataUsage}GB
                        </div>
                        <div>
                          <span className="font-medium">登録日:</span> {tenant.createdAt}
                        </div>
                        <div>
                          <span className="font-medium">組織階層:</span> {tenant.organizationStructure.levels.join(' → ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Link href={`/super-admin/organization-builder?tenant=${tenant.id}`}>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* プラン設定 */}
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>プラン設定</CardTitle>
              <p className="text-sm text-gray-600">
                各プランの機能制限と料金設定
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Starterプラン</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ユーザー数: 最大10名</li>
                    <li>• ライン数: 最大3ライン</li>
                    <li>• データ保存期間: 6ヶ月</li>
                    <li>• 月額: 9,800円</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Standardプラン</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ユーザー数: 最大50名</li>
                    <li>• ライン数: 最大10ライン</li>
                    <li>• データ保存期間: 2年</li>
                    <li>• 月額: 29,800円</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Enterpriseプラン</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ユーザー数: 無制限</li>
                    <li>• ライン数: 無制限</li>
                    <li>• データ保存期間: 無制限</li>
                    <li>• 月額: 99,800円</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* システム監視 */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">アクティブテナント</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                    <p className="text-2xl font-bold">57</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">システム稼働率</p>
                    <p className="text-2xl font-bold">99.9%</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>テナント別使用状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <h4 className="font-semibold">{tenant.companyName}</h4>
                      <p className="text-sm text-gray-600">
                        ユーザー: {tenant.userCount}名 | データ: {tenant.dataUsage}GB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                        {tenant.status === 'active' && '稼働中'}
                        {tenant.status === 'trial' && '試用中'}
                        {tenant.status === 'suspended' && '停止中'}
                      </Badge>
                      <Badge variant="outline">{tenant.plan}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 権限テンプレート */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>柔軟な組織構造テンプレート</CardTitle>
              <p className="text-sm text-gray-600">
                各テナントが自由に組織階層を定義できるテンプレート
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">製造業標準テンプレート</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge>階層1</Badge>
                      <span>事業部 / 部門</span>
                    </div>
                    <div className="flex items-center gap-2 ml-8">
                      <Badge>階層2</Badge>
                      <span>工場 / 製造所</span>
                    </div>
                    <div className="flex items-center gap-2 ml-16">
                      <Badge>階層3</Badge>
                      <span>課 / セクション</span>
                    </div>
                    <div className="flex items-center gap-2 ml-24">
                      <Badge>階層4</Badge>
                      <span>ライン / 工程</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">シンプルテンプレート</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge>階層1</Badge>
                      <span>工場</span>
                    </div>
                    <div className="flex items-center gap-2 ml-8">
                      <Badge>階層2</Badge>
                      <span>ライン</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">カスタム組織構造</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    各テナントが独自の階層を定義可能（最大5階層）
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level1">階層1名</Label>
                      <Input id="level1" placeholder="例: 事業部" />
                    </div>
                    <div>
                      <Label htmlFor="level2">階層2名</Label>
                      <Input id="level2" placeholder="例: 工場" />
                    </div>
                    <div>
                      <Label htmlFor="level3">階層3名</Label>
                      <Input id="level3" placeholder="例: 課" />
                    </div>
                    <div>
                      <Label htmlFor="level4">階層4名</Label>
                      <Input id="level4" placeholder="例: ライン" />
                    </div>
                  </div>
                  <Button className="mt-4" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    テンプレート保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SuperAdminLayout>
  );
}