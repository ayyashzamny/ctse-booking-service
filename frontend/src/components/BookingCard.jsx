import { useState } from 'react'
import StatusBadge from './StatusBadge'
import './BookingCard.css'

export default function BookingCard({ booking, onCancel }) {
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setCancelling(true)
    try {
      await onCancel(booking._id)
    } finally {
      setCancelling(false)
      setConfirming(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <div className={`booking-card glass-card ${booking.status === 'cancelled' ? 'booking-cancelled' : ''}`}>
      <div className="booking-card-header">
        <div className="booking-event-info">
          <h3 className="booking-event-title">{booking.eventTitle || 'Untitled Event'}</h3>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="booking-card-details">
        <div className="booking-detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formatDate(booking.eventDate)}</span>
          {formatTime(booking.eventDate) && (
            <span className="booking-time">at {formatTime(booking.eventDate)}</span>
          )}
        </div>

        {booking.eventLocation && (
          <div className="booking-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{booking.eventLocation}</span>
          </div>
        )}

        <div className="booking-detail booking-detail-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Booked {formatDate(booking.bookedAt)}</span>
        </div>
      </div>

      {booking.status === 'confirmed' && onCancel && (
        <div className="booking-card-actions">
          {confirming && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setConfirming(false)}
              disabled={cancelling}
            >
              Keep
            </button>
          )}
          <button
            className={`btn btn-sm ${confirming ? 'btn-danger' : 'btn-secondary'}`}
            onClick={handleCancel}
            disabled={cancelling}
            id={`cancel-booking-${booking._id}`}
          >
            {cancelling ? 'Cancelling...' : confirming ? 'Confirm Cancel' : 'Cancel Booking'}
          </button>
        </div>
      )}
    </div>
  )
}
