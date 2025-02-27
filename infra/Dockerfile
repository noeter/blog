FROM node:lts-buster-slim as base

WORKDIR /my-remix-app

RUN apt-get update && apt-get install -y procps
EXPOSE 3000

CMD ["npm", "run", "dev"]