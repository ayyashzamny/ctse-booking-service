const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const axios = require("axios");
const { getDB } = require("../config/db");

const EVENT_SERVICE_URL =
  process.env.EVENT_SERVICE_URL || "http://localhost:3001";

const bookEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { eventId, ticketCount = 1 } = req.body;

  try {
    // Inter-service communication: verify event exists via Event Service
    let eventData;
    try {
      const eventResponse = await axios.get(
        `${EVENT_SERVICE_URL}/api/events/${eventId}`,
      );
      eventData = eventResponse.data.event;
    } catch {
      return res.status(404).json({ error: "Event not found" });
    }

    const db = getDB();
    const bookingsCollection = db.collection("bookings");

    // Check if user already booked this event
    const existingBooking = await bookingsCollection.findOne({
      userId: req.user.userId,
      eventId: eventId,
      status: "confirmed",
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "You have already booked this event" });
    }

    const booking = {
      userId: req.user.userId,
      username: req.user.username,
      eventId: eventId,
      eventTitle: eventData.title,
      eventDate: eventData.date,
      eventLocation: eventData.location,
      ticketCount: Math.max(1, parseInt(ticketCount) || 1),
      status: "confirmed",
      bookedAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(booking);

    res.status(201).json({
      message: "Event booked successfully",
      bookingId: result.insertedId,
      booking: { ...booking, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Book event error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const db = getDB();
    const bookingsCollection = db.collection("bookings");

    const bookings = await bookingsCollection
      .find({ userId: userId })
      .sort({ bookedAt: -1 })
      .toArray();

    res.json({ bookings, total: bookings.length });
  } catch (err) {
    console.error("Get bookings error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const db = getDB();
    const bookingsCollection = db.collection("bookings");

    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled", cancelledAt: new Date() } },
    );

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Cancel booking error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { bookEvent, getBookings, cancelBooking };
