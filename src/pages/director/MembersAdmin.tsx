import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import FileUploader from '../../components/FileUploader'
import api from '../../services/api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Person {
  id: number
  first_name: string
  last_name: string
  grade?: string
  section?: string
  date_birth?: string
  gender?: string
  email?: string
  type: 'student' | 'teacher'
}

const DirectorHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [isLoading, setIsLoading] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [tableData, setTableData] = useState<Person[]>([]);
  const [uploadKey, setUploadKey] = useState(Date.now()); // Clave para resetear FileUploader
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);



  const handlePersonTypeChange = (type: string) => {
    const newView = type === 'student' ? 'students' : 'teachers'
    setActiveView(newView)
    // Aquí podrías filtrar los datos si los tuvieras cargados
    // setTableData(loadedData.filter(item => item.type === newView.slice(0, -1)))
  }
  const [centroEducativoId, setCentroEducativoId] = useState<string>('95656392 ') // O el ID por defecto
  
  const fetchData = async () => {
    if (!centroEducativoId) return;
    
    setIsTableLoading(true);
    try {
      const endpoint = activeView === 'students' 
        ? '/academic/estudiantes/list/' 
        : '/academic/docente/list/';
  
      const response = await api.get(endpoint, {
        params: { centro_educativo_id: centroEducativoId, students: 250 }
      });
      
      // Asegurar que siempre trabajamos con un array
      const data = Array.isArray(response.data?.results) ? response.data.results : [];
      setTableData(data);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
      setTableData([]);
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeView, centroEducativoId]);


  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('centro_educativo_id', centroEducativoId);
  
    try {
      const endpoint = activeView === 'students' 
        ? '/academic/estudiantes/bulk-upload/' 
        : '/academic/docente/bulk-upload/';
  
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Manejo de respuesta exitosa
      const successMessage = response.data.message || 
        `${activeView === 'students' ? 'Estudiantes' : 'Docentes'} cargados exitosamente`;
      
      toast.success(successMessage);
      
      // 1. FORMA DIRECTA (si el backend devuelve los datos actualizados)
      if (response.data.data) {
        setTableData(response.data.data);
      } 
      // 2. FORMA ALTERNATIVA (recargar datos del servidor)
      else {
        await fetchData(); // Vuelve a cargar los datos desde el endpoint de listado
      }
  
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.message || 
                         'Error al procesar el archivo';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadKey(Date.now()); // Resetear el componente de carga
    }
  };
  const navItems = getNavItemsByRole('director', location, navigate)

  const studentHeaders = [
    { label: 'Nombre', key: 'nombre_completo' },
    { label: 'Matrícula', key: 'matricula' },
    { label: 'Curso', key: 'curso' },
    { label: 'Fecha de Nacimiento', key: 'fecha_nacimiento' },
    { label: 'Género', key: 'genero' }
  ]

  const teacherHeaders = [
    { label: 'Primer Nombre', key: 'first_name' },
    { label: 'Apellido', key: 'last_name' },
    { label: 'Email', key: 'email' },
    { label: 'Curso', key: 'grade' },
    { label: 'Sección', key: 'section' },
  ]

  const uploaderConfig = {
    students: {
      title: "Importación Masiva de Estudiantes",
      description: "Sube un archivo Excel (.xlsx) con los datos de los estudiantes",
      acceptedExtensions: [".xlsx", ".xls"],
      buttonText: "Seleccionar Archivo",
      instructions: [
        "El archivo debe seguir exactamente el formato de la plantilla",
        "Columnas requeridas: Nombre, Apellido, Matrícula, Curso, Sección, Fecha Nacimiento (DD/MM/YYYY), Género",
        "Tamaño máximo del archivo: 5MB"
      ],
      templatePath: "/templates/estudiantes-template.xlsx",
      onUpload: handleFileUpload
    },
    teachers: {
      title: "Importación Masiva de Docentes",
      description: "Sube un archivo Excel (.xlsx) con los datos de los docentes",
      acceptedExtensions: [".xlsx", ".xls"],
      buttonText: "Seleccionar Archivo",
      instructions: [
        "El archivo debe seguir exactamente el formato de la plantilla",
        "Columnas requeridas: Nombre, Apellido, Email, Curso, Sección",
        "Tamaño máximo del archivo: 5MB"
      ],
      templatePath: "/templates/docentes-template.xlsx",
      onUpload: handleFileUpload
    }
  }

  const dropdownOptions = [
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
    <LayoutWrapper navItems={navItems} title="Bienvenido al Portal del Director">
     <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
     <div className="table-auto w-full mb-8">
        {isTableLoading && (
          <div className="text-center py-4">
            <p>Cargando datos...</p>
          </div>
        )}
        <DataTable
        headers={activeView === 'students' ? studentHeaders : teacherHeaders}
        data={tableData}
        dropdownLabel="Filtrar por"
        dropdownOptions={['Todos', ...dropdownOptions]}
        extraFilters="with-person-type"
        onPersonTypeChange={handlePersonTypeChange}
      />
      </div>

      <div className="mb-8">
        {isLoading && (
          <div className="text-center py-4">
            <p>Procesando archivo...</p>
          </div>
        )}
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
      </div>
    </LayoutWrapper>
  )
}

export default DirectorHome