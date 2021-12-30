FROM node:14-alpine


RUN mkdir /app
WORKDIR /app
COPY package.json .
RUN yarn

COPY . .

RUN build

EXPOSE 5000
CMD [ "npm", "start" ]
