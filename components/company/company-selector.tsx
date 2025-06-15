"use client"

import { useState } from 'react'
import { Check, ChevronsUpDown, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCompany } from '@/contexts/company-context'

export function CompanySelector() {
  const { currentCompany, companies, switchCompany, isLoading } = useCompany()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="w-48 h-10 bg-muted animate-pulse rounded-md" />
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-48 justify-between"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <Building2 className="mr-2 h-4 w-4" />
          <span className="truncate">
            {currentCompany?.name || "会社を選択..."}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-soft-lg z-50">
          <div className="p-1">
            {companies.map((company) => (
              <button
                key={company.id}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors touch-target",
                  currentCompany?.id === company.id && "bg-accent"
                )}
                onClick={() => {
                  switchCompany(company.id)
                  setOpen(false)
                }}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span className="flex-1 text-left truncate">{company.name}</span>
                {currentCompany?.id === company.id && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}