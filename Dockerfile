FROM node:10.16.2

#ENV key=value

WORKDIR /home/admin

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update

RUN apt-get install -y chromium vim libatk-bridge2.0-0 libgtk-3-0

EXPOSE 3000

CMD [ "npm","start"]


