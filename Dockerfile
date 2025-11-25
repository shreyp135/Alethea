FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (tsx MUST be installed here)
RUN npm install

# Copy entire backend (api + src)
COPY api ./api
COPY src ./src
COPY tsconfig.json ./

# Cloud Run uses port 8080
ENV PORT=8080
EXPOSE 8080

# Start backend with TSX loader
CMD ["node", "--loader", "tsx", "api/server.ts"]
