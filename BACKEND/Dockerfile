# Imagen base con soporte vigente (Node 18 ya no recibe actualizaciones)
FROM node:25-alpine
WORKDIR /app
# 1) Primero solo los archivos de dependencias (aprovecha la caché de Docker)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
# 2) Luego el código de la aplicación
COPY src/ ./src/
COPY sql/ ./sql/
# 3) Carpeta de documentos con permisos para el usuario sin privilegios
RUN mkdir -p uploads/contracts && chown -R node:node /app/uploads
# 4) No ejecutar como administrador (root)
USER node
# 5) El puerto real en que escucha la API
EXPOSE 4000
CMD ["node", "src/app.js"]