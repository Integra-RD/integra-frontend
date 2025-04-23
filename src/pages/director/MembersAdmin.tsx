import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import FileUploader from '../../components/FileUploader'
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Person {
  id: number
  first_name?: string
  last_name?: string
  nombre_completo?: string
  matricula?: string
  curso?: string
  fecha_nacimiento?: string
  genero?: string
  email?: string
  grade?: string
  section?: string
  type: 'students' | 'teachers'
}

const DirectorHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [tableData, setTableData] = useState<Person[]>([])
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadKey, setUploadKey] = useState(Date.now())
  const [centroEducativoId] = useState('95656392')

  const fetchData = async () => {
    if (!centroEducativoId.trim()) return
    setIsTableLoading(true)
    try {
      const endpoint =
        activeView === 'students' ? '/academic/estudiantes/list/' : '/academic/docente/list/'
      const response = await api.get(endpoint, {
        params: { centro_educativo_id: centroEducativoId, students: 250 }
      })
      const results = Array.isArray(response.data.results) ? response.data.results : []
      setTableData(results.map((item: any) => ({ ...item, type: activeView })))
    } catch (err) {
      console.error(err)
      toast.error('Error al cargar los datos')
      setTableData([])
    } finally {
      setIsTableLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeView, centroEducativoId])

  const handlePersonTypeChange = (type: string) => {
    setActiveView(type === 'student' ? 'students' : 'teachers')
  }

  const handleFileUpload = async (file: File) => {
    if (!centroEducativoId.trim()) {
      toast.warn('Debes especificar el centro educativo')
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('centro_educativo_id', centroEducativoId)
    try {
      const endpoint =
        activeView === 'students'
          ? '/academic/estudiantes/bulk-upload/'
          : '/academic/docente/bulk-upload/'
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const msg =
        response.data.message ||
        `${activeView === 'students' ? 'Estudiantes' : 'Docentes'} cargados exitosamente`
      toast.success(msg)
      if (response.data.data) {
        setTableData(response.data.data.map((item: any) => ({ ...item, type: activeView })))
      } else {
        await fetchData()
      }
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'Error al procesar el archivo'
      toast.error(msg)
    } finally {
      setIsLoading(false)
      setUploadKey(Date.now())
    }
  }

  const navItems = getNavItemsByRole('director', location, navigate)

  const studentHeaders = [
    { label: 'Nombre', key: 'nombre_completo' },
    { label: 'Matrícula', key: 'matricula' },
    { label: 'Curso', key: 'curso' },
    { label: 'Fecha Nacimiento', key: 'fecha_nacimiento' },
    { label: 'Género', key: 'genero' }
  ]

  const teacherHeaders = [
    { label: 'Primer Nombre', key: 'first_name' },
    { label: 'Apellido', key: 'last_name' },
    { label: 'Email', key: 'email' },
    { label: 'Curso', key: 'grade' },
    { label: 'Sección', key: 'section' }
  ]

  const uploaderConfig = {
    students: {
      title: 'Importación Masiva de Estudiantes',
      description: 'Sube un archivo Excel (.xlsx) con los datos de los estudiantes',
      acceptedExtensions: ['.xlsx', '.xls'],
      buttonText: 'Seleccionar Archivo',
      instructions: [
        'El archivo debe seguir el formato de la plantilla',
        'Columnas: Nombre, Apellido, Matrícula, Curso, Fecha Nacimiento (DD/MM/YYYY), Género',
        'Tamaño máximo: 5MB'
      ],
      templatePath: '/templates/estudiantes-template.xlsx',
      onUpload: handleFileUpload
    },
    teachers: {
      title: 'Importación Masiva de Docentes',
      description: 'Sube un archivo Excel (.xlsx) con los datos de los docentes',
      acceptedExtensions: ['.xlsx', '.xls'],
      buttonText: 'Seleccionar Archivo',
      instructions: [
        'El archivo debe seguir el formato de la plantilla',
        'Columnas: Nombre, Apellido, Email, Curso, Sección',
        'Tamaño máximo: 5MB'
      ],
      templatePath: '/templates/docentes-template.xlsx',
      onUpload: handleFileUpload
    }
  }

  const dropdownOptions = [
    'Todos',
    '1ro de básica',
    '2do de básica',
    '3ro de básica',
    '4to de básica',
    '5to de básica',
    '6to de básica',
    '1ro de secundaria',
    '2do de secundaria',
    '3ro de secundaria',
    '4to de secundaria',
    '5to de secundaria',
    '6to de secundaria'
  ]

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
      <LayoutWrapper navItems={navItems} title="Bienvenido al Portal del Director">
        {isTableLoading && <div className="text-center py-4">Cargando datos...</div>}
        <DataTable
          headers={activeView === 'students' ? studentHeaders : teacherHeaders}
          data={tableData}
          dropdownLabel="Filtrar por"
          dropdownOptions={dropdownOptions}
          extraFilters="with-person-type"
          onPersonTypeChange={handlePersonTypeChange}
        />
        {isLoading && <div className="text-center py-4">Procesando archivo...</div>}
        <FileUploader
          key={uploadKey}
          title={uploaderConfig[activeView].title}
          description={uploaderConfig[activeView].description}
          acceptedExtensions={uploaderConfig[activeView].acceptedExtensions}
          buttonText={uploaderConfig[activeView].buttonText}
          instructions={uploaderConfig[activeView].instructions}
          templatePath={uploaderConfig[activeView].templatePath}
          onFileUpload={uploaderConfig[activeView].onUpload}
        />
      </LayoutWrapper>
    </>
  )
}

export default DirectorHome
