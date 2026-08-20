# Stage 1: Build Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build Angular application using production configuration
RUN npm run build

# Stage 2: Serve Angular with Nginx
FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular production build
COPY --from=build /app/dist/pharmacy-ui/browser/ /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]