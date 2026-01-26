# build with docker buildx build --build-context frontend=. --build-context shared=../shared -f Dockerfile . -t frontend

FROM oven/bun:1

RUN bun add -g typescript

WORKDIR /app/shared

COPY --from=shared package.json ./

RUN bun install

COPY --from=shared . .

RUN tsc

WORKDIR /app/frontend/scramble

COPY --from=frontend scramble/package.json ./

RUN bun install

COPY --from=frontend ./scramble .

RUN mv .env.local.prod .env.local

RUN bun run build

CMD ["bun", "run", "start"]