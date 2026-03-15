const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL || 'http://localhost:3002'
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000'

/**
 * Login via Auth Service
 */
export async function login(email, password) {
  const res = await fetch(`${AUTH_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  return data
}

/**
 * Register via Auth Service
 */
export async function register(username, email, password) {
  const res = await fetch(`${AUTH_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data
}

/**
 * Get all bookings for a user
 */
export async function getBookings(userId) {
  const res = await fetch(`${BOOKING_API_URL}/api/bookings/${userId}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch bookings')
  return data
}

/**
 * Book an event (requires token)
 */
export async function bookEvent(eventId, token) {
  const res = await fetch(`${BOOKING_API_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ eventId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Booking failed')
  return data
}

/**
 * Cancel a booking (requires token)
 */
export async function cancelBooking(id, token) {
  const res = await fetch(`${BOOKING_API_URL}/api/bookings/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Cancel failed')
  return data
}

/**
 * Health check
 */
export async function healthCheck() {
  const res = await fetch(`${BOOKING_API_URL}/health`)
  const data = await res.json()
  if (!res.ok) throw new Error('Health check failed')
  return data
}
