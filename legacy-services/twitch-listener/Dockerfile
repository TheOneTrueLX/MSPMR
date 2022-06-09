FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn install --pure-lockfile

COPY * /usr/src/app

CMD [ "echo", "Service twitch-listener is disabled" ]