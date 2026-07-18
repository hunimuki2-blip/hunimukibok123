# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads/videos public/uploads/thumbnails

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "backend/server.js"]
