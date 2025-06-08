'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { MainLayout } from '@widgets/layout';
import {
  Search,
  QrCode,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Equipment {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'operational' | 'maintenance' | 'breakdown';
  lastMaintenance: string;
  nextMaintenance: string;
  image: string;
  qrCode: string;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // サンプル設備データ
    setEquipment([
      {
        id: 'EQ-001',
        name: 'CNCフライス盤 #1',
        model: 'DMG MORI DMU 50',
        location: '第1工場 A棟',
        status: 'operational',
        lastMaintenance: '2024-12-15',
        nextMaintenance: '2025-01-15',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-001',
      },
      {
        id: 'EQ-002',
        name: 'プレス機 #3',
        model: 'AIDA NC1-250',
        location: '第2工場 B棟',
        status: 'maintenance',
        lastMaintenance: '2024-12-20',
        nextMaintenance: '2025-02-20',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-002',
      },
      {
        id: 'EQ-003',
        name: '溶接機 #7',
        model: 'Lincoln MIG-500',
        location: '第1工場 C棟',
        status: 'operational',
        lastMaintenance: '2024-11-30',
        nextMaintenance: '2025-01-30',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-003',
      },
      {
        id: 'EQ-004',
        name: 'コンベア #2',
        model: 'FlexLink X85',
        location: '第2工場 A棟',
        status: 'breakdown',
        lastMaintenance: '2024-12-10',
        nextMaintenance: '2025-01-10',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-004',
      },
      {
        id: 'EQ-005',
        name: 'CNCフライス盤 #2',
        model: 'Okuma MB-5000H',
        location: '第1工場 A棟',
        status: 'operational',
        lastMaintenance: '2024-12-25',
        nextMaintenance: '2025-02-25',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-005',
      },
      {
        id: 'EQ-006',
        name: 'プレス機 #5',
        model: 'AMADA TP-110',
        location: '第2工場 B棟',
        status: 'operational',
        lastMaintenance: '2024-12-18',
        nextMaintenance: '2025-01-18',
        image:
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
        qrCode: 'QR-EQ-006',
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
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="設備名、型式、場所で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべてのステータス</option>
                <option value="operational">稼働中</option>
                <option value="maintenance">メンテナンス中</option>
                <option value="breakdown">故障</option>
              </select>
              <Link href="/equipment/scan">
                <Button className="h-12 bg-blue-600 hover:bg-blue-700">
                  <QrCode className="h-4 w-4 mr-2" />
                  QRスキャン
                </Button>
              </Link>
            </div>
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
                        <p className="text-xs text-gray-500">{item.location}</p>
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
