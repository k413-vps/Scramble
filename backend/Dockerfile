# build with docker buildx build --build-context backend=. --build-context shared=../shared -f Dockerfile . -t backend

FROM node:20-alpine

WORKDIR /app/backend

COPY --from=shared . ../shared

COPY package*.json ./

RUN npm install

COPY --from=backend . .

RUN npm run build

RUN npx drizzle-kit generate

CMD ["npm", "run", "start"]