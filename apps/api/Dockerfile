FROM node:20-alpine as base
RUN corepack enable && apk add --no-cache wget

FROM base as builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm --filter api build

FROM base as runner
WORKDIR /app
COPY --from=builder /app/apps/api/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod
COPY --from=builder /app/apps/api/dist ./dist

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]