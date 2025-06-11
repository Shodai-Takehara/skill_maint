'use client';

import React, { useState } from 'react';

import {
  Building2,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Users,
  Save,
  ArrowLeft,
  Factory,
} from 'lucide-react';

import Link from 'next/link';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';

// 組織ノードの型定義
interface OrganizationNode {
  id: string;
  name: string;
  type: 'company' | 'division' | 'factory' | 'department' | 'section' | 'line';
  parentId: string | null;
  children: OrganizationNode[];
  metadata?: {
    location?: string;
    manager?: string;
    capacity?: number;
    status?: 'active' | 'inactive' | 'maintenance';
  };
}

// テナントの組織構造
interface TenantOrganization {
  tenantId: string;
  companyName: string;
  rootNode: OrganizationNode;
  permissions: {
    [nodeId: string]: {
      roles: string[];
      inheritFromParent: boolean;
    };
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

export default function OrganizationBuilderPage() {
  // 日本製鉄の例
  const [organization, setOrganization] = useState<TenantOrganization>({
    tenantId: 'nippon-steel',
    companyName: '日本製鉄株式会社',
    rootNode: {
      id: 'root',
      name: '日本製鉄',
      type: 'company',
      parentId: null,
      children: [
        {
          id: 'yawata',
          name: '八幡製鉄所',
          type: 'factory',
          parentId: 'root',
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
                        },
                      ],
                    },
                  ],
                },
              ],
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
                        },
                        {
                          id: 'rolling-line-2',
                          name: '第2圧延ライン',
                          type: 'line',
                          parentId: 'rolling-section',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    permissions: {},
  });

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['root', 'yawata', 'sheet-div', 'hot-rolling-div'])
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeParent, setNewNodeParent] = useState<string | null>(null);

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

  // ノード追加
  const addNode = (parentId: string, nodeType: OrganizationNode['type']) => {
    const newNode: OrganizationNode = {
      id: `node-${Date.now()}`,
      name: `新規${nodeTypeLabels[nodeType]}`,
      type: nodeType,
      parentId,
      children: [],
    };

    const updateNodeInTree = (node: OrganizationNode): OrganizationNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }
      return {
        ...node,
        children: node.children.map(updateNodeInTree),
      };
    };

    setOrganization((prev) => ({
      ...prev,
      rootNode: updateNodeInTree(prev.rootNode),
    }));

    // 親ノードを展開
    setExpandedNodes((prev) => new Set(Array.from(prev).concat([parentId])));
    setEditingNode(newNode.id);
  };

  // ノード更新
  const updateNode = (nodeId: string, updates: Partial<OrganizationNode>) => {
    const updateNodeInTree = (node: OrganizationNode): OrganizationNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      return {
        ...node,
        children: node.children.map(updateNodeInTree),
      };
    };

    setOrganization((prev) => ({
      ...prev,
      rootNode: updateNodeInTree(prev.rootNode),
    }));
  };

  // ノード削除
  const deleteNode = (nodeId: string) => {
    const removeNodeFromTree = (node: OrganizationNode): OrganizationNode => {
      return {
        ...node,
        children: node.children
          .filter((child) => child.id !== nodeId)
          .map(removeNodeFromTree),
      };
    };

    setOrganization((prev) => ({
      ...prev,
      rootNode: removeNodeFromTree(prev.rootNode),
    }));
  };

  // ノード検索（ID指定）
  const findNode = (nodeId: string, node: OrganizationNode = organization.rootNode): OrganizationNode | null => {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const found = findNode(nodeId, child);
      if (found) return found;
    }
    return null;
  };

  // 組織ツリーコンポーネント
  const OrganizationTree = ({ node, level = 0 }: { node: OrganizationNode; level?: number }) => {
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

          {/* アクションボタン */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setNewNodeParent(node.id);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
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
            {node.id !== 'root' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
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
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/super-admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">組織構造エディタ</h1>
              <p className="text-gray-600">{organization.companyName}</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 組織ツリー */}
        <div className="w-1/2 border-r border-gray-200 bg-white">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">組織ツリー</h2>
            <div className="space-y-1">
              <OrganizationTree node={organization.rootNode} />
            </div>
          </div>
        </div>

        {/* 詳細パネル */}
        <div className="w-1/2 bg-white p-6">
          {selectedNodeData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(nodeTypeIcons[selectedNodeData.type], {
                    className: 'h-5 w-5',
                  })}
                  {selectedNodeData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>ノード名</Label>
                  <Input
                    value={selectedNodeData.name}
                    onChange={(e) => updateNode(selectedNodeData.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>ノードタイプ</Label>
                  <Select
                    value={selectedNodeData.type}
                    onValueChange={(value) =>
                      updateNode(selectedNodeData.id, { type: value as OrganizationNode['type'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(nodeTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    placeholder="例: 福岡県北九州市"
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
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>組織ノードを選択してください</p>
            </div>
          )}

          {/* 新しいノード追加パネル */}
          {newNodeParent && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>新しいノードを追加</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>ノードタイプ</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(nodeTypeLabels).map(([value, label]) => (
                        <Button
                          key={value}
                          variant="outline"
                          onClick={() => {
                            addNode(newNodeParent, value as OrganizationNode['type']);
                            setNewNodeParent(null);
                          }}
                          className="justify-start"
                        >
                          {React.createElement(nodeTypeIcons[value as keyof typeof nodeTypeIcons], {
                            className: 'h-4 w-4 mr-2',
                          })}
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setNewNodeParent(null)}
                    className="w-full"
                  >
                    キャンセル
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}