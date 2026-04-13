import { AuthProvider } from './AuthContext'
import QueryConsole from './QueryConsole'

export default function App() {
  return (
    <AuthProvider>
      <QueryConsole />
    </AuthProvider>
  )
}