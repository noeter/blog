FROM node:20-alpine

WORKDIR /usr/server

# git install
RUN apk add git

COPY ./package.json ./
RUN npm install

COPY ./ .

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]