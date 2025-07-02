# 1. Build Stage
FROM node:20 AS builder

WORKDIR /app

# Paketdateien kopieren und Dependencies installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren
COPY . .

# Prisma Client generieren (wichtig!)
RUN npx prisma generate

# App bauen (z.B. NestJS build)
RUN npm run build

# 2. Production Stage
FROM node:20

WORKDIR /app

# Nur die notwendigen Dateien kopieren
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Port freigeben
EXPOSE 3000

# Startbefehl
CMD ["npm", "run", "start:prod"]