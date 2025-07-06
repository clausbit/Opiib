# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production && \
    cd client && npm ci --only=production && \
    cd ../server && npm ci --only=production

# Copy source code
COPY client/ ./client/
COPY server/ ./server/

# Build client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/node_modules ./node_modules

# Copy server source code
COPY --from=builder /app/server/src ./src
COPY --from=builder /app/server/index.js ./

# Copy built client files
COPY --from=builder /app/client/build ./client/build

# Change ownership to app user
RUN chown -R nextjs:nodejs /app

# Switch to app user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 3001, path: '/health', timeout: 2000 }; \
    const request = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); \
    request.on('error', () => process.exit(1)); \
    request.end();"

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]