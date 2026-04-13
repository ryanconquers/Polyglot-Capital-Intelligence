import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const CREDENTIALS = {
  'user@wertkern.com': { password: 'user123', role: 'user', name: 'Analyst' },
  'dba@wertkern.com':  { password: 'dba456',  role: 'dba',  name: 'DBA Root' },
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)

  const login = (email, password) => {
    const record = CREDENTIALS[email.toLowerCase().trim()]
    if (!record || record.password !== password) return false
    setSession({ email, role: record.role, name: record.name })
    return true
  }

  const logout = () => setSession(null)

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}