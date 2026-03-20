# CTSE Booking Service

A booking management microservice built with **Node.js**, **Express**, and **MongoDB**. Part of the CTSE Cloud Computing group project — Event Management System.

## Architecture

This service manages event bookings and integrates with:

- **Auth Service** — Token validation (inter-service communication)
- **Event Service** — Verifies events exist before booking (inter-service communication)

### Endpoints

| Method   | Endpoint                | Description               | Auth Required |
| -------- | ----------------------- | ------------------------- | ------------- |
| `POST`   | `/api/bookings`         | Book an event             | Yes (Bearer)  |
| `GET`    | `/api/bookings/:userId` | Get bookings by user ID   | No            |
| `DELETE` | `/api/bookings/:id`     | Cancel a booking          | Yes (Bearer)  |
| `GET`    | `/health`               | Health check              | No            |
| `GET`    | `/api/bookings/docs`    | Swagger API documentation | No            |

## Inter-Service Communication

```
Client → Booking Service (with JWT token in header)
           ↓ calls Auth Service /api/auth/validate (verify token)
           ↓ calls Event Service /api/events/:id (verify event exists)
           ← creates booking if both valid
```

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT validation via Auth Service
- **Event Verification**: Via Event Service
- **Security**: Helmet.js, express-rate-limit, express-validator
- **Docs**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing**: Jest + Supertest
- **Linting**: ESLint
- **Containerization**: Docker (multi-stage build)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (ECR + ECS Fargate)
- **SAST**: Snyk

## API Documentation (Swagger)

The Swagger API documentation for all microservices is accessible via the AWS Application Load Balancer. 

To view the Swagger UI for the Booking Service, visit:
**[`http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com/api/bookings/docs`](http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com/api/bookings/docs)**

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── config/
│   ├── db.js                 # MongoDB connection
│   └── swagger.js            # Swagger configuration
├── controllers/
│   └── bookingController.js  # Booking CRUD logic
├── middleware/
│   └── authMiddleware.js     # Token validation via Auth Service
└── routes/
    └── bookingRoutes.js      # Route definitions + Swagger docs
tests/
└── booking.test.js           # Integration tests
```

## License

ISC
