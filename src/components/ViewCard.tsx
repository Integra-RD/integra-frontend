import React from 'react'
import {
  ArrowTopRightOnSquareIcon,
  Cog8ToothIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { cn } from '../utils/cn'

interface ViewCardProps {
  title?: string
  subtitle?: string
  titleIcon?: React.ReactNode
  subtitleIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
  className?: string
  bgColor?: string
  textColor?: string
  variant?: 'compact' | 'detailed'
  showExternalLink?: boolean
  onExternalClick?: () => void
  showInternalLink?: boolean
  onInternalClick?: () => void
  showDownloadLink?: boolean
  onDownloadClick?: () => void
  showDelete?: boolean
  onDeleteClick?: () => void
  showEditLink?: boolean
  onEditClick?: () => void
}

const ViewCard: React.FC<ViewCardProps> = ({
  title,
  subtitle,
  titleIcon,
  subtitleIcon,
  rightIcon,
  children,
  className,
  bgColor = 'bg-[#f1f5f9]',
  textColor = 'text-gray-900',
  variant = 'detailed',
  showExternalLink = false,
  onExternalClick,
  showInternalLink = false,
  onInternalClick,
  showDownloadLink = false,
  onDownloadClick,
  showDelete = false,
  onDeleteClick,
  showEditLink = false,
  onEditClick
}) => {
  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        'relative rounded-xl p-4 shadow-sm',
        bgColor,
        isCompact ? '' : 'border border-blue-200 space-y-4',
        className
      )}
    >
      {(title || subtitle) && (
        <div
          className={cn(
            'w-full',
            isCompact ? 'flex items-center justify-between' : 'flex items-start gap-2'
          )}
        >
          <div className="flex-1">
            {title && (
              <div
                className={cn(
                  textColor,
                  isCompact
                    ? 'text-sm font-medium text-slate-800'
                    : 'text-sm font-semibold flex items-center gap-1'
                )}
              >
                {titleIcon}
                <span>{title}</span>
              </div>
            )}

            {subtitle && (
              <div
                className={cn(
                  isCompact
                    ? 'mt-1 text-3xl font-semibold text-slate-900'
                    : 'mt-0.5 text-xs text-gray-500 flex items-center gap-1'
                )}
              >
                {subtitleIcon}
                <span>{subtitle}</span>
              </div>
            )}
          </div>

          {isCompact && rightIcon && (
            <div className="ml-4 flex-shrink-0 text-slate-700">{rightIcon}</div>
          )}
        </div>
      )}

      {children}

      {(showExternalLink || showInternalLink || showDownloadLink || showEditLink) && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {showDownloadLink && (
            <ArrowDownTrayIcon
              onClick={onDownloadClick}
              title="Descargar"
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-blue-600 transition"
            />
          )}

          {showExternalLink && (
            <ArrowTopRightOnSquareIcon
              onClick={onExternalClick}
              title="Abrir enlace externo"
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-blue-600 transition"
            />
          )}

          {showInternalLink && (
            <Cog8ToothIcon
              onClick={onInternalClick}
              title="Configuraciones"
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-blue-600 transition"
            />
          )}

          {showDelete && (
            <TrashIcon
              onClick={onDeleteClick}
              title="Eliminar"
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-red-500 transition"
            />
          )}

          {showEditLink && (
            <PencilSquareIcon
              onClick={onEditClick}
              title="Editar"
              className="w-5 h-5 cursor-pointer text-slate-400 hover:text-blue-600 transition"
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ViewCard
