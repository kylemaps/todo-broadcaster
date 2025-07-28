FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .
CMD ["npm", "start"]
# Triggering workflow for Kustomize test