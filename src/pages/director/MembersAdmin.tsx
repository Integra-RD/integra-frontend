import { useLocation, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import LayoutWrapper from '../../components/LayoutWrapper'
import DataTable from '../../components/DataTable'
import { getNavItemsByRole } from '../../utils/getNavItemsByRole'
import FileUploader from '../../components/FileUploader'

const mockSchools = Array.from({ length: 12 }, (_, i) => {
  const baseId = 53849 + i
  const isStudent = i % 2 === 0

  const firstNames = ['Carlos', 'Ana', 'Luis', 'María', 'Juan', 'Lucía']
  const lastNames = ['Pérez', 'Rodríguez', 'Gómez', 'Martínez', 'Díaz', 'Fernández']
  const grades = ['1ro', '2do', '3ro', '4to', '5to', '6to']
  const sections = ['A', 'B', 'C']
  const genders = ['Masculino', 'Femenino']

  const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

  if (isStudent) {
    return {
      id: baseId,
      first_name: randomElement(firstNames),
      last_name: randomElement(lastNames),
      grade: randomElement(grades),
      section: randomElement(sections),
      date_birth: new Date(2008 + (i % 5), i % 12, (i % 28) + 1).toLocaleDateString('es-DO'),
      gender: randomElement(genders),
      type: 'student'
    }
  } else {
    return {
      id: baseId,
      first_name: randomElement(firstNames),
      last_name: randomElement(lastNames),
      email: `profesor${i}@colegio.edu.do`,
      grade: randomElement(grades),
      section: randomElement(sections),
      type: 'teacher'
    }
  }
})


const DirectorHome: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'students' | 'teachers'>('students')
  const [filteredData, setFilteredData] = useState(
    mockSchools.filter(item => item.type === 'student')
  )

  const handlePersonTypeChange = (type: string) => {
    if (type === 'student') {
      setActiveView('students')
      setFilteredData(mockSchools.filter(item => item.type === 'student'))
    } else {
      setActiveView('teachers')
      setFilteredData(mockSchools.filter(item => item.type === 'teacher'))
    }
  }

  const navItems = getNavItemsByRole('director', location, navigate)

  const studentHeaders = [
    { label: 'Primer Nombre', key: 'first_name' },
    { label: 'Apellido', key: 'last_name' },
    { label: 'Matrícula', key: 'id' },
    { label: 'Curso', key: 'grade' },
    { label: 'Sección', key: 'section' },
    { label: 'Fecha de Nacimiento', key: 'date_birth' },
    { label: 'Género', key: 'gender' }
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
      title: "Importación Masiva de Calificaciones",
      description: "Sube un archivo Excel (.xlsx) con las calificaciones de los estudiantes",
      acceptedExtensions: [".xlsx"],
      buttonText: "Seleccionar Archivo",
      instructions: [
        "El archivo debe contener columnas para ID de estudiante y calificación.",
        "Asegúrese de seleccionar la materia, grado y período correctos antes de importar.",
        "Las calificaciones deben estar en escala de 0-100.",
      ],
      templatePath: "/students-import-template.xlsx"
    },
    teachers: {
      title: "Importación Masiva de Profesores",
      description: "Sube un archivo Excel (.xlsx) con los datos de los profesores",
      acceptedExtensions: [".xlsx"],
      buttonText: "Seleccionar Archivo",
      instructions: [
        "El archivo debe contener columnas para nombre, código y asignatura.",
        "Verifique que los códigos de asignatura sean correctos.",
        "Incluya información de contacto si es necesario.",
      ],
      templatePath: "/teachers-import-template.xlsx"
    }
  }

  return (
    <LayoutWrapper navItems={navItems} title="Bienvenido al Portal del Director">
       <div className="table-auto w-full mb-8">
      <DataTable
        headers={activeView === 'students' ? studentHeaders : teacherHeaders}
        data={filteredData}
        dropdownLabel="Curso"
        dropdownOptions={[
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
        ]}
        extraFilters="with-person-type"
        onPersonTypeChange={handlePersonTypeChange}
      />
      </div>

      {/* Sección de importación dinámica */}
      <div className="mb-8">
        <FileUploader
          title={uploaderConfig[activeView].title}
          description={uploaderConfig[activeView].description}
          acceptedExtensions={uploaderConfig[activeView].acceptedExtensions}
          buttonText={uploaderConfig[activeView].buttonText}
          instructions={uploaderConfig[activeView].instructions}
          templatePath={uploaderConfig[activeView].templatePath}
        />
      </div>
    </LayoutWrapper>

    
  )
}

export default DirectorHome
