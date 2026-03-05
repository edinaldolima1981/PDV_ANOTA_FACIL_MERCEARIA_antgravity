# Estágio 1: Build da aplicação React/Vite
FROM node:20-alpine as build

WORKDIR /app

# Copia e instala dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copia o resto do código e gera o build
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copia o build gerado no estágio anterior para o diretório de HTML do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx (opcional, para lidar com React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
