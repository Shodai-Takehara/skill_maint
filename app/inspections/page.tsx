"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar,
  Clock,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  Play,
  QrCode,
  MoreVertical
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn, formatTime, getTimeUntilDue, isOverdue } from '@/lib/utils'

interface Inspection {
  id: string
  equipmentName: string
  equipmentId: string
  templateName: string
  templateId: string
  scheduledTime: string
  estimatedDuration: number
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  assignedTo?: string
  location: string
  lastCompleted?: string
  completionRate?: number
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockInspections: Inspection[] = [
      {
        id: '1',
        equipmentName: 'CNC Machine #3',
        equipmentId: 'CNC-003',
        templateName: 'Daily Safety Check',
        templateId: 'template-1',
        scheduledTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        estimatedDuration: 15,
        priority: 'high',
        status: 'overdue',
        assignedTo: 'John Smith',
        location: 'Floor A, Station 3',
        lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completionRate: 95
      },
      {
        id: '2',
        equipmentName: 'Hydraulic Press #1',
        equipmentId: 'HP-001',
        templateName: 'Pressure System Check',
        templateId: 'template-2',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        estimatedDuration: 20,
        priority: 'high',
        status: 'pending',
        assignedTo: 'Sarah Johnson',
        location: 'Floor B, Station 1',
        lastCompleted: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        completionRate: 88
      },
      {
        id: '3',
        equipmentName: 'Conveyor Belt #2',
        equipmentId: 'CB-002',
        templateName: 'Belt Tension Check',
        templateId: 'template-3',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 10,
        priority: 'medium',
        status: 'pending',
        location: 'Floor A, Station 5',
        lastCompleted: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        completionRate: 92
      },
      {
        id: '4',
        equipmentName: 'Welding Station #4',
        equipmentId: 'WS-004',
        templateName: 'Gas Level Check',
        templateId: 'template-4',
        scheduledTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedDuration: 5,
        priority: 'low',
        status: 'completed',
        assignedTo: 'Mike Wilson',
        location: 'Floor C, Station 4',
        lastCompleted: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        completionRate: 100
      }
    ]

    setInspections(mockInspections)
  }, [])

  useEffect(() => {
    let filtered = inspections

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inspection =>
        inspection.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(inspection => inspection.priority === priorityFilter)
    }

    setFilteredInspections(filtered)
  }, [inspections, searchTerm, statusFilter, priorityFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High</Badge>
      case 'medium':
        return <Badge variant="warning">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const todayStats = {
    total: inspections.length,
    completed: inspections.filter(i => i.status === 'completed').length,
    overdue: inspections.filter(i => i.status === 'overdue').length,
    pending: inspections.filter(i => i.status === 'pending').length
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Inspections</h1>
            <p className="text-muted-foreground mt-2">
              Today's inspection schedule and progress
            </p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Link href="/inspections/quick">
              <Button>
                <QrCode className="h-4 w-4 mr-2" />
                Quick Scan
              </Button>
            </Link>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{todayStats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{todayStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{todayStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-danger">{todayStats.overdue}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-danger" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment, templates, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspections List */}
        <div className="space-y-4">
          {filteredInspections.map((inspection) => (
            <Card key={inspection.id} className={cn(
              "transition-all hover:shadow-soft-lg",
              inspection.status === 'overdue' && "border-danger"
            )}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{inspection.equipmentName}</h3>
                        <p className="text-sm text-muted-foreground">{inspection.templateName}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(inspection.status)}
                        {getPriorityBadge(inspection.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {inspection.status === 'overdue' ? 'Overdue by ' : 'Due in '}
                          {getTimeUntilDue(inspection.scheduledTime)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{inspection.estimatedDuration} min</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{inspection.location}</span>
                      </div>

                      {inspection.assignedTo && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Assigned:</span>
                          <span>{inspection.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    {inspection.lastCompleted && (
                      <div className="text-sm text-muted-foreground">
                        Last completed: {formatTime(inspection.lastCompleted)} 
                        {inspection.completionRate && (
                          <span className="ml-2">({inspection.completionRate}% completion rate)</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 lg:ml-6">
                    {inspection.status === 'pending' || inspection.status === 'overdue' ? (
                      <Button className="touch-target">
                        <Play className="h-4 w-4 mr-2" />
                        Start Inspection
                      </Button>
                    ) : inspection.status === 'in-progress' ? (
                      <Button variant="warning" className="touch-target">
                        <Clock className="h-4 w-4 mr-2" />
                        Continue
                      </Button>
                    ) : (
                      <Button variant="outline" className="touch-target">
                        View Results
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInspections.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No inspections found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}