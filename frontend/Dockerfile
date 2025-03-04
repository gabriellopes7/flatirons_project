FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN yarn build

EXPOSE 5173

CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "5173"] 