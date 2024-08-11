# Utilisez l'image de base Node.js pour l'environnement de développement
FROM node:14

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et yarn.lock dans le conteneur
COPY package.json yarn.lock ./

# Installez toutes les dépendances (y compris les devDependencies) du projet
RUN yarn install --frozen-lockfile

# Copiez tous les fichiers de votre projet dans le conteneur
COPY . .

# Exposez le port sur lequel votre application écoute
EXPOSE 3000

# Démarrez votre application lorsque le conteneur est lancé
CMD ["yarn", "run", "start:dev"]
