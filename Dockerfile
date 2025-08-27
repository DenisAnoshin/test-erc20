FROM node:20-bookworm-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy sources
COPY . .

# Build TypeScript backend
RUN npm run build

# Utilities for waiting on RPC
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENV RPC_URL=http://127.0.0.1:8545
ENV PORT=3001

EXPOSE 3001


