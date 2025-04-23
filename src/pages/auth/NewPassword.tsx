import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import AuthLayout from '../../components/AuthLayout'
import AuthInput from '../../components/AuthInput'
import recoveryBackground from '../../assets/recoveryBackground.svg'
import GradientButton from '../../components/GradientButton'
import { toast, ToastContainer } from 'react-toastify'
import api from '../../services/api'
import 'react-toastify/dist/ReactToastify.css'

const NewPassword: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { uid = '', token = '' } = useParams<{ uid: string; token: string }>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError(null)

    try {
      await api.post(
        `/auth/reset-password-confirm/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`,
        { new_password: password }
      )

      const toastId = toast.loading('Contraseña actualizada! Redireccionando en 5 segundos…', {
        autoClose: false
      })

      setTimeout(() => {
        toast.update(toastId, {
          render: '¡Redireccionando ahora!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        navigate('/login', { replace: true })
      }, 5000)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Error al restablecer contraseña')
    }
  }

  return (
    <>
      <ToastContainer position="top-right" hideProgressBar />
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
          <GradientButton type="submit" className="w-full">
            Actualizar contraseña
          </GradientButton>
        </form>
      </AuthLayout>
    </>
  )
}

export default NewPassword
