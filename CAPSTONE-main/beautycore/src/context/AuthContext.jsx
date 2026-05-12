import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser } from '../../app/actions'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [activityLog, setActivityLog] = useState([
    { id: 1, user: 'Andrea', action: 'Logged in', time: '2026-05-07 08:00', ip: '192.168.1.1', status: 'success' },
    { id: 2, user: 'Maria Santos', action: 'Booked appointment', time: '2026-05-07 09:15', ip: '192.168.1.5', status: 'success' },
    { id: 3, user: 'Unknown', action: 'Failed login attempt', time: '2026-05-07 10:02', ip: '203.45.67.89', status: 'failed' },
    { id: 4, user: 'Jessa Reyes', action: 'Updated profile', time: '2026-05-07 11:30', ip: '192.168.1.8', status: 'success' },
    { id: 5, user: 'Andrea', action: 'Exported financial report', time: '2026-05-07 13:00', ip: '192.168.1.1', status: 'success' },
    { id: 6, user: 'Unknown', action: 'Failed login attempt', time: '2026-05-07 14:22', ip: '198.51.100.42', status: 'failed' },
  ])

  // Persist session on refresh
  useEffect(() => {
    const saved = localStorage.getItem('beauty_auth_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem('beauty_auth_user')
      }
    }
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (initialized) {
      if (user) localStorage.setItem('beauty_auth_user', JSON.stringify(user))
      else localStorage.removeItem('beauty_auth_user')
    }
  }, [user, initialized])

  async function login(email, password, role) {
    setLoginError('')
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('role', role)

    const res = await loginUser(formData)
    if (res.success) {
      setUser(res.user)
      addLog(res.user.name, 'Logged in', 'success')
      return { success: true, role: res.user.role }
    } else {
      setLoginError(res.error || 'Invalid email or password.')
      addLog('Unknown', 'Failed login attempt', 'failed')
      return { success: false }
    }
  }

  function logout() {
    if (user) addLog(user.name, 'Logged out', 'success')
    setUser(null)
  }

  function addLog(userName, action, status) {
    const now = new Date()
    const time = now.toISOString().slice(0, 16).replace('T', ' ')
    setActivityLog(prev => [
      { id: Date.now(), user: userName, action, time, ip: '192.168.1.x', status },
      ...prev
    ])
  }

  if (!initialized) return null // Prevent flash of unauth state

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, activityLog, addLog }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
