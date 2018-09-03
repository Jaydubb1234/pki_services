#FROM node:alpine
FROM mhart/alpine-node:8 AS build-env
WORKDIR /src
#COPY package.json /src/package.json
COPY . /src
RUN yarn install
COPY server.ts /src/server.ts

#for dev env
FROM mhart/alpine-node:8
WORKDIR /src
COPY --from=build-env /src /src
EXPOSE 4442
CMD yarn server

#for prod env
# FROM alpine:3.6
# WORKDIR /src
# COPY --from=build-env /usr/bin/node /usr/bin/
# COPY --from=build-env /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
# COPY --from=build-env /src /src
# EXPOSE 4442
# CMD ["node", "./build/index.js"]