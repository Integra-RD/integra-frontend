import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/auth/Login'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
