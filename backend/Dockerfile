# build with docker buildx build --build-context backend=. --build-context shared=../shared -f Dockerfile . -t backend

FROM node:20-alpine

RUN npm install -g typescript

WORKDIR /app/shared

COPY --from=shared package.json ./

RUN npm install

COPY --from=shared . .

RUN tsc 

WORKDIR /app/backend

COPY --from=backend package.json ./

RUN npm install

COPY --from=backend . .

RUN npm run build

RUN npx drizzle-kit generate

CMD ["npm", "run", "start"]