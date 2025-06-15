'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Search,
  QrCode,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Plus,
  MapPin,
  Layers,
  Filter,
} from 'lucide-react';

import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { FilterSelectBox } from '@shared/ui';

import { MainLayout } from '@widgets/layout';

interface Equipment {
  id: string;
  name: string;
  model: string;
  location: string;
  line: string;
  section?: string;
  status: 'operational' | 'maintenance' | 'breakdown';
  lastMaintenance: string;
  nextMaintenance: string;
  image: string;
  qrCode: string;
}

// マスタデータ
const LOCATIONS = ['G4棟', 'G5棟', 'A1棟', 'A2棟', 'B1棟', 'B2棟'];
const LINES = ['GAPLライン', '第1ライン', '第2ライン', 'プレス1ライン', 'プレス2ライン', '溶接ライン'];
const SECTIONS = ['前面', '後面', '中央', '炉部', '制御部', 'ユーティリティ'];

// フィルターオプション
const STATUS_OPTIONS = [
  { value: 'all', label: 'すべて' },
  { value: 'operational', label: '稼働中' },
  { value: 'maintenance', label: 'メンテナンス中' },
  { value: 'breakdown', label: '故障' },
];

const LOCATION_OPTIONS = [
  { value: 'all', label: 'すべて' },
  ...LOCATIONS.map(location => ({ value: location, label: location })),
];

const LINE_OPTIONS = [
  { value: 'all', label: 'すべて' },
  ...LINES.map(line => ({ value: line, label: line })),
];

