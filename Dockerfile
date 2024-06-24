# Install dependencies only when needed
#FROM node:18-alpine3.15 AS deps
FROM node:21-alpine3.19 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

#Esta linea es opcional
#RUN apk add --no-cache libc6-compat
WORKDIR /app

# va a copiar el archivo package.json y package-lock.json y lo va a pegar en la raiz del working directory en este caso /app
COPY package.json package-lock.json ./
#Instala las dependencias especificadas en el package.json
RUN npm install --frozen-lockfile


# Build the app with cache dependencies
FROM node:21-alpine3.19 AS builder
#Una vez creado el ARGS=ORDERS_DATABASE_URL en el servicio orders-ms lo puedo usar en el dockerfile.prod para el proceso de construccion y enviarlo a ENV para que el proceso de migracion de prisma pueda leer la variable de entorno y hacer el proceso con exito
ARG ARG_DATABASE_URL
#Prisma esta esperando la variable de entorno DATABASE_URL.
ENV DATABASE_URL=$ARG_DATABASE_URL
WORKDIR /app
#Copiamos desde la imagen que se creo en el stage deps la carpeta app/node_modules y la pegamos en la carpeta especificada en workdir en este caso pegamos en /app de esta imagen llamada builder
COPY --from=deps /app/node_modules ./node_modules
#copiamos todos los archivos que estan en la raiz de mi proyecto local en la carpeta /app de nuestra imagen especificada en workdir
#! se va a ignorar todo lo que esta en el /.dockerignore
COPY . .

#En este caso por ser una base de datos postgres hay que crear las migraciones y generar prisma client antes del build. Todo eso es en el proceso de construccion
RUN npx prisma migrate deploy
RUN npx prisma generate
#crea el build de nest
RUN npm run build
RUN npm ci -f --only=production && npm cache clean --force
#RUN npm install --prod


# Production image, copy all the files and run next
FROM node:21-alpine3.19 AS runner
ARG ARG_DATABASE_URL
#Prisma esta esperando la variable de entorno DATABASE_URL.
ENV DATABASE_URL=$ARG_DATABASE_URL
# Set working directory
WORKDIR /usr/src/app
#!copiamos de nuestra maquina el package.json y el package-lock.json de mi paquina en la raiz del working directory
# COPY package.json package-lock.json ./
# RUN npm install --prod

#!Copiamos los modulos de node que se crearon en el stage anterior y que ya son solo los necesarios para que funcione la aplicacion y hara que la imagen sea mas ligera
COPY --from=builder /app/node_modules ./node_modules

#! Copiamos desde el stage anterior builder la carpeta /app/dist y la pegamos en la raiz de nuestro working directory
COPY --from=builder /app/dist ./dist
#Copiar la carpeta de /app/prisma/
COPY --from=builder /app/prisma ./prisma
#RUN npx prisma generate
CMD [ "node","dist/main" ]