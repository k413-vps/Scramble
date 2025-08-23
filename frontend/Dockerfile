# build with docker buildx build --build-context frontend=. --build-context shared=../shared -f Dockerfile . -t frontend

FROM node:20-alpine

WORKDIR /app/frontend/scramble

COPY --from=shared . ../../shared

COPY scramble/package*.json ./

RUN npm i

COPY --from=frontend ./scramble .
RUN mv .env.local.prod .env.local

RUN npm run build

CMD ["npm", "run", "start"]