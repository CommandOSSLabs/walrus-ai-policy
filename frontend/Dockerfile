# ---- Builder ----
FROM node:22-slim AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

ARG ARCHIVE_PACKAGE_ID
ARG GRAPHQL_URL

ENV VITE_GRAPHQL_URL=$GRAPHQL_URL
ENV VITE_ARCHIVE_PACKAGE_ID=$ARCHIVE_PACKAGE_ID

RUN pnpm build

# ---- Runtime ----
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/build/client /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]