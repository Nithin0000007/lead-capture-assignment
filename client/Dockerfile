# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build app
RUN npm run build

# Install serve to run production build
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start command
CMD ["serve", "-s", "dist"]
