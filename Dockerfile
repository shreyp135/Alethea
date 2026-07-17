FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY api ./api
COPY src ./src
COPY tsconfig.json ./

ENV PORT=8080

EXPOSE 8080

CMD ["node", "--import", "tsx", "api/server.ts"]
