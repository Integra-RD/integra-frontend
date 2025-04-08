import React from 'react'

interface RedirectLinkProps {
  text: string
  href: string
  ariaLabel?: string
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ text, href, ariaLabel }) => (
  <a
    href={href}
    aria-label={ariaLabel ?? text}
    className="text-sm text-[#3498db] hover:underline"
  >
    {text}
  </a>
)

export default RedirectLink
