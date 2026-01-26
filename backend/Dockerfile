# build with docker buildx build --build-context backend=. --build-context shared=../shared -f Dockerfile . -t backend

FROM oven/bun:1

RUN bun add -g typescript

WORKDIR /app/shared

COPY --from=shared package.json ./

RUN bun install

COPY --from=shared . .

RUN bun run build

WORKDIR /app/backend

COPY --from=backend package.json ./

RUN bun install

COPY --from=backend . .

RUN bun run build

RUN bunx drizzle-kit generate

CMD ["bun", "run", "start"]