# Utilisation de Node.js LTS
FROM node:18

# Définition du dossier de travail
WORKDIR /app

# Copie des fichiers
COPY package.json ./
RUN npm install --production

# Copie du reste du projet
COPY . .

# Exposer le port (doit être 3000 pour CapRover)
EXPOSE 5000

# Lancer l'application
CMD ["node", "server.js"]
