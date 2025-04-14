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
  hideHeader?: boolean
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  user,
  navItems,
  title,
  subtitle,
  children
}) => {
  return (
    <>
      <Topbar
        navItems={navItems}
        user={user}
        onNotificationClick={() => console.log('🔔 Notification clicked')}
      />

      <main className="px-4 md:px-8 pt-6 md:pt-8 pb-12 max-w-7xl mx-auto">
        {<SectionHeader title={title} subtitle={subtitle} />}
        {children}
      </main>
    </>
  )
}

export default memo(LayoutWrapper)
