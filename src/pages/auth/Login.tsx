'use client'

import type React from 'react'
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import integraLogo from '../../assets/integraLogo.svg'
import globeImage from '../../assets/globe.svg'

// TODO: Revise gradient, font weights, margins, border of submit button, restore pw and add actual logic for auth
interface FormInputProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  icon: React.ReactNode
  marginBottom?: string
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  marginBottom = 'mb-6',
}) => (
  <div className={marginBottom}>
    <label htmlFor={id} className="block text-gray-800 text-lg mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md text-gray-500 focus:outline-none"
        required
      />
    </div>
  </div>
)

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Login attempt with:', email, password)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 py-12">
        <div className="mb-6">
          <img
            src={integraLogo}
            alt="INTEGRA Logo"
            className="w-10 h-auto mx-auto"
          />
        </div>

        <h1 className="text-4xl font-normal text-center mb-8">
          ¡Bienvenido a{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-red-500 bg-clip-text text-transparent font-normal">
            INTEGRA
          </span>
          !
        </h1>

        <div className="text-center mb-12">
          <p className="text-xl text-gray-800 mb-2">
            Inicia sesión, accede a tu espacio y maneja todo lo que necesitas.
          </p>
          <p className="text-gray-700">
            Seas estudiante, docente o administrador, este es tu punto de partida
          </p>
        </div>

        <div className="w-full max-w-md px-4">
          <form onSubmit={handleSubmit} className="w-full">
            <FormInput
              id="email"
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
            />

            <FormInput
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              icon={<LockClosedIcon className="w-6 h-6 text-gray-400" />}
              marginBottom="mb-4"
            />

            <div className="mb-8">
              <a
                href="#"
                className="text-blue-500 mt-0 hover:text-blue-700 transition-colors"
              >
                Recuperar contraseña
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-red-500 text-white font-medium rounded-md hover:scale-[1.02] transition-transform duration-200 outline-none border-0 shadow-none ring-0 focus:ring-0 focus:outline-none appearance-none"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block w-1/2">
        <img
          src={globeImage}
          alt="Globe on chalkboard"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

export default Login
