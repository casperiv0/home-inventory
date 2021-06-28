FROM node:16-alpine
WORKDIR /srv/api
COPY ./api/package.json /srv/api/
COPY ./api /srv/api/
RUN npm install


WORKDIR /srv/client
COPY ./client/package.json /srv/client/
COPY ./client /srv/client/
RUN npm install

WORKDIR /srv/
COPY ./package.json ./srv

RUN npm install
