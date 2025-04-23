"use client"

import type React from "react"

import { useLocation, useNavigate } from "react-router-dom"
import { BookOpenIcon, AcademicCapIcon, FireIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import LayoutWrapper from "../../components/LayoutWrapper"
import ChartWrapper from "../../components/ChartWrapper"
import { getNavItemsByRole } from "../../utils/getNavItemsByRole"
import { useStudentContext, subjects, grades, periods } from "../../context/StudentContext"
import { useMemo } from "react"

const GradeAverage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole("student", location, navigate)
  const { students } = useStudentContext()

  // Assuming we're showing the logged-in student's grades
  // In a real app, you'd get the current user ID from auth context
  // For now, we'll just use the first student in the list
  const currentStudent = students[0]

  // Calculate current period average
  const currentPeriodAvg = useMemo(() => {
    if (!currentStudent) return 0

    const currentPeriod = periods[periods.length - 1] // Latest period
    let sum = 0
    let count = 0

    subjects.forEach((subject) => {
      const grade = currentStudent.grades[subject]?.[currentPeriod]
      if (grade !== undefined) {
        sum += grade
        count++
      }
    })

    return count > 0 ? sum / count : 0
  }, [currentStudent])

  // Calculate previous period average for comparison
  const previousPeriodAvg = useMemo(() => {
    if (!currentStudent || periods.length < 2) return 0

    const previousPeriod = periods[periods.length - 2] // Second to last period
    let sum = 0
    let count = 0

    subjects.forEach((subject) => {
      const grade = currentStudent.grades[subject]?.[previousPeriod]
      if (grade !== undefined) {
        sum += grade
        count++
      }
    })

    return count > 0 ? sum / count : 0
  }, [currentStudent])

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (previousPeriodAvg === 0) return 0
    return ((currentPeriodAvg - previousPeriodAvg) / previousPeriodAvg) * 100
  }, [currentPeriodAvg, previousPeriodAvg])

  // Find best subject
  const bestSubject = useMemo(() => {
    if (!currentStudent) return ""

    const currentPeriod = periods[periods.length - 1]
    let best = { subject: "", grade: 0 }

    subjects.forEach((subject) => {
      const grade = currentStudent.grades[subject]?.[currentPeriod] || 0
      if (grade > best.grade) {
        best = { subject, grade }
      }
    })

    return best.subject
  }, [currentStudent])

  // Create mock grade averages for each grade level
  // In a real app, you'd calculate this from actual historical data
  const gradeAverages = useMemo(() => {
    if (!currentStudent) return [80, 82, 75, 89, 77] // Default mock data

    // For demo purposes, we'll create some simulated data
    // In a real app, you'd calculate this from the student's actual grades in each level
    return [80, 82, 75, 89, 77]
  }, [currentStudent])

  // Find best and worst grade levels
  const bestGradeLevel = useMemo(() => {
    let bestIndex = 0
    let bestAvg = gradeAverages[0]

    for (let i = 0; i < gradeAverages.length; i++) {
      if (gradeAverages[i] > bestAvg) {
        bestAvg = gradeAverages[i]
        bestIndex = i
      }
    }

    return { grade: grades[bestIndex] || "", avg: bestAvg }
  }, [gradeAverages])

  const worstGradeLevel = useMemo(() => {
    let worstIndex = 0
    let worstAvg = gradeAverages[0]

    for (let i = 0; i < gradeAverages.length; i++) {
      if (gradeAverages[i] < worstAvg) {
        worstAvg = gradeAverages[i]
        worstIndex = i
      }
    }

    return { grade: grades[worstIndex] || "", avg: worstAvg }
  }, [gradeAverages])

  // Chart data
  const averageData = {
    labels: grades,
    datasets: [
      {
        label: "Promedio",
        data: gradeAverages,
        borderColor: "#2c6e91",
        backgroundColor: "rgba(44, 110, 145, 0.2)",
        tension: 0.3,
        pointBorderColor: "#2c6e91",
        pointBackgroundColor: "#fff",
        fill: true,
      },
    ],
  }

  const averageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          color: "#6b7280",
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#6b7280",
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <LayoutWrapper
      navItems={navItems}
      title="Promedios"
      subtitle="En esta sección podrás consultar tu promedio académico general, así como el correspondiente al periodo actual. Utiliza esta información para llevar un seguimiento continuo de tu desempeño y realizar mejoras en tu proceso de aprendizaje."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Period Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#2c6e91] rounded-full w-10 h-10 flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Período Actual</h3>
                <p className="text-sm text-gray-500">{currentStudent?.grade}</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">2024-2025</div>
          </div>

          <div className="flex items-end gap-3 mb-4">
            <p className="text-4xl font-bold text-[#2c6e91]">{currentPeriodAvg.toFixed(1)}</p>
            <div
              className={`flex items-center ${percentageChange >= 0 ? "text-emerald-500" : "text-red-500"} text-sm mb-1`}
            >
              {percentageChange >= 0 ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronUpIcon className="w-4 h-4 transform rotate-180" />
              )}
              <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {percentageChange >= 0
              ? "Tu promedio está mejorando, sigue así."
              : "Tu promedio ha bajado, esfuérzate más."}
          </p>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FireIcon className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-bold text-gray-700 uppercase">Asignatura con mejor Promedio</p>
            </div>
            <p className="text-sm font-light text-gray-800">{bestSubject}</p>
          </div>
        </div>

        {/* General Average Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#2c6e91] rounded-full w-10 h-10 flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold">Promedio General</h3>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-4xl font-bold text-[#2c6e91]">{currentStudent?.getAvg().toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-1">Promedio de todos los períodos</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">Mejor período</span>
              <span className="text-sm font-light">
                {bestGradeLevel.grade} ({bestGradeLevel.avg.toFixed(1)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">Período más bajo</span>
              <span className="text-sm font-light">
                {worstGradeLevel.grade} ({worstGradeLevel.avg.toFixed(1)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Evolución de Promedios por Período</h2>
        <div className="w-full h-[500px]">
          <ChartWrapper type="line" data={averageData} options={averageOptions} className="w-full h-full" />
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default GradeAverage


