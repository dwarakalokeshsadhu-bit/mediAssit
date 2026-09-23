# ==============================================================================
# Multi-stage Dockerfile for MedAssist (Production Ready)
# ==============================================================================

# Stage 1: Build Frontend SPA
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy client dependencies and install
COPY client/package*.json ./
RUN npm ci

# Copy client source and build production bundle
COPY client/ ./
RUN npm run build

# Stage 2: Setup Production Server Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies for server
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server code
COPY server/ ./server/

# Copy compiled frontend from client-builder into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5000

# Run as non-root user for security
USER node

# Start MedAssist Express production server
CMD ["node", "server/src/index.js"]
