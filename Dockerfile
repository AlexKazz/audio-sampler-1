# Start from the official Node.js Alpine-based image.
FROM node:18-alpine

# Set the working directory in Docker to '/app'.
WORKDIR /app

# Copy package.json and package-lock.json to Docker environment.
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy the rest of your app's source code from your local 'current' directory to the '/app' directory in Docker.
COPY . .

# Expose port 3000 to have it mapped by Docker daemon.
EXPOSE 3000

# Define the command to start your app using CMD which defines your runtime.
CMD ["npm", "run", "dev"]
