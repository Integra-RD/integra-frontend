import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Auth
import Login from '../pages/auth/Login'
import Recovery from '../pages/auth/Recovery'
import NewPassword from '../pages/auth/NewPassword'

// Student
import GradeHistory from '../pages/student/GradeHistory'
import GradeAverage from '../pages/student/GradeAverage'
import AcademicRanking from '../pages/student/AcademicRanking'
import NotificationsPage from '../pages/student/NotificationsPage'

// Ministry
import MinistryHome from '../pages/ministry/Home'
import Scholarships from '../pages/ministry/Scholarships'
import ImportExportData from '../pages/ministry/ImportExportData'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Student */}
        <Route path="/student/grade-history" element={<GradeHistory />} />
        <Route path="/student/grade-average" element={<GradeAverage />} />
        <Route path="/student/rankings" element={<AcademicRanking />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />

        {/* Ministry */}
        <Route path="/ministry/home" element={<MinistryHome />} />
        <Route path="/ministry/scholarships" element={<Scholarships />} />
        <Route path="/ministry/data" element={<ImportExportData />} />
      </Routes>
    </BrowserRouter>
  )
}
