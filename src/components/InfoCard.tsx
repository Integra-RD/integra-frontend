import React from 'react'
import { cn } from '../utils/cn'

interface MiniCard {
  icon?: React.ReactNode
  title: string
  value: string
}

interface ActionButton {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

interface InfoCardProps {
  icon?: React.ReactNode
  title: string
  titleIcon?: React.ReactNode
  subtitle?: string
  body?: string
  miniCards?: MiniCard[]
  buttons?: ActionButton[]
  className?: string
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  titleIcon,
  subtitle,
  body,
  miniCards = [],
  buttons = [],
  className
}) => {
  return (
    <div className={cn('bg-[#f1f5f9] rounded-xl border border-blue-200 p-4 shadow-sm', className)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-start">
          {icon && <div className="mt-1">{icon}</div>}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              {titleIcon}
              {title}
            </h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>

      {body && <p className="text-sm text-gray-600 mb-4">{body}</p>}

      {miniCards.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {miniCards.map((card, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm"
            >
              {card.icon}
              <div>
                <p className="text-xs text-gray-400">{card.title}</p>
                <p className="font-medium text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {buttons.length > 0 && (
        <div className="flex gap-2">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={cn(
                'px-4 py-1.5 rounded-md text-sm font-medium transition',
                btn.variant === 'secondary'
                  ? 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-700 text-white hover:bg-blue-800'
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default InfoCard
