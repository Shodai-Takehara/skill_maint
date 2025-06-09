"use client"

import { useState } from 'react'
import { QrCode, Search, Camera, MapPin, Clock, Play } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Equipment {
  id: string
  name: string
  code: string
  location: string
  status: 'operational' | 'maintenance' | 'offline'
  nextInspection?: {
    templateName: string
    dueTime: string
    priority: 'high' | 'medium' | 'low'
  }
}

export default function QuickInspectionPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [scanMode, setScanMode] = useState(false)

  // Mock equipment data
  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'CNC Machine #3',
      code: 'CNC-003',
      location: 'Floor A, Station 3',
      status: 'operational',
      nextInspection: {
        templateName: 'Daily Safety Check',
        dueTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        priority: 'high'
      }
    },
    {
      id: '2',
      name: 'Hydraulic Press #1',
      code: 'HP-001',
      location: 'Floor B, Station 1',
      status: 'operational',
      nextInspection: {
        templateName: 'Pressure System Check',
        dueTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      }
    },
    {
      id: '3',
      name: 'Conveyor Belt #2',
      code: 'CB-002',
      location: 'Floor A, Station 5',
      status: 'maintenance'
    },
    {
      id: '4',
      name: 'Welding Station #4',
      code: 'WS-004',
      location: 'Floor C, Station 4',
      status: 'operational'
    }
  ]

  const filteredEquipment = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Operational</Badge>
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>
      case 'offline':
        return <Badge variant="danger">Offline</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High Priority</Badge>
      case 'medium':
        return <Badge variant="warning">Medium Priority</Badge>
      default:
        return <Badge variant="secondary">Low Priority</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quick Inspection</h1>
          <p className="text-muted-foreground mt-2">
            Scan QR code or search for equipment to start an inspection
          </p>
        </div>

        {/* QR Scanner / Search */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!scanMode ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Point your camera at the equipment QR code
                  </p>
                  <Button 
                    onClick={() => setScanMode(true)}
                    className="touch-target"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanner
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-48 h-48 mx-auto mb-4 bg-black rounded-lg flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-white rounded-lg animate-pulse" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Scanning for QR code...
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setScanMode(false)}
                    className="touch-target"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, code, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors touch-target",
                      selectedEquipment?.id === eq.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-accent"
                    )}
                    onClick={() => setSelectedEquipment(eq)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{eq.name}</p>
                        <p className="text-sm text-muted-foreground">{eq.code}</p>
                      </div>
                      {getStatusBadge(eq.status)}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {eq.location}
                    </div>
                  </div>
                ))}

                {filteredEquipment.length === 0 && searchTerm && (
                  <div className="text-center py-4 text-muted-foreground">
                    No equipment found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Equipment */}
        {selectedEquipment && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEquipment.name}</h3>
                    <p className="text-muted-foreground">{selectedEquipment.code}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEquipment.location}</span>
                    </div>
                    {getStatusBadge(selectedEquipment.status)}
                  </div>

                  {selectedEquipment.nextInspection && (
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Next Inspection Due</p>
                        {getPriorityBadge(selectedEquipment.nextInspection.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedEquipment.nextInspection.templateName}
                      </p>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(selectedEquipment.nextInspection.dueTime).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 lg:ml-6">
                  {selectedEquipment.nextInspection ? (
                    <Button size="lg" className="touch-target">
                      <Play className="h-4 w-4 mr-2" />
                      Start Inspection
                    </Button>
                  ) : (
                    <Button size="lg" variant="outline" className="touch-target">
                      <Search className="h-4 w-4 mr-2" />
                      View Templates
                    </Button>
                  )}
                  
                  <Button variant="outline" size="lg" className="touch-target">
                    Equipment Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Equipment */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Inspected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {equipment.slice(0, 3).map((eq) => (
                <div
                  key={eq.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors touch-target"
                  onClick={() => setSelectedEquipment(eq)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{eq.name}</p>
                    {getStatusBadge(eq.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{eq.code}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {eq.location}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}