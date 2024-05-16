# Imagem base
FROM node:16

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código do projeto
COPY src ./src

# Expor a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "src/server.js"]
