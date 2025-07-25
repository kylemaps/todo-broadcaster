FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .
# Trigger new build with comment
CMD ["npm", "start"]