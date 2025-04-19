import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RoleGuard from '../components/RoleGuard'
import Unauthorized from '../pages/Unauthorized'

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
import DirectorHome from '../pages/director/MembersAdmin'
import InstitutionData from '../pages/director/InstitutionData'
import DirectorMessagingPage from '../pages/director/Messaging'

// Teacher
import TeacherReports from '../pages/teacher/Reports'
import TeacherMessagingPage from '../pages/teacher/Messaging'

// Student
import GradeHistory from '../pages/student/GradeHistory'
import GradeAverage from '../pages/student/GradeAverage'
import AcademicRanking from '../pages/student/AcademicRanking'
import NotificationsPage from '../pages/student/NotificationsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/*** Public ***/}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/*** Unauth ***/}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/*** Ministry ***/}
        <Route path="/ministry" element={<Navigate to="/ministry/home" replace />} />
        <Route
          path="/ministry/home"
          element={
            <RoleGuard allowedRoles={['ministry']}>
              <MinistryHome />
            </RoleGuard>
          }
        />
        <Route
          path="/ministry/scholarships"
          element={
            <RoleGuard allowedRoles={['ministry']}>
              <Scholarships />
            </RoleGuard>
          }
        />
        <Route
          path="/ministry/data"
          element={
            <RoleGuard allowedRoles={['ministry']}>
              <ImportExportData />
            </RoleGuard>
          }
        />
        <Route
          path="/ministry/audits"
          element={
            <RoleGuard allowedRoles={['ministry']}>
              <AuditLog />
            </RoleGuard>
          }
        />
        <Route
          path="/ministry/messaging"
          element={
            <RoleGuard allowedRoles={['ministry']}>
              <MinistryMessagingPage />
            </RoleGuard>
          }
        />

        {/*** Director ***/}
        <Route path="/director" element={<Navigate to="/director/members" replace />} />
        <Route
          path="/director/members"
          element={
            <RoleGuard allowedRoles={['director']}>
              <DirectorHome />
            </RoleGuard>
          }
        />
        <Route
          path="/director/institution"
          element={
            <RoleGuard allowedRoles={['director']}>
              <InstitutionData />
            </RoleGuard>
          }
        />
        <Route
          path="/director/messaging"
          element={
            <RoleGuard allowedRoles={['director']}>
              <DirectorMessagingPage />
            </RoleGuard>
          }
        />

        {/*** Teacher ***/}
        <Route path="/teacher" element={<Navigate to="/teacher/reports" replace />} />
        <Route
          path="/teacher/reports"
          element={
            <RoleGuard allowedRoles={['teacher']}>
              <TeacherReports />
            </RoleGuard>
          }
        />
        <Route
          path="/teacher/messaging"
          element={
            <RoleGuard allowedRoles={['teacher']}>
              <TeacherMessagingPage />
            </RoleGuard>
          }
        />

        {/*** Student ***/}
        <Route path="/student" element={<Navigate to="/student/grade-history" replace />} />
        <Route
          path="/student/grade-history"
          element={
            <RoleGuard allowedRoles={['student']}>
              <GradeHistory />
            </RoleGuard>
          }
        />
        <Route
          path="/student/grade-average"
          element={
            <RoleGuard allowedRoles={['student']}>
              <GradeAverage />
            </RoleGuard>
          }
        />
        <Route
          path="/student/rankings"
          element={
            <RoleGuard allowedRoles={['student']}>
              <AcademicRanking />
            </RoleGuard>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <RoleGuard allowedRoles={['student']}>
              <NotificationsPage />
            </RoleGuard>
          }
        />

        {/*** Catch-all ***/}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
