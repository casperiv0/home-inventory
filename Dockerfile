FROM node:16
WORKDIR /srv/api
COPY ./core/zyndicate-api/package.json /srv/api/
COPY ./core/zyndicate-api /srv/api/
RUN npm install


WORKDIR /srv/client
COPY ./core/zyndicate/package.json /srv/client/
COPY ./core/zyndicate /srv/client/
RUN npm install

WORKDIR /srv/
COPY ./package.json ./srv

RUN npm install
