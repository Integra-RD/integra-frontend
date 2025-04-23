import React, { useState, type FormEvent } from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import AuthLayout from '../../components/AuthLayout'
import AuthInput from '../../components/AuthInput'
import GradientButton from '../../components/GradientButton'
import RedirectLink from '../../components/RedirectLink'
import recoveryBackground from '../../assets/recoveryBackground.svg'
import { toast, ToastContainer } from 'react-toastify'
import api from '../../services/api'
import 'react-toastify/dist/ReactToastify.css'


const Recovery: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/reset-password/', { email: email.trim() })
      toast.success(data.message || 'Correo enviado con instrucciones')
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message ?? 'Error al enviar correo de recuperación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
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
            <GradientButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando…' : 'Enviar correo de recuperación'}
            </GradientButton>
            <RedirectLink href="/login" text="Volver a Iniciar Sesión" />
          </div>
        </form>
      </AuthLayout>
    </>
  )
}

export default Recovery
