# Dockerfile for devops-api project
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./

# Install dependencies in a separate layer to leverage caching
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# create non-root user to run the application
RUN addgroup -g 1001 -S node.js && \
    adduser -S nodejs -u 1001
# Expose the application port
EXPOSE 3000

# Health check for the application
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
# Development stage
FROM base AS development
USER root
RUN npm ci && npm cache clean --force
USER nodejs
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
CMD ["npm", "start"]