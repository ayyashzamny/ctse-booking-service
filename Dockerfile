# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ---- Stage 2: Production ----
FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app .

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3002

CMD ["npm", "start"]
