'use client';

import React, { useState } from 'react';

import {
  Building2,
  Plus,
  Edit,
  ChevronDown,
  ChevronRight,
  Users,
  Save,
  ArrowLeft,
  Factory,
  Settings,
} from 'lucide-react';

import Link from 'next/link';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Switch } from '@shared/ui/switch';

import { MainLayout } from '@widgets/layout';

// 組織ノードの型定義（テナント管理者用）
interface TenantOrganizationNode {
  id: string;
  name: string;
  type: 'company' | 'division' | 'factory' | 'department' | 'section' | 'line';
  parentId: string | null;
  children: TenantOrganizationNode[];
  permissions: {
    canManageUsers: boolean;
    canManageEquipment: boolean;
    canManageInspections: boolean;
    canViewReports: boolean;
  };
  assignedUsers: string[];
  metadata?: {
    location?: string;
    manager?: string;
    capacity?: number;
    status?: 'active' | 'inactive' | 'maintenance';
  };
}

const nodeTypeLabels = {
  company: '会社',
  division: '事業部',
  factory: '製鉄所/工場',
  department: '部',
  section: '課/工場',
  line: 'ライン',
};

const nodeTypeIcons = {
  company: Building2,
  division: Users,
  factory: Factory,
  department: Building2,
  section: Factory,
  line: Factory,
};

