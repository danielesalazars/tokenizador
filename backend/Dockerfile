# Etapa de desarrollo
FROM node:20.11.0-alpine3.19 as dev
WORKDIR /app
COPY backend/package.json ./
RUN npm install
COPY .env .
COPY . .
CMD ["npm", "run", "dev"]

# Etapa de producción
FROM node:20.11.0-alpine3.19 as prod
WORKDIR /app
COPY backend/package.json ./
RUN npm install --only=production
COPY .env .
COPY backend/dist ./dist
CMD ["npm", "start"]