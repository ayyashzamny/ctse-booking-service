import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#logo-gradient)" />
              <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#4f8cff" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar-title">CTSE Bookings</span>
        </Link>

        {isAuthenticated && (
          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              id="nav-dashboard"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/book"
              className={`nav-link ${location.pathname === '/book' ? 'active' : ''}`}
              id="nav-book-event"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Book Event
            </Link>
          </div>
        )}

        <div className="navbar-right">
          {isAuthenticated ? (
            <div className="navbar-user">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.username || 'User'}</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
                id="logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-button">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
