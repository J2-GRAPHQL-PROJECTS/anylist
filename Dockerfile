# Install dependencies only when needed
FROM node:18-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

#Esta linea es opcional
RUN apk add --no-cache libc6-compat
WORKDIR /app

# va a copiar el archivo package.json y package-lock.json y lo va a pegar en la raiz del working directory en este caso /app
COPY package.json package-lock.json ./
#Instala las dependencias especificadas en el package.json
RUN yarn install --frozen-lockfile


# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
WORKDIR /app
#Copiamos desde la imagen que se creo en el stage deps la carpeta app/node_modules y la pegamos en la carpeta especificada en workdir en este caso pegamos en /app de esta imagen llamada builder
COPY --from=deps /app/node_modules ./node_modules
#copiamos todos los archivos que estan en la raiz de mi proyecto local en la carpeta /app de nuestra imagen especificada en workdir
#! se va a ignorar todo lo que esta en el /.dockerignore
COPY . .
#crea el build de nest
RUN yarn build


# Production image, copy all the files and run next
FROM node:18-alpine3.15 AS runner
# Set working directory
WORKDIR /usr/src/app
#!copiamos de nuestra maquina el package.json y el package-lock.json de mi paquina en la raiz del working directory
COPY package.json package-lock.json ./
RUN yarn install --prod
#! Copiamos desde el stage anterior builder la carpeta /app/dist y la pegamos en la raiz de nuestro working directory
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main" ]