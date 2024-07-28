# Imagem base
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia apenas o package.json e package-lock.json para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm i

# Copia o restante do código
COPY . .

# Comando para iniciar o servidor
CMD ["npm", "start"]