FROM node:latest
WORKDIR /app
ADD . .
CMD ["node", "index.js"]

