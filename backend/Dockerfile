FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json backend/
RUN npm ci --ignore-scripts --workspace=backend --include-workspace-root
COPY backend/ ./backend
RUN npm run build --workspace=backend

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "dist/src/main.js"]
