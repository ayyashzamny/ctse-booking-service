import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { register as apiRegister } from '../services/api'
import './LoginPage.css'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.warning('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const data = await apiRegister(username, email, password)
      login(data.token, { userId: data.userId, username: data.username || username, email })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.')
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
                <rect width="48" height="48" rx="14" fill="url(#reg-grad)" />
                <path d="M24 16v16M16 24h16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="reg-grad" x1="0" y1="0" x2="48" y2="48">
                    <stop stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">Join us to start booking events</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="register-username">Username</label>
              <input
                className="form-input"
                type="text"
                id="register-username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email</label>
              <input
                className="form-input"
                type="email"
                id="register-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password</label>
              <input
                className="form-input"
                type="password"
                id="register-password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              className="btn btn-primary btn-lg login-submit"
              type="submit"
              disabled={loading}
              id="register-submit"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="login-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
