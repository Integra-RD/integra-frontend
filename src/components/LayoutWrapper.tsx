import React, { memo } from 'react'
import Topbar from './Topbar'
import SectionHeader from './SectionHeader'
import { useAuthStore } from '../store/authStore'

interface LayoutWrapperProps {
  navItems: {
    label: string
    icon: React.ReactNode
    active?: boolean
    onClick?: () => void
  }[]
  title: string
  subtitle?: string
  children: React.ReactNode
  headerRightSection?: React.ReactNode
  hideHeader?: boolean
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  navItems,
  title,
  subtitle,
  children,
  headerRightSection
}) => {
  const { userProfile } = useAuthStore()

  if (!userProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-opacity-30"></div>
      </div>
    )
  }

  return (
    <>
      <Topbar navItems={navItems} user={userProfile} />
      <main className="px-4 md:px-8 pt-6 md:pt-8 pb-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <SectionHeader title={title} subtitle={subtitle} />
          {headerRightSection}
        </div>
        {children}
      </main>
    </>
  )
}

export default memo(LayoutWrapper)
