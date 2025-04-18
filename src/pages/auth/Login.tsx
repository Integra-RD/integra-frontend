'use client'

import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  BookOpenIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import integraLogo from '../../assets/integraLogo.svg'
import globeImage from '../../assets/globe.svg'
import GradientButton from '../../components/GradientButton'
import RedirectLink from '../../components/RedirectLink'

// TODO:
// Form Validation: Consider a lightweight library like React Hook Form/Zod
// Snackbars to avoid accidental datawipes cuz of leaving the modal
// Performance: We could memoize the rendered list or handlers with useCallback
// Connect with auth

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
  marginBottom = 'mb-4'
}) => (
  <div className={marginBottom}>
    <label htmlFor={id} className="block text-gray-800 text-lg mb-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">{icon}</div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
        required
      />
    </div>
  </div>
)

type Grade = {
  id: number
  name: string
  classes: string[]
  newClassName: string
  collapsed: boolean
}

const Login: React.FC = () => {
  // Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Modal & tabs
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'director' | 'minerd'>('director')

  // Director form state
  const [newGradeName, setNewGradeName] = useState('')
  const [grades, setGrades] = useState<Grade[]>([])
  const [schoolName, setSchoolName] = useState('')
  const [schoolType, setSchoolType] = useState('')

  // MINERD form state
  const [minerdName, setMinerdName] = useState('')
  const [minerdEmail, setMinerdEmail] = useState('')

  // Lock scroll & handle ESC
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsModalOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (modalType === 'director') {
      console.log('Director signup:', { grades, schoolName, schoolType })
    } else {
      console.log('MINERD signup:', { minerdName, minerdEmail })
    }
  }

  // Reset all form fields when switching tab
  const switchModal = (type: 'director' | 'minerd') => {
    setModalType(type)
    setNewGradeName('')
    setGrades([])
    setSchoolName('')
    setSchoolType('')
    setMinerdName('')
    setMinerdEmail('')
  }

  const addGrade = () => {
    if (!newGradeName) return
    setGrades(prev => [
      ...prev,
      { id: Date.now(), name: newGradeName, classes: [], newClassName: '', collapsed: false }
    ])
    setNewGradeName('')
  }

  const removeGrade = (id: number) => setGrades(prev => prev.filter(g => g.id !== id))

  const toggleCollapse = (id: number) =>
    setGrades(prev => prev.map(g => (g.id === id ? { ...g, collapsed: !g.collapsed } : g)))

  const updateNewClass = (id: number, val: string) =>
    setGrades(prev => prev.map(g => (g.id === id ? { ...g, newClassName: val } : g)))

  const addClass = (id: number) =>
    setGrades(prev =>
      prev.map(g => {
        if (g.id !== id || !g.newClassName.trim()) return g
        return {
          ...g,
          classes: [...g.classes, g.newClassName.trim()],
          newClassName: ''
        }
      })
    )

  const removeClass = (id: number, idx: number) =>
    setGrades(prev =>
      prev.map(g => (g.id === id ? { ...g, classes: g.classes.filter((_, i) => i !== idx) } : g))
    )

  return (
    <>
      {/* Login screen */}
      <div className="flex h-screen bg-white">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 py-12">
          <img src={integraLogo} alt="INTEGRA Logo" className="w-10 mb-6" />
          <h1 className="text-4xl font-normal text-center mb-6">
            ¡Bienvenido a{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-red-500 bg-clip-text text-transparent">
              INTEGRA
            </span>
            !
          </h1>
          <div className="text-center mb-10">
            <p className="text-xl text-gray-800 mb-1">
              Inicia sesión, accede a tu espacio y maneja todo lo que necesitas.
            </p>
            <p className="text-gray-700">
              Seas estudiante, docente o administrador, este es tu punto de partida
            </p>
          </div>
          <div className="w-full max-w-md px-4">
            <form onSubmit={e => e.preventDefault()} className="space-y-4">
              <FormInput
                id="login-email"
                label="Correo Electrónico"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ingrese su correo electrónico"
                icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
              />
              <FormInput
                id="login-password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                icon={<LockClosedIcon className="w-6 h-6 text-gray-400" />}
                marginBottom="mb-4"
              />
              <GradientButton type="submit" aria-label="Iniciar Sesión">
                Iniciar Sesión
              </GradientButton>
              <div className="flex items-center justify-between text-sm mt-2">
                <RedirectLink href="/recovery" text="Recuperar Contraseña" />
                <RedirectLink
                  href="#"
                  text="Solicitar Creación de Cuenta"
                  onClick={e => {
                    e.preventDefault()
                    switchModal('director')
                    setIsModalOpen(true)
                  }}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:block w-1/2 h-screen">
          <img src={globeImage} alt="Globe on chalkboard" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-[1000px] mx-8 p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn"
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800">Solicitar Creación de Cuenta</h2>

            {/* Tabs */}
            <nav className="flex space-x-2 mb-4">
              {(['director', 'minerd'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => switchModal(type)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    modalType === type
                      ? 'bg-[#29638A] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'director' ? 'Director' : 'MINERD'}
                </button>
              ))}
            </nav>

            {modalType === 'minerd' ? (
              <section className="space-y-4">
                <h3 className="flex items-center text-lg font-medium text-[#29638A]">
                  <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                  Datos Administrador MINERD
                </h3>
                <FormInput
                  id="minerd-name"
                  label="Nombre Completo"
                  type="text"
                  value={minerdName}
                  onChange={e => setMinerdName(e.target.value)}
                  placeholder="Ingrese su nombre completo"
                  icon={<UserIcon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  id="minerd-email"
                  label="Correo Electrónico"
                  type="email"
                  value={minerdEmail}
                  onChange={e => setMinerdEmail(e.target.value)}
                  placeholder="Ingrese su correo institucional"
                  icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
                />
                <div className="flex justify-end">
                  <button className="bg-[#29638A] hover:bg-[#205468] text-white rounded-lg px-6 py-2 shadow-md transition-colors">
                    Enviar Solicitud
                  </button>
                </div>
              </section>
            ) : (
              <>
                {/* Director form */}
                <section className="space-y-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="flex items-center text-lg font-medium text-[#29638A]">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Datos Personales del Director
                  </h3>
                  <FormInput
                    id="director-name"
                    label="Nombre Completo"
                    type="text"
                    value=""
                    onChange={() => {}}
                    placeholder="Ingrese su nombre completo"
                    icon={<UserIcon className="w-6 h-6 text-gray-400" />}
                  />
                  <FormInput
                    id="director-email"
                    label="Correo Electrónico Institucional"
                    type="email"
                    value=""
                    onChange={() => {}}
                    placeholder="correo@institucion.edu"
                    icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
                  />
                  <FormInput
                    id="director-phone"
                    label="Teléfono"
                    type="tel"
                    value=""
                    onChange={() => {}}
                    placeholder="Ingrese su número telefónico"
                    icon={<PhoneIcon className="w-6 h-6 text-gray-400" />}
                  />
                </section>

                <section className="space-y-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="flex items-center text-lg font-medium text-[#29638A]">
                    <BuildingLibraryIcon className="h-5 w-5 mr-2" />
                    Información del Centro Educativo
                  </h3>
                  <FormInput
                    id="school-name"
                    label="Nombre de la Institución"
                    type="text"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    placeholder="Ingrese el nombre de la institución"
                    icon={<BuildingLibraryIcon className="w-6 h-6 text-gray-400" />}
                  />
                  <div>
                    <label htmlFor="school-type" className="block text-gray-800 text-lg mb-1">
                      Tipo de Institución
                    </label>
                    <select
                      id="school-type"
                      value={schoolType}
                      onChange={e => setSchoolType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="Pública">Pública</option>
                      <option value="Privada">Privada</option>
                    </select>
                  </div>
                </section>

                <section className="space-y-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="flex items-center text-lg font-medium text-[#29638A]">
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Estructura Académica
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newGradeName}
                      onChange={e => setNewGradeName(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    >
                      <option value="">Seleccione grado...</option>
                      <optgroup label="Primaria">
                        {['1ro', '2do', '3ro', '4to', '5to', '6to'].map(n => (
                          <option key={n} value={`${n} de Primaria`}>
                            {n} de Primaria
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Secundaria">
                        {['1ro', '2do', '3ro', '4to', '5to', '6to'].map(n => (
                          <option key={n} value={`${n} de Secundaria`}>
                            {n} de Secundaria
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <button
                      type="button"
                      onClick={addGrade}
                      className="inline-flex items-center gap-1 bg-[#29638A] hover:bg-[#205468] text-white rounded-lg px-4 py-2 shadow-md transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Agregar Grado
                    </button>
                  </div>

                  {grades.map(grade => (
                    <div
                      key={grade.id}
                      className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{grade.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCollapse(grade.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                          >
                            {grade.collapsed ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGrade(grade.id)}
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {!grade.collapsed && (
                        <>
                          {grade.classes.length === 0 && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                              <p className="text-sm text-gray-600">
                                No hay asignaturas en este grado. Agregue una asignatura.
                              </p>
                            </div>
                          )}
                          <div className="space-y-2 mb-3">
                            {grade.classes.map((cls, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                                  <span>{cls}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeClass(grade.id, idx)}
                                  className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none transition-colors"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              value={grade.newClassName}
                              onChange={e => updateNewClass(grade.id, e.target.value)}
                              placeholder="Ej: Matemáticas"
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => addClass(grade.id)}
                              className="inline-flex items-center gap-1 bg-[#29638A] hover:bg-[#205468] text-white rounded-lg px-4 py-2 shadow-md transition-colors"
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </section>

                <div className="flex justify-end">
                  <button className="bg-[#29638A] hover:bg-[#205468] text-white rounded-lg px-6 py-2 shadow-md transition-colors">
                    Enviar Solicitud
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </>
  )
}

export default Login
