"use client"

import { useState, useEffect } from 'react'
import { 
  ClipboardCheck, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  QrCode,
  FileText
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn, formatTime, getTimeUntilDue } from '@/lib/utils'

interface DashboardStats {
  todayInspections: {
    completed: number
    total: number
    overdue: number
  }
  weeklyCompletion: number
  monthlyCompletion: number
  equipmentHealth: number
}

interface UpcomingInspection {
  id: string
  equipmentName: string
  templateName: string
  dueTime: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'overdue'
}

interface RecentActivity {
  id: string
  type: 'inspection' | 'work_order' | 'alert'
  title: string
  description: string
  timestamp: Date
  status: 'completed' | 'failed' | 'warning'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    todayInspections: { completed: 12, total: 18, overdue: 3 },
    weeklyCompletion: 87,
    monthlyCompletion: 92,
    equipmentHealth: 94
  })

  const [upcomingInspections, setUpcomingInspections] = useState<UpcomingInspection[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setUpcomingInspections([
      {
        id: '1',
        equipmentName: 'CNC Machine #3',
        templateName: 'Daily Safety Check',
        dueTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'pending'
      },
      {
        id: '2',
        equipmentName: 'Hydraulic Press #1',
        templateName: 'Pressure System Check',
        dueTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        priority: 'high',
        status: 'overdue'
      },
      {
        id: '3',
        equipmentName: 'Conveyor Belt #2',
        templateName: 'Belt Tension Check',
        dueTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        status: 'pending'
      }
    ])

    setRecentActivity([
      {
        id: '1',
        type: 'inspection',
        title: 'Morning Safety Inspection',
        description: 'CNC Machine #1 - All checks passed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'completed'
      },
      {
        id: '2',
        type: 'alert',
        title: 'Temperature Warning',
        description: 'Hydraulic system approaching upper limit',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'warning'
      },
      {
        id: '3',
        type: 'work_order',
        title: 'Maintenance Required',
        description: 'Press Machine #2 - Oil change needed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'completed'
      }
    ])
  }, [])

  const completionRate = Math.round((stats.todayInspections.completed / stats.todayInspections.total) * 100)

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your equipment today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Inspections</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.todayInspections.completed}/{stats.todayInspections.total}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={completionRate} className="flex-1" />
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              {stats.todayInspections.overdue > 0 && (
                <div className="flex items-center mt-2 text-sm text-danger">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {stats.todayInspections.overdue} overdue
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyCompletion}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                +2.1% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.equipmentHealth}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-2">
                On shift today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <QrCode className="h-6 w-6" />
                <span>Scan QR Code</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <ClipboardCheck className="h-6 w-6" />
                <span>Quick Inspection</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <FileText className="h-6 w-6" />
                <span>Create Template</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <AlertTriangle className="h-6 w-6" />
                <span>Report Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming Inspections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Upcoming Inspections
                <Badge variant="secondary">{upcomingInspections.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingInspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border",
                    inspection.status === 'overdue' ? "border-danger bg-danger/5" : "border-border"
                  )}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{inspection.equipmentName}</p>
                    <p className="text-sm text-muted-foreground">{inspection.templateName}</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">
                        {inspection.status === 'overdue' ? 'Overdue by ' : 'Due in '}
                        {getTimeUntilDue(inspection.dueTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={inspection.priority === 'high' ? 'danger' : 
                              inspection.priority === 'medium' ? 'warning' : 'secondary'}
                    >
                      {inspection.priority}
                    </Badge>
                    <Button size="sm">Start</Button>
                  </div>
                </div>
              ))}
              
              {upcomingInspections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No upcoming inspections</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    activity.status === 'completed' ? "bg-success" :
                    activity.status === 'warning' ? "bg-warning" : "bg-danger"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : activity.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}