import React from 'react'
import integraLogo from '../assets/integraLogo.svg'

interface AuthLayoutProps {
  title: string
  subtitle: string
  backgroundImage: string
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, backgroundImage, children }) => (
  <div
    className="flex items-center justify-center min-h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] p-10 mx-4">
      <div className="flex justify-center mb-12 mt-6">
        <img src={integraLogo} alt="INTEGRA Logo" className="h-14 w-auto" />
      </div>
      <h1 className="text-[32px] leading-none font-normal text-center text-gray-900 mb-4 whitespace-nowrap">
        {title}
      </h1>
      <p className="text-center text-gray-700 text-base mb-10 whitespace-nowrap">{subtitle}</p>
      {children}
    </div>
  </div>
)

export default AuthLayout
