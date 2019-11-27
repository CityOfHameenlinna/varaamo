FROM node:8.16.1-jessie

WORKDIR /usr/src/app
COPY . .

RUN npm install

CMD npm start