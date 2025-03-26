# Use uma imagem base do Node.js
FROM node:20-alpine



# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências, incluindo as de desenvolvimento
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Instale o TypeScript globalmente
RUN npm install -g typescript

# Copie o arquivo tsconfig.json
COPY tsconfig.json .

# Defina a variável de ambiente LD_LIBRARY_PATH
ENV ORACLE_CLIENT_PATH=/opt/oracle/instantclient:$ORACLE_CLIENT_PATH

# Compile o TypeScript para JavaScript
RUN npm run build

# Exponha a porta na qual sua aplicação vai rodar
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "start"]