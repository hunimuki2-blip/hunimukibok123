# Dockerfile for ClipVibe - TikTok-like Video Sharing Platform

# Build stage for frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source files
COPY frontend/ ./

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install production dependencies
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install backend dependencies
RUN npm install --production

# Copy backend files
COPY backend/ ./backend/
COPY public/ ./public/

# Copy built frontend
COPY --from=frontend-builder /app/build ./frontend/build

# Create uploads directory
RUN mkdir -p public/uploads/videos public/uploads/thumbnails

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
