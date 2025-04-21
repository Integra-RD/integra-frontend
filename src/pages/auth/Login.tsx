import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
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
import { useAuth, FrontendRole } from '../../hooks/useAuth'
import api from '../../services/api'
import {
  DirectorAccountRequestSchema,
  MinerdAccountRequestSchema
} from '../../schemas/accountRequestSchema'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// TODO: Clean up for max readility and code splitting
// Adjust endpoint for Director

interface FormInputProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  icon: React.ReactNode
  required?: boolean
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
  marginBottom = 'mb-4',
  required = true
}) => (
  <div className={marginBottom}>
    <label htmlFor={id} className="block text-gray-800 text-lg mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">{icon}</div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
      />
    </div>
  </div>
)

type Grade = {
  id: number
  name: string
  seccion: string
  classes: string[]
  newClassName: string
  collapsed: boolean
}

const TIPOS_DE_CENTROS = [
  { id: 1, label: 'Inicial' },
  { id: 2, label: 'Básico' },
  { id: 3, label: 'Medio' },
  { id: 4, label: 'Técnico' }
]

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'director' | 'minerd'>('director')
  const [submitting, setSubmitting] = useState(false)

  const [minerdFirstName, setMinerdFirstName] = useState('')
  const [minerdLastName, setMinerdLastName] = useState('')
  const [minerdEmail, setMinerdEmail] = useState('')

  const [directorFirstName, setDirectorFirstName] = useState('')
  const [directorLastName, setDirectorLastName] = useState('')
  const [directorEmail, setDirectorEmail] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [direccionCalle, setDireccionCalle] = useState('')
  const [direccionVivienda, setDireccionVivienda] = useState('')
  const [sectorId, setSectorId] = useState<number | null>(null)
  const [tiposCentro, setTiposCentro] = useState<number[]>([])
  const [sectores, setSectores] = useState<{ id: number; nombre: string }[]>([])

  const [grades, setGrades] = useState<Grade[]>([])
  const [newGradeName, setNewGradeName] = useState('')

  useEffect(() => {
    if (!isModalOpen || modalType !== 'director') return
    api
      .get('/auth/auth-dropdown-options/', { params: { sectores: 'yes' } })
      .then(({ data }) =>
        setSectores(
          (data.sectores ?? []).map((s: any) => ({
            id: s.id,
            nombre: s.nombre_sector
          }))
        )
      )
      .catch(() => toast.error('No se pudieron cargar los sectores'))
  }, [isModalOpen, modalType])

  const autoPassword = () => crypto.randomUUID().slice(0, 8)
  const resetModal = () => {
    setMinerdFirstName('')
    setMinerdLastName('')
    setMinerdEmail('')
    setDirectorFirstName('')
    setDirectorLastName('')
    setDirectorEmail('')
    setSchoolName('')
    setDireccionCalle('')
    setDireccionVivienda('')
    setSectorId(null)
    setTiposCentro([])
    setGrades([])
    setNewGradeName('')
    setError(null)
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const role = await login(usernameOrEmail.trim(), password)
      const homePath: Record<FrontendRole, string> = {
        student: '/student/grade-history',
        teacher: '/teacher/reports',
        director: '/director/members',
        ministry: '/ministry/home',
        superadmin: '/student/grade-history'
      }
      navigate(homePath[role], { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  const solicitarCuentaMinerd = async () => {
    if (!minerdFirstName.trim() || !minerdLastName.trim()) {
      return toast.error('Escribe nombre y apellido')
    }

    const payload = {
      full_name: `${minerdFirstName.trim()} ${minerdLastName.trim()}`,
      email: minerdEmail.trim()
    }
    const check = MinerdAccountRequestSchema.safeParse(payload)
    if (!check.success) {
      return toast.error(check.error.errors[0].message)
    }

    setSubmitting(true)
    try {
      await api.post('/auth/solicitar-cuenta/minerd', payload)
      toast.success('Solicitud enviada')
      setIsModalOpen(false)
      resetModal()
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al enviar la solicitud')
    } finally {
      setSubmitting(false)
    }
  }

  const solicitarCuentaDirector = async () => {
    let centroId: number
    try {
      const { data } = await api.post('/academic/centro-educativo/', {
        nombre_centro_educativo: schoolName,
        direccion: {
          calle: direccionCalle,
          informacion_vivienda: direccionVivienda,
          sector_id: sectorId
        },
        tipos_centro: tiposCentro
      })
      centroId = data.id
    } catch (err: any) {
      return toast.error(err.response?.data?.message ?? 'No se pudo crear el centro educativo')
    }

    const payload = {
      first_name: directorFirstName,
      last_name: directorLastName,
      email: directorEmail,
      password: autoPassword(),
      role_id: 5,
      centro_educativo_data: { id: centroId },
      cursos_data: grades.map(g => ({
        nombre_curso: g.name,
        nivel_educativo: g.name.includes('Primaria') ? 'Primaria' : 'Secundaria',
        seccion: g.seccion,
        asignaturas_curso: g.classes.map(c => ({
          nombre_asignatura: c,
          descripcion_asignatura: ''
        }))
      }))
    }
    const check = DirectorAccountRequestSchema.safeParse(payload)
    if (!check.success) {
      return toast.error(check.error.errors[0].message)
    }

    setSubmitting(true)
    try {
      await api.post('/auth/solicitar-cuenta', payload)
      toast.success('Solicitud enviada')
      setIsModalOpen(false)
      resetModal()
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al enviar la solicitud')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAccountRequest = () =>
    modalType === 'minerd' ? solicitarCuentaMinerd() : solicitarCuentaDirector()

  const addGrade = () => {
    if (!newGradeName.trim()) return
    setGrades(g => [
      ...g,
      {
        id: Date.now(),
        name: newGradeName.trim(),
        seccion: '',
        classes: [],
        newClassName: '',
        collapsed: false
      }
    ])
    setNewGradeName('')
  }
  const removeGrade = (id: number) => setGrades(g => g.filter(x => x.id !== id))
  const toggleCollapse = (id: number) =>
    setGrades(g => g.map(x => (x.id === id ? { ...x, collapsed: !x.collapsed } : x)))
  const updateNewClass = (id: number, v: string) =>
    setGrades(g => g.map(x => (x.id === id ? { ...x, newClassName: v } : x)))
  const addClass = (id: number) =>
    setGrades(g =>
      g.map(x =>
        x.id !== id || !x.newClassName.trim()
          ? x
          : { ...x, classes: [...x.classes, x.newClassName.trim()], newClassName: '' }
      )
    )
  const removeClass = (id: number, idx: number) =>
    setGrades(g =>
      g.map(x => (x.id !== id ? x : { ...x, classes: x.classes.filter((_, i) => i !== idx) }))
    )
  const toggleTipoCentro = (id: number) =>
    setTiposCentro(t => (t.includes(id) ? t.filter(x => x !== id) : [...t, id]))
  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

      <div className="flex h-screen bg-white">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 py-12">
          <img src={integraLogo} alt="INTEGRA Logo" className="w-12 mb-6" />
          <h1 className="text-4xl font-normal text-center mb-6">
            ¡Bienvenido a{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-red-500 bg-clip-text text-transparent">
              INTEGRA
            </span>
            !
          </h1>
          <p className="text-center text-gray-700 mb-8">
            Seas estudiante, docente o administrador, este es tu punto de partida
          </p>

          <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
            <FormInput
              id="login-user"
              label="Usuario o Correo"
              type="text"
              value={usernameOrEmail}
              onChange={e => setUsernameOrEmail(e.target.value)}
              placeholder="Tu usuario o correo"
              icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
            />
            <FormInput
              id="login-pass"
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              icon={<LockClosedIcon className="w-6 h-6 text-gray-400" />}
              marginBottom="mb-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <GradientButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Cargando…' : 'Iniciar Sesión'}
            </GradientButton>

            <div className="flex justify-between text-sm mt-2">
              <RedirectLink href="/recovery" text="Recuperar Contraseña" />
              <RedirectLink
                href="#"
                text="Solicitar Cuenta"
                onClick={e => {
                  e.preventDefault()
                  setModalType('director')
                  setIsModalOpen(true)
                }}
              />
            </div>
          </form>
        </div>

        <div className="hidden lg:block w-1/2 h-screen">
          <img src={globeImage} alt="Globe" className="w-full h-full object-cover" />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <form
            onSubmit={e => e.preventDefault()}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-[1000px] mx-8 p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
              aria-label="Cerrar"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800">Solicitar Creación de Cuenta</h2>

            <nav className="flex space-x-2 mb-4">
              {(['director', 'minerd'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setModalType(t)}
                  className={`px-4 py-2 rounded-lg ${
                    modalType === t
                      ? 'bg-[#29638A] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t === 'director' ? 'Director' : 'MINERD'}
                </button>
              ))}
            </nav>

            {modalType === 'minerd' ? (
              <section className="space-y-4">
                <FormInput
                  id="minerd-name"
                  label="Nombres"
                  type="text"
                  value={minerdFirstName}
                  onChange={e => setMinerdFirstName(e.target.value)}
                  placeholder="Nombres"
                  icon={<UserIcon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  id="minerd-last"
                  label="Apellidos"
                  type="text"
                  value={minerdLastName}
                  onChange={e => setMinerdLastName(e.target.value)}
                  placeholder="Apellidos"
                  icon={<UserIcon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  id="minerd-mail"
                  label="Correo Electrónico"
                  type="email"
                  value={minerdEmail}
                  onChange={e => setMinerdEmail(e.target.value)}
                  placeholder="Correo institucional"
                  icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    className="bg-[#29638A] hover:bg-[#205468] text-white rounded-lg px-6 py-2 shadow-md transition-colors disabled:opacity-60"
                    onClick={handleAccountRequest}
                  >
                    {submitting ? 'Enviando…' : 'Enviar Solicitud'}
                  </button>
                </div>
              </section>
            ) : (
              <>
                <FormInput
                  id="dir-name"
                  label="Nombres"
                  type="text"
                  value={directorFirstName}
                  onChange={e => setDirectorFirstName(e.target.value)}
                  placeholder="Nombres"
                  icon={<UserIcon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  id="dir-last"
                  label="Apellidos"
                  type="text"
                  value={directorLastName}
                  onChange={e => setDirectorLastName(e.target.value)}
                  placeholder="Apellidos"
                  icon={<UserIcon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  id="dir-mail"
                  label="Correo Institucional"
                  type="email"
                  value={directorEmail}
                  onChange={e => setDirectorEmail(e.target.value)}
                  placeholder="correo@institucion.edu"
                  icon={<EnvelopeIcon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  id="school"
                  label="Nombre del Centro Educativo"
                  type="text"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="Nombre del centro educativo"
                  icon={<BuildingLibraryIcon className="w-6 h-6 text-gray-400" />}
                />

                <FormInput
                  id="street"
                  label="Calle"
                  type="text"
                  value={direccionCalle}
                  onChange={e => setDireccionCalle(e.target.value)}
                  placeholder="Dirección"
                  icon={<BuildingOffice2Icon className="w-6 h-6 text-gray-400" />}
                />
                <FormInput
                  required={false}
                  id="apt"
                  label="Información Vivienda"
                  type="text"
                  value={direccionVivienda}
                  onChange={e => setDireccionVivienda(e.target.value)}
                  placeholder="Apto, casa, etc (opcional)"
                  icon={<BuildingOffice2Icon className="w-6 h-6 text-gray-400" />}
                />

                <div>
                  <label className="block mb-1 text-gray-800">Sector</label>
                  <select
                    value={sectorId ?? ''}
                    onChange={e => setSectorId(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Seleccione sector
                    </option>
                    {sectores.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block mb-1 text-gray-800">Tipo de Centro</label>
                  <div className="flex flex-wrap gap-4">
                    {TIPOS_DE_CENTROS.map(tc => (
                      <label key={tc.id} className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tiposCentro.includes(tc.id)}
                          onChange={() => toggleTipoCentro(tc.id)}
                        />
                        {tc.label}
                      </label>
                    ))}
                  </div>
                </div>

                <section className="mt-6 space-y-3">
                  <h3 className="flex items-center text-lg font-medium text-gray-800">
                    <BookOpenIcon className="w-5 h-5 mr-2 text-gray-600" />
                    Estructura Académica
                  </h3>

                  <div className="flex gap-2">
                    <select
                      value={newGradeName}
                      onChange={e => setNewGradeName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="" disabled>
                        Seleccione grado…
                      </option>
                      <optgroup label="Primaria">
                        {['1ro', '2do', '3ro', '4to', '5to', '6to'].map(n => (
                          <option key={n} value={`${n} de Primaria`}>
                            {`${n} de Primaria`}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Secundaria">
                        {['1ro', '2do', '3ro', '4to', '5to', '6to'].map(n => (
                          <option key={n} value={`${n} de Secundaria`}>
                            {`${n} de Secundaria`}
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

                  {grades.map(g => (
                    <div
                      key={g.id}
                      className="border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{g.name}</span>
                          <select
                            value={g.seccion}
                            onChange={e =>
                              setGrades(gr =>
                                gr.map(x => (x.id === g.id ? { ...x, seccion: e.target.value } : x))
                              )
                            }
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="" disabled>
                              Cant. de secciones…
                            </option>
                            {['A', 'B', 'C', 'D', 'E'].map(s => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCollapse(g.id)}
                            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                          >
                            {g.collapsed ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGrade(g.id)}
                            className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-3">
                        {g.seccion === ''
                          ? `Seleccione cantidad de secciones para ${g.name}.`
                          : g.seccion === 'A'
                            ? `${g.name} tiene solo la sección A.`
                            : `${g.name} tiene secciones desde A hasta ${g.seccion}.`}
                      </p>

                      {!g.collapsed && (
                        <>
                          {g.classes.length === 0 && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                              <p className="text-sm text-gray-600">
                                No hay asignaturas en este grado. Agregue una.
                              </p>
                            </div>
                          )}

                          <div className="space-y-2 mb-3">
                            {g.classes.map((cls, idx) => (
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
                                  onClick={() => removeClass(g.id, idx)}
                                  className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 focus:outline-none transition-colors"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              value={g.newClassName}
                              onChange={e => updateNewClass(g.id, e.target.value)}
                              placeholder="Ej: Matemáticas"
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                              type="button"
                              onClick={() => addClass(g.id)}
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
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleAccountRequest}
                    className="bg-[#29638A] hover:bg-[#205468] text-white rounded-lg px-6 py-2 shadow-md transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Enviando…' : 'Enviar Solicitud'}
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
