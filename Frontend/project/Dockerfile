# Use Node.js as the build environment
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files and build the app
COPY . .
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:alpine

# Copy built files to Nginx default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
