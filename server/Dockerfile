FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline
COPY src ./src
CMD ["node", "src/index.js"]
