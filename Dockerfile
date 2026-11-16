FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3012
RUN addgroup -S oenexa && adduser -S oenexa -G oenexa
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
USER oenexa
EXPOSE 3012
CMD ["node", "dist/index.js"]
