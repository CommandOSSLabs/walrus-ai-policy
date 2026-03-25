FROM node:22-slim AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_GRAPHQL_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
RUN pnpm run build

FROM node:alpine AS runtime
RUN npm install -g serve
COPY --from=builder /app/build/client /app
CMD ["sh", "-c", "serve /app -l ${PORT:-3000}"]
