FROM node:20.11.0-alpine3.19 as dev-front
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
CMD [ "npm", "start"]