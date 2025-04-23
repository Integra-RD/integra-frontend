import AppRouter from './router/routes'
import { StudentProvider } from '././context/StudentContext'

export default function App() {
  return (
    <StudentProvider>
      <AppRouter />
    </StudentProvider>
  )
}
