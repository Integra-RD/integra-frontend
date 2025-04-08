import React, { useState, type FormEvent } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import AuthLayout from '../../components/AuthLayout'
import AuthInput from '../../components/AuthInput'
import recoveryBackground from '../../assets/recoveryBackground.svg'
import GradientButton from '../../components/GradientButton'
import RedirectLink from '../../components/RedirectLink'

const NewPassword: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setError(null)
    console.log('New password set:', password)
  }

  return (
    <AuthLayout
      title="Nueva Contraseña"
      subtitle="Ingrese su nueva contraseña"
      backgroundImage={recoveryBackground}
    >
      <form onSubmit={handleSubmit} className="max-w-[450px] mx-auto space-y-6">
        <AuthInput
          id="password"
          label="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Ingrese su nueva contraseña"
          icon={<LockClosedIcon className="w-6 h-6 text-gray-400" />}
          type="password"
        />
        <AuthInput
          id="confirmPassword"
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirme su nueva contraseña"
          icon={<LockClosedIcon className="w-6 h-6 text-gray-400" />}
          type="password"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <GradientButton type="submit" ariaLabel="Actualizar contraseña">
              Actualizar contraseña
            </GradientButton>
            <RedirectLink href="/login" text="Iniciar Sesión" />
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}

export default NewPassword
