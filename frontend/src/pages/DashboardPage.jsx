import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getBookings, cancelBooking } from '../services/api'
import BookingCard from '../components/BookingCard'
import './DashboardPage.css'

export default function DashboardPage() {
  const { user, token } = useAuth()
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchBookings = useCallback(async () => {
    if (!user?.userId) return
    setLoading(true)
    try {
      const data = await getBookings(user.userId)
      setBookings(data.bookings || [])
    } catch (err) {
      toast.error('Failed to load bookings: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.userId, toast])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, token)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (err) {
      toast.error('Failed to cancel: ' + err.message)
    }
  }

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true
    return b.status === filter
  })

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="dashboard-header animate-slide-up">
          <div className="dashboard-header-text">
            <h1 className="dashboard-title">
              My Bookings
            </h1>
            <p className="dashboard-subtitle">
              Manage your event reservations
            </p>
          </div>
          <Link to="/book" className="btn btn-primary" id="new-booking-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="stat-card glass-card">
            <div className="stat-icon stat-icon-total">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{bookings.length}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon stat-icon-confirmed">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{confirmedCount}</span>
              <span className="stat-label">Confirmed</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon stat-icon-cancelled">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-value">{cancelledCount}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs animate-slide-up" style={{ animationDelay: '200ms' }}>
          {['all', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              id={`filter-${f}`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">
                {f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-cards">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card glass-card" />
              ))}
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state animate-scale-in">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="empty-title">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="empty-text">
              {filter === 'all'
                ? 'Book your first event to get started!'
                : 'Try a different filter.'}
            </p>
            {filter === 'all' && (
              <Link to="/book" className="btn btn-primary" id="empty-book-btn">
                Book an Event
              </Link>
            )}
          </div>
        ) : (
          <div className="bookings-list stagger-children">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
