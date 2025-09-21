# Use official Node 18 LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source
COPY . .

# Set environment
ENV NODE_ENV=production
# Fly.io provides PORT; our server reads process.env.PORT with fallback 8008
ENV PORT=8080

# Expose port used by Fly (matches PORT)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
