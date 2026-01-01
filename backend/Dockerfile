FROM node:18-slim

WORKDIR /app

# Install Prisma CLI globally and required dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g prisma

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

# Default command (can be overridden)
CMD ["npm", "run", "dev"]

