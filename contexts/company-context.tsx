"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Company {
  id: string
  name: string
  logo?: string
  timezone: string
  locale: string
}

interface CompanyContextType {
  currentCompany: Company | null
  companies: Company[]
  switchCompany: (companyId: string) => void
  isLoading: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading companies from API
    const loadCompanies = async () => {
      setIsLoading(true)
      
      // Mock data - in real app, this would come from API
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'Acme Manufacturing',
          timezone: 'America/New_York',
          locale: 'en-US'
        },
        {
          id: '2',
          name: 'TechCorp Industries',
          timezone: 'America/Los_Angeles',
          locale: 'en-US'
        },
        {
          id: '3',
          name: 'Global Dynamics',
          timezone: 'Europe/London',
          locale: 'en-GB'
        }
      ]
      
      setCompanies(mockCompanies)
      
      // Set default company or load from localStorage
      const savedCompanyId = localStorage.getItem('selectedCompanyId')
      const defaultCompany = savedCompanyId 
        ? mockCompanies.find(c => c.id === savedCompanyId) || mockCompanies[0]
        : mockCompanies[0]
      
      setCurrentCompany(defaultCompany)
      setIsLoading(false)
    }

    loadCompanies()
  }, [])

  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId)
    if (company) {
      setCurrentCompany(company)
      localStorage.setItem('selectedCompanyId', companyId)
    }
  }

  return (
    <CompanyContext.Provider value={{
      currentCompany,
      companies,
      switchCompany,
      isLoading
    }}>
      {children}
    </CompanyContext.Provider>
  )
}