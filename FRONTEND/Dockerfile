# Etapa 1: Construcción
FROM node:20 AS builder
 
WORKDIR /app
 
ARG VITE_API_URL=http://localhost:4000
 
COPY package*.json ./
 
# Instalación de dependencias (con versiones fijas en los paquetes extra)
RUN rm -rf node_modules package-lock.json && \
    npm install && \
    npm install @rollup/rollup-linux-x64-gnu@4 --save-optional && \
    npm rebuild esbuild
 
COPY . .
 
ENV VITE_API_URL=${VITE_API_URL}
 
RUN rm -rf node_modules/.cache && npm rebuild esbuild --force
 
RUN npm run build
 
# Etapa 2: Producción
FROM nginx:1.27-alpine
 
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
