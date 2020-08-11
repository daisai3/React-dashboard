FROM node:12.16.1-alpine

ENV PATH /node_modules/.bin:$PATH

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . ./

CMD ["yarn", "start"]