const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
  }),
);
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(limiter);

// --- Swagger API Docs ---
app.use("/api/bookings/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Health Check ---
app.get("/api/bookings/health", (req, res) => {
  res.json({
    status: "ok",
    service: "booking-service",
    timestamp: new Date().toISOString(),
  });
});

// --- Routes ---
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Booking Service Running...");
});

module.exports = app;
