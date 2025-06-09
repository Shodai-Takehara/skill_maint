"use client"

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Copy,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  Clock,
  Users
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn, formatDate } from '@/lib/utils'

interface InspectionTemplate {
  id: string
  name: string
  description: string
  category: string
  version: string
  status: 'active' | 'draft' | 'archived'
  fieldCount: number
  estimatedDuration: number
  createdBy: string
  createdAt: string
  lastModified: string
  usageCount: number
  equipmentTypes: string[]
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<InspectionTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<InspectionTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockTemplates: InspectionTemplate[] = [
      {
        id: '1',
        name: 'Daily Safety Check',
        description: 'Comprehensive daily safety inspection for CNC machines',
        category: 'Safety',
        version: '2.1',
        status: 'active',
        fieldCount: 12,
        estimatedDuration: 15,
        createdBy: 'John Smith',
        createdAt: '2024-01-15T10:00:00Z',
        lastModified: '2024-01-20T14:30:00Z',
        usageCount: 45,
        equipmentTypes: ['CNC Machine', 'Milling Machine']
      },
      {
        id: '2',
        name: 'Hydraulic System Check',
        description: 'Pressure and fluid level inspection for hydraulic equipment',
        category: 'Maintenance',
        version: '1.3',
        status: 'active',
        fieldCount: 8,
        estimatedDuration: 20,
        createdBy: 'Sarah Johnson',
        createdAt: '2024-01-10T09:15:00Z',
        lastModified: '2024-01-18T11:45:00Z',
        usageCount: 32,
        equipmentTypes: ['Hydraulic Press', 'Lift Equipment']
      },
      {
        id: '3',
        name: 'Quality Control Checklist',
        description: 'Product quality verification and measurement checks',
        category: 'Quality',
        version: '3.0',
        status: 'draft',
        fieldCount: 18,
        estimatedDuration: 25,
        createdBy: 'Mike Wilson',
        createdAt: '2024-01-22T16:20:00Z',
        lastModified: '2024-01-25T13:10:00Z',
        usageCount: 0,
        equipmentTypes: ['Inspection Station', 'Measuring Equipment']
      },
      {
        id: '4',
        name: 'Belt Tension Inspection',
        description: 'Conveyor belt tension and alignment check',
        category: 'Maintenance',
        version: '1.0',
        status: 'active',
        fieldCount: 6,
        estimatedDuration: 10,
        createdBy: 'Lisa Brown',
        createdAt: '2024-01-05T08:30:00Z',
        lastModified: '2024-01-05T08:30:00Z',
        usageCount: 28,
        equipmentTypes: ['Conveyor Belt']
      },
      {
        id: '5',
        name: 'Electrical Safety Check',
        description: 'Electrical system safety and grounding verification',
        category: 'Safety',
        version: '2.0',
        status: 'archived',
        fieldCount: 10,
        estimatedDuration: 12,
        createdBy: 'David Lee',
        createdAt: '2023-12-01T14:00:00Z',
        lastModified: '2023-12-15T10:20:00Z',
        usageCount: 67,
        equipmentTypes: ['All Equipment']
      }
    ]

    setTemplates(mockTemplates)
  }, [])

  useEffect(() => {
    let filtered = templates

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.equipmentTypes.some(type => 
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(template => template.status === statusFilter)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, categoryFilter, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'draft':
        return <Badge variant="warning">Draft</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Safety':
        return 'bg-red-100 text-red-800'
      case 'Maintenance':
        return 'bg-blue-100 text-blue-800'
      case 'Quality':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = Array.from(new Set(templates.map(t => t.category)))

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inspection Templates</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage inspection templates for your equipment
            </p>
          </div>
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {templates.filter(t => t.status === 'active').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold text-warning">
                    {templates.filter(t => t.status === 'draft').length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                  <p className="text-2xl font-bold">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
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
                    placeholder="Search templates, descriptions, or equipment types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="transition-all hover:shadow-soft-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                      {getStatusBadge(template.status)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Fields</p>
                    <p className="font-medium">{template.fieldCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{template.estimatedDuration} min</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Version</p>
                    <p className="font-medium">v{template.version}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Usage</p>
                    <p className="font-medium">{template.usageCount}x</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Equipment Types</p>
                  <div className="flex flex-wrap gap-1">
                    {template.equipmentTypes.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Created by {template.createdBy}</p>
                  <p>Modified {formatDate(template.lastModified)}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}