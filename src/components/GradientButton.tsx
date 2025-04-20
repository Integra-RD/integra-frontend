import React from 'react'

export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel?: string
}

const GradientButton: React.FC<GradientButtonProps> = ({
  type = 'button',
  children,
  ariaLabel,
  disabled,
  className = '',
  ...rest
}) => (
  <button
    type={type}
    aria-label={ariaLabel}
    disabled={disabled}
    className={`
      w-full py-3 px-4
      bg-gradient-to-r from-blue-400 via-indigo-500 to-red-500
      text-white font-medium rounded-md
      hover:scale-[1.02] transition-transform duration-200
      outline-none border-0 shadow-none ring-0 focus:ring-0 focus:outline-none appearance-none
      ${className}
    `}
    {...rest}
  >
    {children}
  </button>
)

export default GradientButton
