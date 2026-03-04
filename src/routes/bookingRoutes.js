const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Event booked successfully
 *       400:
 *         description: Already booked or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.post(
  "/",
  authMiddleware.verifyToken,
  [
    body("eventId")
      .trim()
      .notEmpty()
      .withMessage("Event ID is required")
      .escape(),
  ],
  bookingController.bookEvent,
);

/**
 * @swagger
 * /api/bookings/{userId}:
 *   get:
 *     summary: Get bookings by user ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user bookings
 */
router.get("/:userId", bookingController.getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to cancel this booking
 *       404:
 *         description: Booking not found
 */
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  bookingController.cancelBooking,
);

module.exports = router;
