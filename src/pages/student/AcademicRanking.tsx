"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import LayoutWrapper from "../../components/LayoutWrapper"
import Dropdown from "../../components/Dropdown"
import { getNavItemsByRole } from "../../utils/getNavItemsByRole"
import { useStudentContext, grades as gradeOptions, periods } from "../../context/StudentContext"

const PODIUM_HEIGHTS = [60, 100, 80]
const PODIUM_RANKS = [3, 1, 2]
const PODIUM_ORDER = [2, 0, 1]

const PodiumBar: React.FC<{
  rank: number
  height: number
  name?: string
  average?: number
}> = ({ rank, height, name, average }) => (
  <div className="flex flex-col items-center">
    {name && (
      <div className="text-center mb-2">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{average?.toFixed(1)} Promedio</p>
      </div>
    )}
    <div
      className={`w-16 md:w-20 rounded-t-md flex items-center justify-center text-xl font-bold ${
        name ? "bg-[#2c6e91] text-white" : "bg-gray-300 text-gray-500"
      }`}
      style={{ height: `${height}px` }}
    >
      {rank}
    </div>
  </div>
)

const AcademicRanking: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = getNavItemsByRole("student", location, navigate)
  const { students } = useStudentContext()

  const [selectedGrade, setSelectedGrade] = useState("Todos los grados")
  const [selectedPeriod, setSelectedPeriod] = useState("Todos los periodos")

  // Create dropdown options
  const allGradeOptions = ["Todos los grados", ...gradeOptions]
  const periodOptions = ["Todos los periodos", ...periods]

  const filteredData = useMemo(() => {
    return students.filter((student) => {
      const matchGrade = selectedGrade === "Todos los grados" || student.grade === selectedGrade
      return matchGrade
    })
  }, [students, selectedGrade])

  const sortedData = useMemo(() => [...filteredData].sort((a, b) => b.getAvg() - a.getAvg()), [filteredData])

  const top3 = useMemo(() => sortedData.slice(0, 3), [sortedData])
  const rest = useMemo(() => sortedData.slice(3), [sortedData])

  const renderTop3 = () => (
    <div className="flex justify-center items-end gap-6 mb-8">
      {[0, 1, 2].map((i) => {
        const student = top3[PODIUM_ORDER[i]]
        return (
          <PodiumBar
            key={i}
            rank={PODIUM_RANKS[i]}
            height={PODIUM_HEIGHTS[i]}
            name={student?.name}
            average={student?.getAvg()}
          />
        )
      })}
    </div>
  )

  const renderFeedbackMessage = () => {
    if (rest.length > 0) return null
    if (top3.length === 3) {
      return (
        <p className="text-sm text-gray-500 text-center mt-10">
          Solo se encontraron estudiantes suficientes para el podio.
        </p>
      )
    }
    if (top3.length > 0) {
      return (
        <p className="text-sm text-gray-500 text-center mt-10">
          Hay estudiantes, pero no suficientes para mostrar el podio completo.
        </p>
      )
    }
    return (
      <p className="text-sm text-gray-500 text-center mt-10">
        No hay estudiantes que coincidan con los filtros seleccionados.
      </p>
    )
  }

  return (
    <LayoutWrapper
      navItems={navItems}
      title="Ranking Académico"
      subtitle="Consulta los estudiantes con los mejores promedios según grado y periodo."
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Dropdown label="Grado" options={allGradeOptions} selected={selectedGrade} onChange={setSelectedGrade} />
        <Dropdown label="Periodo" options={periodOptions} selected={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {renderTop3()}

      {rest.length > 0 && (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
          {rest.map((student, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-none hover:bg-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full bg-[#2c6e91] text-white">
                  {index + 4}
                </div>
                <span className="text-sm font-medium text-gray-900">{student.name}</span>
              </div>
              <div className="text-sm font-semibold text-[#2c6e91]">
                {student.getAvg().toFixed(1)} <span className="text-xs font-normal text-gray-500">Promedio</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderFeedbackMessage()}
    </LayoutWrapper>
  )
}

export default AcademicRanking


