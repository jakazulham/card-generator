# Stage 1: Build React/Vite frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Setup backend
FROM node:20-alpine AS build-backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev

# Stage 3: Production — Nginx + Backend in one container
FROM node:20-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Copy backend
WORKDIR /app
COPY --from=build-backend /app/node_modules ./node_modules
COPY server/ .

# Copy frontend build to nginx
COPY --from=build-frontend /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor config
RUN mkdir -p /var/log/supervisor /run/nginx /app/data /app/uploads
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
