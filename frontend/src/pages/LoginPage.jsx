import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { login as apiLogin } from '../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.warning('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      login(data.token, { userId: data.userId, username: data.username, email })
      toast.success(`Welcome back, ${data.username}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-container animate-scale-in">
        <div className="login-card glass-card">
          <div className="login-header">
            <div className="login-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="14" fill="url(#login-grad)" />
                <path d="M14 24L21 31L34 17" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="login-grad" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#4f8cff" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to manage your event bookings</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                className="form-input"
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                className="form-input"
                type="password"
                id="login-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn btn-primary btn-lg login-submit"
              type="submit"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="login-link">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
