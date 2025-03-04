FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN echo "DB_HOST=postgres" > .env \
    && echo "DB_PORT=5432" >> .env \
    && echo "DB_USERNAME=postgres" >> .env \
    && echo "DB_PASSWORD=postgres" >> .env \
    && echo "DB_DATABASE=flatirons" >> .env \
    && echo "PORT=3000" >> .env \
    && echo "REDIS_HOST=redis" >> .env \
    && echo "REDIS_PORT=6379" >> .env \
    && echo "EXCHANGE_RATE_API_BASE_URL=https://cdn.jsdelivr.net" >> .env \
    && echo "EXCHANGE_RATE_BASE_CURRENCY=usd" >> .env

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"] 