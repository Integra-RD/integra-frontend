import React, { useState, type FormEvent } from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import AuthLayout from '../../components/AuthLayout'
import AuthInput from '../../components/AuthInput'
import GradientButton from '../../components/GradientButton'
import RedirectLink from '../../components/RedirectLink'
import recoveryBackground from '../../assets/recoveryBackground.svg'

const Recovery: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Recovery email sent to:', email)
  }

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Enviaremos por correo las instrucciones para restablecer tu contraseña."
      backgroundImage={recoveryBackground}
    >
      <form onSubmit={handleSubmit} className="max-w-[450px] mx-auto space-y-6">
        <AuthInput
          id="email"
          label="Dirección de Correo Electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Ingrese su correo electrónico"
          icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
          type="email"
        />
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <GradientButton type="submit" ariaLabel="Enviar correo de recuperación">
              Enviar correo de recuperación
            </GradientButton>
            <RedirectLink href="/login" text="Iniciar Sesión" />
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default Recovery
