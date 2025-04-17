import React from 'react'

interface RedirectLinkProps {
  text: string
  href?: string
  ariaLabel?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ text, href = '#', ariaLabel, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    aria-label={ariaLabel ?? text}
    className="text-sm text-[#3498db] hover:underline cursor-pointer"
  >
    {text}
  </a>
)

export default RedirectLink
