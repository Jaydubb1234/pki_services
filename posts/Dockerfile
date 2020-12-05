#FROM node:alpine
FROM mhart/alpine-node:12 AS build-env
WORKDIR /src
COPY package.json /src/package.json
RUN npm install
COPY server.ts /src/server.ts

#for dev env
FROM mhart/alpine-node:12
WORKDIR /src
COPY --from=build-env /src /src
EXPOSE 4442
CMD npm start