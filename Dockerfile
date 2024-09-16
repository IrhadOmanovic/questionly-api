# Setup
FROM node:20-alpine

# Install system dependencies required by node-canvas
RUN apk add --no-cache make gcc g++ python3 pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev

# Install runtime dependencies required by node-canvas
RUN apk add --no-cache cairo pango libjpeg-turbo libc6-compat

WORKDIR /heartbeat-api

# Install packages
COPY package*.json .
RUN npm install

# Rebuild canvas module against current Node.js version
# RUN npm uninstall canvas && npm install canvas --build-from-source && npm rebuild canvas --update-binary

# Build app
COPY . .
RUN npm run db:generate
RUN npm run build

# Expose port and start command
EXPOSE 3000
CMD ["npm", "run", "start:prod"]