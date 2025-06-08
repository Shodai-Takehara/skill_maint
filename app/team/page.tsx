'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Phone, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  skills: string[];
  certifications: {
    name: string;
    expiry: string;
    status: 'valid' | 'expiring' | 'expired';
  }[];
  workHistory: { equipment: string; date: string; type: string }[];
  joinDate: string;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  useEffect(() => {
    // サンプルチームメンバーデータ
    setTeamMembers([
      {
        id: 'emp-001',
        name: '田中 太郎',
        position: '主任技師',
        department: '機械課',
        email: 'tanaka@company.com',
        phone: '090-1234-5678',
        skills: ['CNC操作', '溶接', '油圧機器', '安全管理'],
        certifications: [
          {
            name: 'フォークリフト運転技能講習',
            expiry: '2025-06-15',
            status: 'valid',
          },
          {
            name: '第二種電気工事士',
            expiry: '2025-03-20',
            status: 'expiring',
          },
          { name: 'クレーン運転士', expiry: '2026-01-10', status: 'valid' },
        ],
        workHistory: [
          {
            equipment: 'CNCフライス盤 #3',
            date: '2024-12-29',
            type: '定期保守',
          },
          { equipment: 'プレス機 #5', date: '2024-12-25', type: '故障修理' },
          { equipment: 'コンベア #1', date: '2024-12-20', type: '部品交換' },
        ],
        joinDate: '2020-04-01',
      },
      {
        id: 'emp-002',
        name: '佐藤 花子',
        position: '技師',
        department: '保守課',
        email: 'sato@company.com',
        phone: '090-2345-6789',
        skills: ['電気系統', 'PLC', '油圧機器', '空圧機器', '安全管理'],
        certifications: [
          { name: '第一種電気工事士', expiry: '2027-08-30', status: 'valid' },
          {
            name: '高圧ガス製造保安責任者',
            expiry: '2025-02-10',
            status: 'expiring',
          },
          { name: '労働安全衛生管理者', expiry: '2026-09-15', status: 'valid' },
        ],
        workHistory: [
          { equipment: '溶接機 #7', date: '2024-12-28', type: '電気系統点検' },
          {
            equipment: 'コンプレッサー #2',
            date: '2024-12-22',
            type: '定期保守',
          },
          {
            equipment: 'CNCフライス盤 #1',
            date: '2024-12-18',
            type: 'PLC調整',
          },
        ],
        joinDate: '2021-07-15',
      },
      {
        id: 'emp-003',
        name: '山田 一郎',
        position: '技師',
        department: '機械課',
        email: 'yamada@company.com',
        phone: '090-3456-7890',
        skills: ['CNC操作', '溶接', '品質管理', '安全管理'],
        certifications: [
          { name: 'ガス溶接技能講習', expiry: '2025-12-05', status: 'valid' },
          {
            name: 'アーク溶接特別教育',
            expiry: '2024-11-30',
            status: 'expired',
          },
          { name: '研削といし特別教育', expiry: '2025-04-20', status: 'valid' },
        ],
        workHistory: [
          { equipment: 'コンベア #2', date: '2024-12-29', type: 'ベルト交換' },
          { equipment: '溶接機 #3', date: '2024-12-24', type: '溶接作業' },
          {
            equipment: 'CNCフライス盤 #2',
            date: '2024-12-19',
            type: '加工作業',
          },
        ],
        joinDate: '2019-10-01',
      },
      {
        id: 'emp-004',
        name: '高橋 次郎',
        position: '係長',
        department: '品質課',
        email: 'takahashi@company.com',
        phone: '090-4567-8901',
        skills: ['品質管理', '電気系統', '安全管理', 'CNC操作'],
        certifications: [
          { name: 'QC検定2級', expiry: '2026-03-31', status: 'valid' },
          { name: 'ISO9001内部監査員', expiry: '2025-07-20', status: 'valid' },
          {
            name: '衛生管理者第一種',
            expiry: '2025-01-15',
            status: 'expiring',
          },
        ],
        workHistory: [
          { equipment: 'プレス機 #7', date: '2024-12-27', type: '品質検査' },
          {
            equipment: 'CNCフライス盤 #3',
            date: '2024-12-23',
            type: '寸法測定',
          },
          { equipment: '測定器 #1', date: '2024-12-21', type: '校正作業' },
        ],
        joinDate: '2018-02-01',
      },
      {
        id: 'emp-005',
        name: '鈴木 三郎',
        position: '技師',
        department: '保守課',
        email: 'suzuki@company.com',
        phone: '090-5678-9012',
        skills: ['空圧機器', '油圧機器', '電気系統', 'PLC', '安全管理'],
        certifications: [
          {
            name: '高圧ガス製造保安責任者',
            expiry: '2025-11-30',
            status: 'valid',
          },
          { name: 'ボイラー技士二級', expiry: '2025-05-10', status: 'valid' },
          {
            name: '危険物取扱者乙種4類',
            expiry: '2026-12-25',
            status: 'valid',
          },
        ],
        workHistory: [
          {
            equipment: 'コンプレッサー #3',
            date: '2024-12-30',
            type: '定期点検',
          },
          {
            equipment: '空圧システム #1',
            date: '2024-12-26',
            type: '配管修理',
          },
          {
            equipment: '油圧ポンプ #2',
            date: '2024-12-22',
            type: 'オイル交換',
          },
        ],
        joinDate: '2022-03-15',
      },
    ]);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  const getCertificationBadgeColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-500 text-white';
      case 'expiring':
        return 'bg-yellow-500 text-white';
      case 'expired':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCertificationStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return '有効';
      case 'expiring':
        return '期限間近';
      case 'expired':
        return '期限切れ';
      default:
        return '不明';
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDepartment =
      filterDepartment === 'all' || member.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(
    new Set(teamMembers.map((member) => member.department))
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              チーム管理
            </h2>
            <p className="text-gray-600">チームメンバーの情報とスキル管理</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            新規メンバー追加
          </Button>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="名前、役職、スキルで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべての部署</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* チームメンバーグリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <Link href={`/team/${member.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-16 w-16 bg-blue-600">
                      <AvatarFallback className="text-white font-semibold text-lg">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <p className="text-sm text-gray-500">
                        {member.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        入社:{' '}
                        {new Date(member.joinDate).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'numeric',
                        })}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* 連絡先 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    {/* スキル */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        保有スキル
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 4).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.skills.length - 4}個
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 資格・認定 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        資格・認定
                      </h4>
                      <div className="space-y-1">
                        {member.certifications
                          .slice(0, 2)
                          .map((cert, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-gray-600 truncate flex-1">
                                {cert.name}
                              </span>
                              <Badge
                                className={`ml-2 ${getCertificationBadgeColor(cert.status)}`}
                              >
                                {getCertificationStatusText(cert.status)}
                              </Badge>
                            </div>
                          ))}
                        {member.certifications.length > 2 && (
                          <div className="text-xs text-gray-500">
                            他 {member.certifications.length - 2} 件
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 最近の作業履歴 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        最近の作業
                      </h4>
                      <div className="space-y-1">
                        {member.workHistory.slice(0, 2).map((work, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex-1">
                              <span className="text-gray-900">
                                {work.equipment}
                              </span>
                              <span className="text-gray-500 ml-1">
                                - {work.type}
                              </span>
                            </div>
                            <span className="text-gray-500 ml-2">
                              {new Date(work.date).toLocaleDateString('ja-JP', {
                                month: 'numeric',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              メンバーが見つかりません
            </h3>
            <p className="text-gray-600">検索条件を変更してお試しください。</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
