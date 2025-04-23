"use client"

import type React from "react"
import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import LayoutWrapper from "../../components/LayoutWrapper"
import DataTable from "../../components/DataTable"
import { getNavItemsByRole } from "../../utils/getNavItemsByRole"
import { useStudentContext, periods, subjects } from "../../context/StudentContext"

const GradeHistory: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole("student", location, navigate)
  const { students } = useStudentContext()

  // Assuming we're showing the logged-in student's grades
  // In a real app, you'd get the current user ID from auth context
  // For now, we'll just use the first student in the list
  const currentStudent = students[0]

  // Process the student's grades for all periods
  // The DataTable component will handle filtering by period internally
  const gradesData = useMemo(() => {
    if (!currentStudent) return []

    // Create an array to hold all subject/period combinations
    const allGradesData = []

    // For each subject and period combination
    for (const subject of subjects) {
      for (const period of periods) {
        const grade = currentStudent.grades[subject]?.[period] || 0

        // Calculate average for this subject across all students
        const subjectGrades = students
          .map((s) => s.grades[subject]?.[period])
          .filter((g) => g !== undefined && g !== null) as number[]

        const average =
          subjectGrades.length > 0 ? subjectGrades.reduce((sum, g) => sum + g, 0) / subjectGrades.length : 0

        // Mock teacher names (in a real app, you'd have this data)
        const teacherNames = [
          "Vicente Fernández",
          "Alejandro Fernández",
          "Joan Sebastian",
          "Christian Nodal",
          "Antonio Aguilar",
          "Cristian Castro",
          "Carlos Rivera",
        ]
        const teacherIndex = subjects.indexOf(subject) % teacherNames.length

        allGradesData.push({
          subject,
          grade,
          teacher: teacherNames[teacherIndex],
          average: average.toFixed(1),
          period, // Include period for filtering
        })
      }
    }

    return allGradesData
  }, [currentStudent, students])

  return (
    <LayoutWrapper
      navItems={navItems}
      title="Historial"
      subtitle="Consulta todas tus calificaciones en un solo lugar. Accede a tu historial académico, revisa tus notas por materia y periodo."
    >
      <DataTable
        headers={[
          { label: "Asignatura", key: "subject" },
          { label: "Calificación", key: "grade" },
          { label: "Docente", key: "teacher" },
          { label: "Promedio de Calificación", key: "average" },
        ]}
        data={gradesData}
        dropdownLabel="Periodo"
        dropdownOptions={periods}
        extraFilters={true}
      />
    </LayoutWrapper>
  )
}

export default GradeHistory

