import React from 'react'

interface GradientButtonProps {
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  ariaLabel?: string
}

const GradientButton: React.FC<GradientButtonProps> = ({
  type = 'button',
  children,
  ariaLabel
}) => (
  <button
    type={type}
    aria-label={ariaLabel}
    className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-red-500 text-white font-medium rounded-md hover:scale-[1.02] transition-transform duration-200 outline-none border-0 shadow-none ring-0 focus:ring-0 focus:outline-none appearance-none"
  >
    {children}
  </button>
)

export default GradientButton
