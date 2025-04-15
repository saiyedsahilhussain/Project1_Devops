FROM node:latest
WORKDIR /app
ADD . .
EXPOSE 3300
CMD ["node", "server.js"]

