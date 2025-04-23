
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definición de interfaces
export interface StudentGrades {
  [period: string]: number;
}

// Clase Student para manejar correctamente el cálculo de promedios
export class Student {
  id: string;
  name: string;
  grade: string;
  grades: Record<string, StudentGrades>;

  constructor(id: string, name: string, grade: string, grades: Record<string, StudentGrades> = {}) {
    this.id = id;
    this.name = name;
    this.grade = grade;
    this.grades = grades;
  }

  // Método para calcular el promedio - siempre actualizado
  getAvg(): number {
    let totalSum = 0;
    let totalCount = 0;
    
    Object.values(this.grades).forEach(subjectGrades => {
      Object.values(subjectGrades).forEach(grade => {
        totalSum += grade;
        totalCount++;
      });
    });
    
    return totalCount > 0 ? parseFloat((totalSum / totalCount).toFixed(1)) : 0;
  }

  // Método para crear una copia segura del estudiante
  clone(): Student {
    return new Student(this.id, this.name, this.grade, JSON.parse(JSON.stringify(this.grades)));
  }
}

// Opciones para los dropdowns que se usarán en varias páginas
export const subjects = ["Matemáticas", "Español", "Ciencias Naturales", "Historia"];
export const grades = ["5to de Secundaria", "4to de Secundaria", "3ro de Secundaria"];
export const periods = ["Septiembre", "Octubre", "Noviembre", "Diciembre", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];

// Crear datos iniciales para los estudiantes (solo se ejecuta una vez)
const createInitialStudents = (): Student[] => {
  const firstNames = ["Juan", "María", "Pedro", "Ana", "Luis", "Carlos", "Laura", "José", "Sofía", "Miguel", 
                      "Pablo", "Elena", "Alejandro", "Valentina", "Fernando", "Gabriela", "Roberto", "Isabella", "Eduardo", "Diana"];
  const lastNames = ["García", "Rodríguez", "López", "Martínez", "González", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres"];
  
  let allStudents: Student[] = [];
  
  // Crear estudiantes para cada grado con calificaciones base (no aleatorias)
  grades.forEach((gradeLevel, gradeIndex) => {
    // ID base según el grado (5to: 2021, 4to: 2022, 3ro: 2023)
    const idBase = 2021 + gradeIndex;
    
    // Crear 10 estudiantes por grado
    for (let i = 0; i < 10; i++) {
      const studentIndex = gradeIndex * 10 + i;
      const firstName = firstNames[studentIndex % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const secondLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Inicializar estudiante con calificaciones base
      const studentGrades: Record<string, StudentGrades> = {};
      
      // Inicializar todas las asignaturas y periodos con una calificación base de 80
      subjects.forEach(subject => {
        studentGrades[subject] = {};
        periods.forEach(period => {
          // Usar valor base 80 para evitar aleatoriedad
          studentGrades[subject][period] = 80;
        });
      });
      
      const student = new Student(
        `${idBase}00${(i + 1).toString().padStart(2, '0')}`,
        `${firstName} ${lastName} ${secondLastName}`,
        gradeLevel,
        studentGrades
      );
      
      allStudents.push(student);
    }
  });
  
  return allStudents;
};

// Definición del tipo para el contexto
interface StudentContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  updateStudentGrade: (studentId: string, subject: string, period: string, grade: number) => void;
  updateStudentsFromFile: (updatedStudents: Student[]) => void;
}

// Crear el contexto con un valor inicial
const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext debe ser usado dentro de un StudentProvider');
  }
  return context;
};

// Proveedor del contexto
interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  // Estado para almacenar los estudiantes
  const [students, setStudents] = useState<Student[]>(() => {
    // Intentar recuperar datos guardados del localStorage
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      try {
        // Convertir los datos planos a instancias de la clase Student
        const parsedStudents = JSON.parse(savedStudents);
        return parsedStudents.map((s: any) => 
          new Student(s.id, s.name, s.grade, s.grades)
        );
      } catch (error) {
        console.error('Error al cargar estudiantes desde localStorage:', error);
        return createInitialStudents();
      }
    }
    return createInitialStudents();
  });

  // Guardar en localStorage cuando cambia el estado
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Función para actualizar la calificación de un estudiante
  const updateStudentGrade = (studentId: string, subject: string, period: string, grade: number) => {
    if (grade >= 0 && grade <= 100) {
      setStudents(prevStudents => 
        prevStudents.map(student => {
          if (student.id === studentId) {
            // Crear una copia del estudiante
            const updatedStudent = student.clone();
            
            // Si no existe la estructura para la asignatura seleccionada, la creamos
            if (!updatedStudent.grades[subject]) {
              updatedStudent.grades[subject] = {};
            }
            
            // Actualizamos la calificación para el periodo seleccionado
            updatedStudent.grades[subject][period] = grade;
            
            return updatedStudent;
          }
          return student;
        })
      );
    }
  };

  // Función para actualizar múltiples estudiantes (por ejemplo, desde una importación)
  const updateStudentsFromFile = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
  };

  return (
    <StudentContext.Provider value={{ 
      students, 
      setStudents, 
      updateStudentGrade,
      updateStudentsFromFile
    }}>
      {children}
    </StudentContext.Provider>
  );
};