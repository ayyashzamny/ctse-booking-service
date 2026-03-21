const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Service API",
      version: "1.0.0",
      description:
        "A microservice for managing event bookings in the CTSE Event Management System",
      contact: {
        name: "CTSE Group",
      },
    },
    servers: [
      {
        url: "http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com",
        description: "AWS ALB (Production)",
      },
      {
        url: "http://localhost:3002",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
