import React, { memo } from 'react'
import Topbar from './Topbar'
import SectionHeader from './SectionHeader'

interface LayoutWrapperProps {
  user: {
    name: string
    id: string
  }
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
  user,
  navItems,
  title,
  subtitle,
  children,
  headerRightSection
}) => {
  return (
    <>
      <Topbar navItems={navItems} user={user} />

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