const SECTION_OPTIONS = [
  { value: 'all', label: 'すべて' },
  ...SECTIONS.map(section => ({ value: section, label: section })),
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterLine, setFilterLine] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');

  // フィルターリセット
  const resetFilters = () => {
    setFilterStatus('all');
    setFilterLocation('all');
    setFilterLine('all');
    setFilterSection('all');
    setSearchTerm('');
  };

  // アクティブフィルター数
  const activeFiltersCount = [
    filterStatus !== 'all',
    filterLocation !== 'all',
    filterLine !== 'all',
    filterSection !== 'all',
  ].filter(Boolean).length;

  useEffect(() => {
    // サンプル設備データ
    setEquipment([
      {
        id: 'EQ-001',
        name: '結束機',
        model: 'DMG MORI DMU 50',
        location: 'G4棟',
        line: 'GAPLライン',
        section: '後面',
        status: 'operational',
        lastMaintenance: '2024-12-15',
        nextMaintenance: '2025-01-15',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-001',
      },
      {
        id: 'EQ-002',
        name: 'リール',
        model: 'AIDA NC1-250',
        location: 'G4棟',
        line: 'GAPLライン',
        section: '後面',
        status: 'maintenance',
        lastMaintenance: '2024-12-20',
        nextMaintenance: '2025-02-20',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-002',
      },
      {
        id: 'EQ-003',
        name: 'コイルカー',
        model: 'Lincoln MIG-500',
        location: 'G4棟',
        line: 'GAPLライン',
        section: '後面',
        status: 'operational',
        lastMaintenance: '2024-11-30',
        nextMaintenance: '2025-01-30',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-003',
      },
      {
        id: 'EQ-004',
        name: '制御盤',
        model: 'FlexLink X85',
        location: 'G4棟',
        line: 'GAPLライン',
        section: '前面',
        status: 'breakdown',
        lastMaintenance: '2024-12-10',
        nextMaintenance: '2025-01-10',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-004',
      },
      {
        id: 'EQ-005',
        name: 'CNCフライス盤 #1',
        model: 'Okuma MB-5000H',
        location: 'A1棟',
        line: '第1ライン',
        status: 'operational',
        lastMaintenance: '2024-12-25',
        nextMaintenance: '2025-02-25',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-005',
      },
      {
        id: 'EQ-006',
        name: 'プレス機 #1',
        model: 'AMADA TP-110',
        location: 'B1棟',
        line: 'プレス1ライン',
        section: '中央',
        status: 'operational',
        lastMaintenance: '2024-12-18',
        nextMaintenance: '2025-01-18',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-006',
      },
      {
        id: 'EQ-007',
        name: '溶接機 #1',
        model: 'Lincoln Electric',
        location: 'G5棟',
        line: '溶接ライン',
        section: '炉部',
        status: 'operational',
        lastMaintenance: '2024-12-22',
        nextMaintenance: '2025-01-22',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-007',
      },
      {
        id: 'EQ-008',
        name: '検査装置',
        model: 'KEYENCE CV-X',
        location: 'A2棟',
        line: '第2ライン',
        status: 'maintenance',
        lastMaintenance: '2024-12-19',
        nextMaintenance: '2025-01-19',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-008',
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500 text-white';
      case 'maintenance':
        return 'bg-yellow-500 text-white';
      case 'breakdown':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return '稼働中';
      case 'maintenance':
        return 'メンテナンス中';
      case 'breakdown':
        return '故障';
      default:
        return '不明';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'breakdown':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.line.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.section && item.section.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    const matchesLine = filterLine === 'all' || item.line === filterLine;
    const matchesSection = filterSection === 'all' || item.section === filterSection;
    
    return matchesSearch && matchesStatus && matchesLocation && matchesLine && matchesSection;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">設備管理</h2>
          <p className="text-gray-600">すべての製造設備の状況確認と管理</p>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* 検索バー */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="設備名、型式、ライン、セクションで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/equipment/new">
                <Button className="h-12 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  設備登録
                </Button>
              </Link>
              <Link href="/equipment/scan">
                <Button className="h-12 bg-blue-600 hover:bg-blue-700">
                  <QrCode className="h-4 w-4 mr-2" />
                  QRスキャン
                </Button>
              </Link>
            </div>
          </div>

          {/* フィルター */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">フィルター</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}個適用中
                  </Badge>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  リセット
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ステータス
                </label>
                <FilterSelectBox
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                  placeholder="ステータス"
                  options={STATUS_OPTIONS}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  ロケーション
                </label>
                <FilterSelectBox
                  value={filterLocation}
                  onValueChange={setFilterLocation}
                  placeholder="ロケーション"
                  options={LOCATION_OPTIONS}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ライン
                </label>
                <FilterSelectBox
                  value={filterLine}
                  onValueChange={setFilterLine}
                  placeholder="ライン"
                  options={LINE_OPTIONS}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <Layers className="inline h-3 w-3 mr-1" />
                  セクション
                </label>
                <FilterSelectBox
                  value={filterSection}
                  onValueChange={setFilterSection}
                  placeholder="セクション"
                  options={SECTION_OPTIONS}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {filteredEquipment.length}件の設備が見つかりました
            {equipment.length !== filteredEquipment.length && (
              <span className="text-gray-400 ml-1">
                (全{equipment.length}件中)
              </span>
            )}
          </div>
        </div>

        {/* 設備グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card
              key={item.id}
              className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <Link href={`/equipment/${item.id}`}>
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={getStatusColor(item.status)}
                        variant="default"
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(item.status)}
                          <span>{getStatusText(item.status)}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.model}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.location} - {item.line}
                          </div>
                          {item.section && (
                            <div className="flex items-center">
                              <Layers className="h-3 w-3 mr-1" />
                              {item.section}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <QrCode className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">前回保守:</span>
                        <span className="font-medium">
                          {new Date(item.lastMaintenance).toLocaleDateString(
                            'ja-JP'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">次回保守:</span>
                        <span className="font-medium text-blue-600">
                          {new Date(item.nextMaintenance).toLocaleDateString(
                            'ja-JP'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          保守予約
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Wrench className="h-4 w-4 mr-1" />
                          作業指示
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              設備が見つかりません
            </h3>
            <p className="text-gray-600">検索条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
