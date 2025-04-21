import { z } from 'zod'

export const AddressSchema = z.object({
  calle: z.string().min(1, 'Calle requerida'),
  informacion_vivienda: z.string().optional(),
  sector_id: z.number().min(1, 'Sector requerido')
})

export const SubjectSchema = z.object({
  nombre_asignatura: z.string().min(1, 'Nombre requerido'),
  descripcion_asignatura: z.string().optional()
})

export const GradeSchema = z.object({
  nombre_curso: z.string().min(1, 'Nombre del curso requerido'),
  nivel_educativo: z.enum(['Primaria', 'Secundaria']),
  seccion: z.string().min(1, 'Sección requerida'),
  asignaturas_curso: z.array(SubjectSchema).min(1, 'Agrega al menos una asignatura')
})

export const CentroEducativoSchema = z.object({
  id: z.number().nullable().optional(),
  nombre_centro_educativo: z.string().optional(),
  direccion: AddressSchema,
  tipos_centro: z.array(z.number()).optional()
})

export const MinerdAccountRequestSchema = z.object({
  full_name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Correo inválido')
})

export const DirectorAccountRequestSchema = z.object({
  first_name: z.string().min(1, 'Nombres requeridos'),
  last_name: z.string().min(1, 'Apellidos requeridos'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role_id: z.literal(5),
  centro_educativo_data: CentroEducativoSchema.extend({
    nombre_centro_educativo: z.string().min(1, 'Nombre requerido'),
    tipos_centro: z.array(z.number()).min(1, 'Selecciona al menos un tipo de centro')
  }),
  cursos_data: z.array(GradeSchema).min(1, 'Agrega al menos un grado')
})

export type CentroEducativo = z.infer<typeof CentroEducativoSchema>
export type MinerdAccountRequest = z.infer<typeof MinerdAccountRequestSchema>
export type DirectorAccountRequest = z.infer<typeof DirectorAccountRequestSchema>
