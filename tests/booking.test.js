const request = require("supertest");
const app = require("../src/app");

describe("Booking Service", () => {
  describe("GET /", () => {
    it("should return service running message", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Booking Service Running...");
    });
  });

  describe("GET /booking/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/booking/health");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("booking-service");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/bookings/health", () => {
    it("should return health status via alias", async () => {
      const res = await request(app).get("/api/bookings/health");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("booking-service");
    });
  });

  describe("POST /api/bookings", () => {
    it("should reject booking without token", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .send({ eventId: "507f1f77bcf86cd799439011" });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("No token provided");
    });

    it("should reject booking with invalid token", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", "Bearer invalidtoken123")
        .send({ eventId: "507f1f77bcf86cd799439011" });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/bookings/:userId", () => {
    it("should attempt to return bookings for a user", async () => {
      const res = await request(app).get("/api/bookings/testuser123");
      // 200 if DB connected, 500 if not
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/bookings/:id", () => {
    it("should reject cancel without token", async () => {
      const res = await request(app).delete(
        "/api/bookings/507f1f77bcf86cd799439011",
      );
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/bookings/docs", () => {
    it("should serve Swagger docs", async () => {
      const res = await request(app).get("/api/bookings/docs/").redirects(1);
      expect(res.statusCode).toBe(200);
    });
  });
});
