# Use the official lightweight Node.js Alpine image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Expose port 3000 (default chat port)
EXPOSE 3000

# Set Node environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the Node.js server
CMD [ "npm", "start" ]
