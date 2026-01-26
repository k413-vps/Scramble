# build with docker buildx build --build-context frontend=. --build-context shared=../shared -f Dockerfile . -t frontend

FROM node:20-alpine

RUN npm install -g typescript

WORKDIR /app/shared

COPY --from=shared package.json ./

RUN npm install

COPY --from=shared . .

RUN tsc

WORKDIR /app/frontend/scramble

COPY --from=frontend scramble/package.json ./

RUN npm i

COPY --from=frontend ./scramble .

RUN mv .env.local.prod .env.local

RUN npm run build

CMD ["npm", "run", "start"]