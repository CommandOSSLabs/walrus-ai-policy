FROM oven/bun:1.2 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG VITE_GRAPHQL_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
RUN bun run build

FROM node:alpine AS runtime
RUN npm install -g serve
COPY --from=builder /app/build/client /app
EXPOSE 3000
CMD ["serve", "-s", "/app", "-l", "3000"]
