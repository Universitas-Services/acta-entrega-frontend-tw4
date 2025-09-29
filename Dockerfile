# ====================================================================================
# FASE 1: Builder - Construye la aplicación de producción
# ====================================================================================
# Usamos la imagen oficial de Node.js en su versión LTS (Long-Term Support) como base
FROM node:lts-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de manifiesto del proyecto
COPY package*.json ./

# Instalamos las dependencias de producción. 'npm ci' es más rápido y seguro para CI/CD y Docker
RUN npm ci

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Construimos la aplicación para producción. Esto genera la carpeta .next
RUN npm run build

# ====================================================================================
# FASE 2: Runner - Ejecuta la aplicación construida
# ====================================================================================
# Usamos una imagen de Node.js mucho más ligera y segura para producción
FROM node:lts-alpine AS runner

WORKDIR /app

# Creamos un usuario sin privilegios de root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiamos solo los artefactos necesarios de la fase 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cambiamos el propietario de los archivos al usuario sin privilegios
RUN chown -R nextjs:nodejs /app/.next

# Cambiamos al usuario sin privilegios
USER nextjs

# Exponemos el puerto en el que corre la aplicación Next.js
EXPOSE 3000

# El comando que se ejecutará cuando el contenedor se inicie
CMD ["npm", "start"]