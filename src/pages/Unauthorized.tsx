import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldExclamationIcon,
  ArrowLeftIcon,
  HomeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import confetti from 'canvas-confetti'
import GradientButton from '../components/GradientButton'

const Unauthorized: React.FC = () => {
  const navigate = useNavigate()
  const [clickCount, setClickCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  const handleShieldClick = () => {
    setClickCount(prev => {
      const next = prev + 1

      if (prev >= 5) {
        // keep firing small bursts once fully “broken”
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
      } else if (next === 5) {
        // big burst at the moment it breaks
        setShowEasterEgg(true)
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      }

      return next
    })
  }

  const getCrackElements = (): React.ReactNode[] => {
    const cracks: React.ReactNode[] = []

    if (clickCount >= 1) {
      cracks.push(
        <div key="c1" className="absolute top-[20%] left-[30%] w-[40%] h-[30%] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50,0 L45,50 L60,100"
              fill="none"
              stroke="rgba(255,0,0,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-crack"
            />
          </svg>
        </div>
      )
    }

    if (clickCount >= 2) {
      cracks.push(
        <div
          key="c2"
          className="absolute top-[10%] right-[20%] w-[50%] h-[40%] pointer-events-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M0,30 L50,50 L100,40"
              fill="none"
              stroke="rgba(255,0,0,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-crack animation-delay-300"
            />
          </svg>
        </div>
      )
    }

    if (clickCount >= 3) {
      cracks.push(
        <div
          key="c3"
          className="absolute bottom-[20%] left-[10%] w-[80%] h-[40%] pointer-events-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M20,100 L40,60 L70,80 L90,30"
              fill="none"
              stroke="rgba(255,0,0,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-crack animation-delay-600"
            />
          </svg>
        </div>
      )
    }

    if (clickCount >= 4) {
      cracks.push(
        <div key="c4" className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10,10 L30,50 L10,90 M90,10 L70,50 L90,90 M50,0 L50,100"
              fill="none"
              stroke="rgba(255,0,0,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        </div>
      )
    }

    return cracks
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E6F2F7] p-4">
      <div className="relative max-w-md w-full overflow-hidden">
        {/* background blobs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#D0E7F2] mix-blend-multiply filter blur-xl opacity-50 animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#B8DFF0] mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute top-40 -right-20 w-40 h-40 bg-[#C8E4F4] mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000" />

        <div className="relative bg-white p-8 shadow-md border border-[#29638A]/20 text-center">
          <div
            onClick={handleShieldClick}
            className={`relative mx-auto w-24 h-24 mb-6 cursor-pointer ${
              clickCount < 5 ? 'animate-bounce' : ''
            }`}
          >
            <div className="absolute inset-0 bg-red-100 rounded-full" />
            <ShieldExclamationIcon
              className={`relative w-full h-full text-red-500 ${
                clickCount >= 5 ? 'opacity-50' : ''
              }`}
            />
            {getCrackElements()}
            {clickCount > 0 && clickCount < 5 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {5 - clickCount}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-2 text-red-500">¡Alto Ahí!</h1>
          <h2 className="text-2xl font-semibold mb-4 text-red-500">ERROR 401</h2>

          <p className="mb-6 font-medium text-[#29638A]">No tienes permiso para ver esta página.</p>

          {showEasterEgg && (
            <p className="mb-6 block mt-2 text-[#29638A] font-light">
              ¡Pero has descubierto confetti! 🎉
            </p>
          )}

          {showEasterEgg && (
            <div className="mt-6 mb-6 p-4 bg-[#E6F2F7] rounded-lg">
              <p className="flex items-center justify-center text-[#29638A]">
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Código secreto: UNAUTHORIZED_FUN
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton
              type="button"
              onClick={() => navigate(-1)}
              ariaLabel="Volver"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Volver
            </GradientButton>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#29638A] text-[#29638A] font-medium transition-all duration-300 hover:bg-[#29638A]/10"
              aria-label="Ir al Login"
            >
              <HomeIcon className="w-5 h-5" />
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