export default function TenantOrganizationPage() {
  // 日本製鉄八幡製鉄所の例（テナント管理者が管理できる範囲）
  const [organization, setOrganization] = useState<TenantOrganizationNode>({
    id: 'yawata',
    name: '八幡製鉄所',
    type: 'factory',
    parentId: null,
    children: [
      {
        id: 'sheet-div',
        name: '薄板部',
        type: 'department',
        parentId: 'yawata',
        children: [
          {
            id: 'cold-rolling',
            name: '冷延めっき工場',
            type: 'section',
            parentId: 'sheet-div',
            children: [
              {
                id: 'plating-section',
                name: 'めっき課',
                type: 'section',
                parentId: 'cold-rolling',
                children: [
                  {
                    id: 'gapl-line',
                    name: 'GAPLライン',
                    type: 'line',
                    parentId: 'plating-section',
                    children: [],
                    permissions: {
                      canManageUsers: true,
                      canManageEquipment: true,
                      canManageInspections: true,
                      canViewReports: true,
                    },
                    assignedUsers: ['user-1', 'user-2'],
                  },
                ],
                permissions: {
                  canManageUsers: true,
                  canManageEquipment: true,
                  canManageInspections: true,
                  canViewReports: true,
                },
                assignedUsers: ['manager-1'],
              },
            ],
            permissions: {
              canManageUsers: true,
              canManageEquipment: false,
              canManageInspections: true,
              canViewReports: true,
            },
            assignedUsers: ['supervisor-1'],
          },
        ],
        permissions: {
          canManageUsers: true,
          canManageEquipment: false,
          canManageInspections: false,
          canViewReports: true,
        },
        assignedUsers: ['department-head-1'],
      },
      {
        id: 'hot-rolling-div',
        name: '熱延部',
        type: 'department',
        parentId: 'yawata',
        children: [
          {
            id: 'hot-rolling-factory',
            name: '熱延工場',
            type: 'section',
            parentId: 'hot-rolling-div',
            children: [
              {
                id: 'rolling-section',
                name: '圧延課',
                type: 'section',
                parentId: 'hot-rolling-factory',
                children: [
                  {
                    id: 'rolling-line-1',
                    name: '第1圧延ライン',
                    type: 'line',
                    parentId: 'rolling-section',
                    children: [],
                    permissions: {
                      canManageUsers: true,
                      canManageEquipment: true,
                      canManageInspections: true,
                      canViewReports: true,
                    },
                    assignedUsers: ['user-3', 'user-4'],
                  },
                  {
                    id: 'rolling-line-2',
                    name: '第2圧延ライン',
                    type: 'line',
                    parentId: 'rolling-section',
                    children: [],
                    permissions: {
                      canManageUsers: true,
                      canManageEquipment: true,
                      canManageInspections: true,
                      canViewReports: true,
                    },
                    assignedUsers: ['user-5', 'user-6'],
                  },
                ],
                permissions: {
                  canManageUsers: true,
                  canManageEquipment: true,
                  canManageInspections: true,
                  canViewReports: true,
                },
                assignedUsers: ['manager-2'],
              },
            ],
            permissions: {
              canManageUsers: true,
              canManageEquipment: false,
              canManageInspections: true,
              canViewReports: true,
            },
            assignedUsers: ['supervisor-2'],
          },
        ],
        permissions: {
          canManageUsers: true,
          canManageEquipment: false,
          canManageInspections: false,
          canViewReports: true,
        },
        assignedUsers: ['department-head-2'],
      },
    ],
    permissions: {
      canManageUsers: true,
      canManageEquipment: false,
      canManageInspections: false,
      canViewReports: true,
    },
    assignedUsers: ['factory-manager'],
  });

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['yawata', 'sheet-div', 'hot-rolling-div'])
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);

  // ノード展開/折りたたみ
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // ノード更新
  const updateNode = (nodeId: string, updates: Partial<TenantOrganizationNode>) => {
    const updateNodeInTree = (node: TenantOrganizationNode): TenantOrganizationNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      return {
        ...node,
        children: node.children.map(updateNodeInTree),
      };
    };

    setOrganization(updateNodeInTree(organization));
  };

  // ノード検索（ID指定）
  const findNode = (nodeId: string, node: TenantOrganizationNode = organization): TenantOrganizationNode | null => {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const found = findNode(nodeId, child);
      if (found) return found;
    }
    return null;
  };

  // 組織ツリーコンポーネント
  const OrganizationTree = ({ node, level = 0 }: { node: TenantOrganizationNode; level?: number }) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;
    const isEditing = editingNode === node.id;
    const hasChildren = node.children.length > 0;
    const IconComponent = nodeTypeIcons[node.type];

    return (
      <div className={`ml-${level * 4}`}>
        <div
          className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer ${
            isSelected ? 'bg-blue-50 border border-blue-200' : ''
          }`}
          onClick={() => setSelectedNode(node.id)}
        >
          {/* 展開/折りたたみボタン */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* アイコンとノード名 */}
          <IconComponent className="h-4 w-4 text-gray-600" />
          
          {isEditing ? (
            <Input
              value={node.name}
              onChange={(e) => updateNode(node.id, { name: e.target.value })}
              onBlur={() => setEditingNode(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingNode(null);
              }}
              className="h-6 text-sm"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm font-medium">{node.name}</span>
          )}

          <Badge variant="outline" className="text-xs">
            {nodeTypeLabels[node.type]}
          </Badge>

          {/* 権限表示 */}
          <div className="flex gap-1">
            {node.permissions.canManageUsers && (
              <Badge variant="secondary" className="text-xs">ユーザー</Badge>
            )}
            {node.permissions.canManageEquipment && (
              <Badge variant="secondary" className="text-xs">設備</Badge>
            )}
            {node.permissions.canManageInspections && (
              <Badge variant="secondary" className="text-xs">点検</Badge>
            )}
          </div>

          {/* アクションボタン */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setEditingNode(node.id);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* 子ノード */}
        {isExpanded && (
          <div className="ml-4">
            {node.children.map((child) => (
              <OrganizationTree key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const selectedNodeData = selectedNode ? findNode(selectedNode) : null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/tenant-settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                設定に戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">組織構造と権限管理</h1>
              <p className="text-gray-600">{organization.name}</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            設定を保存
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 組織ツリー */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                組織構造
              </CardTitle>
              <p className="text-sm text-gray-600">
                各部門・課・ラインの階層構造と権限設定
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                <OrganizationTree node={organization} />
              </div>
            </CardContent>
          </Card>

          {/* 詳細パネル */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                権限・詳細設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNodeData ? (
                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">基本情報</h3>
                    <div>
                      <Label>ノード名</Label>
                      <Input
                        value={selectedNodeData.name}
                        onChange={(e) => updateNode(selectedNodeData.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>責任者</Label>
                      <Input
                        value={selectedNodeData.metadata?.manager || ''}
                        onChange={(e) =>
                          updateNode(selectedNodeData.id, {
                            metadata: { ...selectedNodeData.metadata, manager: e.target.value },
                          })
                        }
                        placeholder="例: 田中部長"
                      />
                    </div>
                    <div>
                      <Label>場所</Label>
                      <Input
                        value={selectedNodeData.metadata?.location || ''}
                        onChange={(e) =>
                          updateNode(selectedNodeData.id, {
                            metadata: { ...selectedNodeData.metadata, location: e.target.value },
                          })
                        }
                        placeholder="例: G4棟 2階"
                      />
                    </div>
                  </div>

                  {/* 権限設定 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">権限設定</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="user-management">ユーザー管理</Label>
                        <Switch
                          id="user-management"
                          checked={selectedNodeData.permissions.canManageUsers}
                          onCheckedChange={(checked) =>
                            updateNode(selectedNodeData.id, {
                              permissions: { ...selectedNodeData.permissions, canManageUsers: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="equipment-management">設備管理</Label>
                        <Switch
                          id="equipment-management"
                          checked={selectedNodeData.permissions.canManageEquipment}
                          onCheckedChange={(checked) =>
                            updateNode(selectedNodeData.id, {
                              permissions: { ...selectedNodeData.permissions, canManageEquipment: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="inspection-management">点検管理</Label>
                        <Switch
                          id="inspection-management"
                          checked={selectedNodeData.permissions.canManageInspections}
                          onCheckedChange={(checked) =>
                            updateNode(selectedNodeData.id, {
                              permissions: { ...selectedNodeData.permissions, canManageInspections: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="report-viewing">レポート閲覧</Label>
                        <Switch
                          id="report-viewing"
                          checked={selectedNodeData.permissions.canViewReports}
                          onCheckedChange={(checked) =>
                            updateNode(selectedNodeData.id, {
                              permissions: { ...selectedNodeData.permissions, canViewReports: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* 割り当てユーザー */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">割り当てユーザー</h3>
                    <div className="text-sm text-gray-600">
                      {selectedNodeData.assignedUsers.length}名のユーザーが割り当てられています
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      ユーザーを追加
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>組織ノードを選択してください</p>
                  <p className="text-sm mt-2">
                    左側の組織ツリーから設定したいノードをクリックしてください
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}