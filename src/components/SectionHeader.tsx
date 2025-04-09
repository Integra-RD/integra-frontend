import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    <h1 className="text-3xl font-semibold mb-2 text-gray-900">{title}</h1>
    {subtitle && <p className="text-gray-600">{subtitle}</p>}
  </div>
)

export default SectionHeader
