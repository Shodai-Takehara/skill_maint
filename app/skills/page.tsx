'use client';

import { useState, useEffect } from 'react';

import { Users, Plus, Search } from 'lucide-react';

import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';

import { MainLayout } from '@widgets/layout';

interface TeamMember {
  id: string;
  name: string;
  department: string;
  skills: { [skillId: string]: number }; // skill ID -> proficiency level (1-5)
}

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export default function SkillsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // サンプルスキルデータ
    setSkills([
      {
        id: 'cnc',
        name: 'CNC操作',
        category: '機械操作',
        description: 'CNCフライス盤・旋盤の操作',
      },
      {
        id: 'welding',
        name: '溶接',
        category: '加工技術',
        description: 'TIG・MIG溶接技術',
      },
      {
        id: 'hydraulic',
        name: '油圧機器',
        category: 'メンテナンス',
        description: '油圧システムの保守・修理',
      },
      {
        id: 'electrical',
        name: '電気系統',
        category: 'メンテナンス',
        description: '電気系統の故障診断・修理',
      },
      {
        id: 'plc',
        name: 'PLC',
        category: '制御技術',
        description: 'PLC プログラミング・保守',
      },
      {
        id: 'safety',
        name: '安全管理',
        category: '安全',
        description: '労働安全衛生管理',
      },
      {
        id: 'quality',
        name: '品質管理',
        category: '品質',
        description: '品質検査・管理',
      },
      {
        id: 'pneumatic',
        name: '空圧機器',
        category: 'メンテナンス',
        description: '空圧システムの保守・修理',
      },
    ]);

    // サンプルチームメンバーデータ
    setTeamMembers([
      {
        id: 'emp-001',
        name: '田中 太郎',
        department: '機械課',
        skills: {
          cnc: 5,
          welding: 3,
          hydraulic: 4,
          electrical: 2,
          safety: 4,
        },
      },
      {
        id: 'emp-002',
        name: '佐藤 花子',
        department: '保守課',
        skills: {
          electrical: 5,
          plc: 4,
          hydraulic: 3,
          pneumatic: 4,
          safety: 5,
        },
      },
      {
        id: 'emp-003',
        name: '山田 一郎',
        department: '機械課',
        skills: {
          cnc: 4,
          welding: 5,
          quality: 3,
          safety: 3,
          hydraulic: 2,
        },
      },
      {
        id: 'emp-004',
        name: '高橋 次郎',
        department: '品質課',
        skills: {
          quality: 5,
          electrical: 3,
          safety: 4,
          cnc: 2,
        },
      },
      {
        id: 'emp-005',
        name: '鈴木 三郎',
        department: '保守課',
        skills: {
          pneumatic: 5,
          hydraulic: 4,
          electrical: 3,
          plc: 2,
          safety: 4,
        },
      },
    ]);
  }, []);

  const getProficiencyColor = (level: number) => {
    switch (level) {
      case 5:
        return 'bg-blue-600';
      case 4:
        return 'bg-blue-500';
      case 3:
        return 'bg-blue-400';
      case 2:
        return 'bg-blue-300';
      case 1:
        return 'bg-blue-200';
      default:
        return 'bg-gray-200';
    }
  };

  const getProficiencyText = (level: number) => {
    switch (level) {
      case 5:
        return 'エキスパート';
      case 4:
        return '上級';
      case 3:
        return '中級';
      case 2:
        return '初級';
      case 1:
        return '基礎';
      default:
        return '未習得';
    }
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSkillCoverage = (skillId: string) => {
    const memberCount = teamMembers.length;
    const skillfulMembers = teamMembers.filter(
      (member) => member.skills[skillId] && member.skills[skillId] >= 3
    ).length;
    return memberCount > 0
      ? Math.round((skillfulMembers / memberCount) * 100)
      : 0;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ページヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              スキルマトリックス
            </h2>
            <p className="text-gray-600">
              チームメンバーのスキル習熟度と組織のスキルカバレッジ
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              スキル追加
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              メンバー追加
            </Button>
          </div>
        </div>

        {/* 検索 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="メンバー名または部署で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* スキルカバレッジサマリー */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              スキルカバレッジ概要
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill) => {
                const coverage = getSkillCoverage(skill.id);
                return (
                  <div key={skill.id} className="text-center">
                    <div className="mb-2">
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          coverage >= 75
                            ? 'bg-green-500'
                            : coverage >= 50
                              ? 'bg-yellow-500'
                              : coverage >= 25
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                        }`}
                      >
                        {coverage}%
                      </div>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-gray-500">{skill.category}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* スキルマトリックス */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              詳細スキルマトリックス
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="sticky left-0 bg-white px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200">
                      メンバー
                    </th>
                    {skills.map((skill) => (
                      <th
                        key={skill.id}
                        className="px-4 py-4 text-center text-sm font-medium text-gray-900 min-w-[100px]"
                      >
                        <div className="transform -rotate-45 whitespace-nowrap">
                          {skill.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 bg-white px-6 py-4 border-r border-gray-200">
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.department}
                          </div>
                        </div>
                      </td>
                      {skills.map((skill) => {
                        const proficiency = member.skills[skill.id] || 0;
                        return (
                          <td key={skill.id} className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getProficiencyColor(proficiency)}`}
                              >
                                {proficiency || '-'}
                              </div>
                              {proficiency > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {getProficiencyText(proficiency)}
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 凡例 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              習熟度レベル
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {[5, 4, 3, 2, 1].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${getProficiencyColor(level)}`}
                  >
                    {level}
                  </div>
                  <span className="text-sm text-gray-700">
                    {getProficiencyText(level)}
                  </span>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium bg-gray-200">
                  -
                </div>
                <span className="text-sm text-gray-700">未習得</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
