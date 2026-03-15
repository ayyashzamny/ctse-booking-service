import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { bookEvent } from '../services/api'
import './BookEventPage.css'

export default function BookEventPage() {
  const [eventId, setEventId] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!eventId.trim()) {
      toast.warning('Please enter an Event ID')
      return
    }

    setLoading(true)
    try {
      const data = await bookEvent(eventId.trim(), token)
      toast.success(data.message || 'Event booked successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Failed to book event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="book-page-layout">
          <div className="book-form-section animate-slide-up">
            <div className="book-header">
              <h1 className="book-title">Book an Event</h1>
              <p className="book-subtitle">
                Enter the Event ID to reserve your spot
              </p>
            </div>

            <div className="book-card glass-card">
              <form onSubmit={handleSubmit} id="book-event-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="event-id">
                    Event ID
                  </label>
                  <input
                    className="form-input"
                    type="text"
                    id="event-id"
                    placeholder="e.g. 507f1f77bcf86cd799439011"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    autoFocus
                  />
                  <span className="form-hint">
                    The unique identifier of the event you want to book
                  </span>
                </div>

                <button
                  className="btn btn-primary btn-lg book-submit"
                  type="submit"
                  disabled={loading || !eventId.trim()}
                  id="book-submit"
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Book Event
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Panel */}
          <div className="book-info-section animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="info-card glass-card">
              <h3 className="info-card-title">How it works</h3>
              <div className="info-steps">
                <div className="info-step">
                  <div className="info-step-number">1</div>
                  <div className="info-step-content">
                    <h4>Get Event ID</h4>
                    <p>Find the event ID from the event listing or organizer</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="info-step-number">2</div>
                  <div className="info-step-content">
                    <h4>Enter & Book</h4>
                    <p>Paste the Event ID and click "Book Event"</p>
                  </div>
                </div>
                <div className="info-step">
                  <div className="info-step-number">3</div>
                  <div className="info-step-content">
                    <h4>Confirmation</h4>
                    <p>Your booking is confirmed instantly and appears on your dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card glass-card">
              <h3 className="info-card-title">Need help?</h3>
              <p className="info-card-text">
                Contact the event organizer to get the Event ID. Each event has a unique identifier that you can use to book your spot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
