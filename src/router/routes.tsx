import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Recovery from '../pages/auth/Recovery'
import NewPassword from '../pages/auth/NewPassword'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
    </BrowserRouter>
  )
}
