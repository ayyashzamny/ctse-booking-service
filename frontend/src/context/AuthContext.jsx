import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ctse_token')
    const savedUser = localStorage.getItem('ctse_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('ctse_user')
        localStorage.removeItem('ctse_token')
      }
    }
    setIsLoading(false)
  }, [])

  const loginUser = (tokenValue, userInfo) => {
    setToken(tokenValue)
    setUser(userInfo)
    localStorage.setItem('ctse_token', tokenValue)
    localStorage.setItem('ctse_user', JSON.stringify(userInfo))
  }

  const logoutUser = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('ctse_token')
    localStorage.removeItem('ctse_user')
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login: loginUser,
    logout: logoutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
