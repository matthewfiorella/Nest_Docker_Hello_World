FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV AWS_ACCESS_KEY_ID="id"
ENV AWS_SECRET_ACCESS_KEY="key"
CMD [ "node", "dist/main.js" ]