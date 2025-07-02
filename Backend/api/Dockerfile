# Verwende Node.js 18 als Basis
FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren
COPY . .

# App bauen
RUN npm run build

# Port freigeben (optional)
EXPOSE 3000

# App starten
CMD ["npm", "run", "start:prod"]
