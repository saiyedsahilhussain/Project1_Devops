FROM node:latest
WORKDIR /app
ADD . .
CMD ["node", "server.js"]

