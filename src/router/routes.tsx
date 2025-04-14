import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Recovery from '../pages/auth/Recovery'
import NewPassword from '../pages/auth/NewPassword'
import GradeHistory from '../pages/student/GradeHistory'
import GradeAverage from '../pages/student/GradeAverage'
import AcademicRanking from '../pages/student/AcademicRanking'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/grade-history" element={<GradeHistory />} />
        <Route path="/grade-average" element={<GradeAverage />} />
        <Route path="/rankings" element={<AcademicRanking />} />
      </Routes>
    </BrowserRouter>
  )
}
