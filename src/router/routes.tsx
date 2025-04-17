import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Auth
import Login from '../pages/auth/Login'
import Recovery from '../pages/auth/Recovery'
import NewPassword from '../pages/auth/NewPassword'

// Ministry
import MinistryHome from '../pages/ministry/Home'
import Scholarships from '../pages/ministry/Scholarships'
import ImportExportData from '../pages/ministry/ImportExportData'
import AuditLog from '../pages/ministry/AuditLog'
import MinistryMessagingPage from '../pages/ministry/Messaging'

// Director
import DirectorMessagingPage from '../pages/director/Messaging'

// Teacher
import TeacherMessagingPage from '../pages/teacher/Messaging'

// Student
import GradeHistory from '../pages/student/GradeHistory'
import GradeAverage from '../pages/student/GradeAverage'
import AcademicRanking from '../pages/student/AcademicRanking'
import NotificationsPage from '../pages/student/NotificationsPage'
import DirectorHome from '../pages/director/Home'
import InstitutionData from '../pages/director/InstitutionData'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Ministry */}
        <Route path="/ministry/home" element={<MinistryHome />} />
        <Route path="/ministry/scholarships" element={<Scholarships />} />
        <Route path="/ministry/data" element={<ImportExportData />} />
        <Route path="/ministry/audits" element={<AuditLog />} />
        <Route path="/ministry/messaging" element={<MinistryMessagingPage />} />

        {/* Director */}
        <Route path="/director/messaging" element={<DirectorMessagingPage />} />

        {/* Teacher */}
        <Route path="/teacher/messaging" element={<TeacherMessagingPage />} />

        {/* Student */}
        <Route path="/student/grade-history" element={<GradeHistory />} />
        <Route path="/student/grade-average" element={<GradeAverage />} />
        <Route path="/student/rankings" element={<AcademicRanking />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />

        {/*Director */}
        <Route path="/director/home" element={<DirectorHome />} />
        <Route path="/director/institution" element={<InstitutionData />} />
      </Routes>
    </BrowserRouter>
  )
}
