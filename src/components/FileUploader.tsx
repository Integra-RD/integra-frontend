import React, { useState, useRef, useCallback } from 'react'
import {
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

// TODO: Connect logic to uploading and show accurate feedback
interface FileUploaderProps {
  /**
   * Función que se ejecuta cuando un archivo es seleccionado
   */
  onFileUpload?: (file: File) => void

  /**
   * Extensiones de archivo permitidas (por defecto solo .xlsx)
   */
  acceptedExtensions?: string[]

  /**
   * Texto del botón de selección de archivo
   */
  buttonText?: string

  /**
   * Lista de instrucciones que se mostrarán debajo del área de carga
   */
  instructions?: string[]

  /**
   * Título del componente
   */
  title?: string

  /**
   * Texto descriptivo que se muestra debajo del ícono
   */
  description?: string

  /**
   * Ruta del archivo template para descargar
   * Si es null o undefined, no se mostrará el botón de descarga
   */
  templatePath?: string | null

  /**
   * Texto del botón de descarga de template
   */
  downloadButtonText?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedExtensions = ['.xlsx'],
  buttonText = 'Seleccionar Archivo',
  instructions = [
    'El archivo debe contener columnas para ID de estudiante y calificación.',
    'Asegúrese de seleccionar la materia, grado y período correctos antes de importar.',
    'Las calificaciones deben estar en escala de 0-100.'
  ],
  title = 'Importación Masiva de Calificaciones',
  description = 'Sube un archivo Excel (.xlsx) con las calificaciones de los estudiantes',
  templatePath = null,
  downloadButtonText = 'Descargar Template'
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validar la extensión del archivo
  const isValidFileExtension = (fileName: string): boolean => {
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
    return acceptedExtensions.includes(fileExtension)
  }

  // Manejar el evento de arrastrar sobre el área
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  // Manejar el evento cuando se deja de arrastrar
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  // Manejar el evento cuando se suelta el archivo
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    processFile(droppedFile)
  }, [])

  // Manejar el evento cuando se selecciona un archivo
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }, [])

  // Procesar el archivo seleccionado
  const processFile = (file: File) => {
    setError(null)

    if (!file) {
      return
    }

    // Validar extensión
    if (!isValidFileExtension(file.name)) {
      setError(
        `Formato de archivo no válido. Por favor, sube un archivo ${acceptedExtensions.join(', ')}`
      )
      setFile(null)
      return
    }

    // Establecer el archivo y llamar al callback
    setFile(file)
    console.log('Archivo seleccionado:', file)

    if (onFileUpload) {
      onFileUpload(file)
    }
  }

  // Abrir el diálogo de selección de archivo
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Descargar el archivo template
  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se abra el diálogo de selección de archivo
    if (templatePath) {
      window.open(templatePath, '_blank')
    }
  }

  return (
    <div className="w-full bg-[#F1F4F9] p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-[#181C20] mb-4">{title}</h2>

      {/* Área de arrastrar y soltar */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 
          flex flex-col items-center justify-center
          transition-colors duration-200
          ${isDragging ? 'border-[#29638A] bg-[#29638A]/10' : 'border-gray-300 bg-white/80'}
          ${error ? 'border-red-400' : ''}
          backdrop-blur-sm shadow-sm
          cursor-pointer
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedExtensions.join(',')}
          className="hidden"
        />

        {file ? (
          <>
            <CheckCircleIcon className="w-12 h-12 text-green-500 mb-3" />
            <p className="text-center text-[#181C20] mb-2">Archivo seleccionado: {file.name}</p>
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="w-12 h-12 text-[#29638A] mb-3" />
            <p className="text-center text-[#181C20] mb-2">{description}</p>
          </>
        )}

        <div className="flex space-x-3 mt-4">
          <button
            type="button"
            className="px-5 py-2.5 bg-[#29638A] text-white rounded-full text-sm font-medium hover:bg-[#2c6e91] transition-colors shadow-sm"
          >
            {buttonText}
          </button>
          
          {templatePath && (
            <button
              type="button"
              className="px-5 py-2.5 bg-white text-[#29638A] border border-[#29638A] rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center"
              onClick={handleDownloadTemplate}
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              {downloadButtonText}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 flex items-center text-red-500">
            <ExclamationCircleIcon className="w-5 h-5 mr-1" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        <p className="text-sm font-bold text-[#181C20] mb-2">Instrucciones:</p>
        <ul className="space-y-2">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              <span className="mr-2 text-[#29638A]">•</span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FileUploader
