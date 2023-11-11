FROM ubuntu:22.04

WORKDIR /app

RUN apt-get update
RUN apt-get install -y nodejs npm curl

RUN npm install --global n
RUN n 20

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY ./src ./src

ENTRYPOINT ["node", "src/server.js"]
