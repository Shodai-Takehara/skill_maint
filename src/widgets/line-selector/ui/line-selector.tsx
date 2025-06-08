'use client';

import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import { ScrollArea } from '@shared/ui/scroll-area';
import { Check, ChevronDown, Factory, MapPin, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrganizationNode {
  id: string;
  name: string;
  type: 'factory' | 'line' | 'section';
  parentId?: string;
  children?: OrganizationNode[];
}

interface LineSelectorProps {
  selectedLineId?: string;
  onLineSelect: (lineId: string, lineName: string) => void;
}

export function LineSelector({
  selectedLineId,
  onLineSelect,
}: LineSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState<OrganizationNode[]>(
    []
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedLine, setSelectedLine] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 組織データの初期化（一度だけ実行）
  useEffect(() => {
    setOrganizationData([
      {
        id: 'factory-1',
        name: '第1工場',
        type: 'factory',
        children: [
          {
            id: 'line-1-1',
            name: 'A棟製造ライン',
            type: 'line',
            parentId: 'factory-1',
            children: [
              {
                id: 'section-1-1-1',
                name: 'CNC加工セクション',
                type: 'section',
                parentId: 'line-1-1',
              },
              {
                id: 'section-1-1-2',
                name: '組立セクション',
                type: 'section',
                parentId: 'line-1-1',
              },
            ],
          },
          {
            id: 'line-1-2',
            name: 'B棟製造ライン',
            type: 'line',
            parentId: 'factory-1',
            children: [
              {
                id: 'section-1-2-1',
                name: '溶接セクション',
                type: 'section',
                parentId: 'line-1-2',
              },
              {
                id: 'section-1-2-2',
                name: '検査セクション',
                type: 'section',
                parentId: 'line-1-2',
              },
            ],
          },
          {
            id: 'line-1-3',
            name: 'C棟製造ライン',
            type: 'line',
            parentId: 'factory-1',
          },
        ],
      },
      {
        id: 'factory-2',
        name: '第2工場',
        type: 'factory',
        children: [
          {
            id: 'line-2-1',
            name: 'プレス製造ライン',
            type: 'line',
            parentId: 'factory-2',
            children: [
              {
                id: 'section-2-1-1',
                name: 'プレス加工セクション',
                type: 'section',
                parentId: 'line-2-1',
              },
              {
                id: 'section-2-1-2',
                name: '仕上げセクション',
                type: 'section',
                parentId: 'line-2-1',
              },
            ],
          },
          {
            id: 'line-2-2',
            name: '自動化ライン',
            type: 'line',
            parentId: 'factory-2',
            children: [
              {
                id: 'section-2-2-1',
                name: 'ロボットセクション',
                type: 'section',
                parentId: 'line-2-2',
              },
            ],
          },
        ],
      },
      {
        id: 'factory-3',
        name: '第3工場',
        type: 'factory',
        children: [
          {
            id: 'line-3-1',
            name: '品質管理ライン',
            type: 'line',
            parentId: 'factory-3',
          },
        ],
      },
    ]);
  }, []); // 空の依存配列で一度だけ実行

  // 選択されたラインIDが変更された時の処理
  useEffect(() => {
    if (selectedLineId && organizationData.length > 0) {
      const findLine = (
        nodes: OrganizationNode[]
      ): { id: string; name: string } | null => {
        for (const node of nodes) {
          if (node.type === 'line' && node.id === selectedLineId) {
            return { id: node.id, name: node.name };
          }
          if (node.children) {
            const found = findLine(node.children);
            if (found) return found;
          }
        }
        return null;
      };

      const line = findLine(organizationData);
      if (line) {
        setSelectedLine(line);
      }
    }
  }, [selectedLineId, organizationData]); // organizationDataで変更を検知

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleLineSelect = (line: { id: string; name: string }) => {
    setSelectedLine(line);
    onLineSelect(line.id, line.name);
    setIsOpen(false);
  };

  const renderNode = (node: OrganizationNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = node.type === 'line' && selectedLine?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center space-x-2 p-3 hover:bg-gray-50/80 cursor-pointer rounded-xl transition-all duration-200 ${
            isSelected ? 'bg-gray-100/80 border border-gray-300/50' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (node.type === 'line') {
              handleLineSelect({ id: node.id, name: node.name });
            } else if (hasChildren) {
              toggleNode(node.id);
            }
          }}
        >
          {hasChildren && (
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isExpanded ? 'rotate-0' : '-rotate-90'
              }`}
            />
          )}
          {!hasChildren && <div className="w-4" />}

          {node.type === 'factory' && (
            <Factory className="h-4 w-4 text-gray-700" />
          )}
          {node.type === 'line' && <MapPin className="h-4 w-4 text-gray-900" />}
          {node.type === 'section' && (
            <Settings className="h-4 w-4 text-gray-600" />
          )}

          <span
            className={`text-sm font-semibold ${
              node.type === 'line' ? 'text-gray-900' : 'text-gray-700'
            }`}
          >
            {node.name}
          </span>

          {isSelected && <Check className="h-4 w-4 text-gray-900 ml-auto" />}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children &&
              node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-10 px-4 border-gray-300 hover:bg-gray-50/80 rounded-xl font-semibold transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-700" />
          <span className="text-sm text-gray-900">
            {selectedLine ? selectedLine.name : 'ラインを選択してください'}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:top-full lg:left-0 lg:right-0 lg:mt-2">
          {/* モバイル・タブレット用オーバーレイ */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* セレクターパネル */}
          <Card className="fixed bottom-0 left-0 right-0 max-h-96 lg:relative lg:bottom-auto lg:max-h-80 lg:shadow-xl bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-t-2xl lg:rounded-2xl">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-200/50 lg:hidden">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    ライン選択
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl"
                  >
                    ×
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-80 lg:h-72 custom-scrollbar">
                <div className="p-3">
                  {organizationData.map((node) => renderNode(node))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
