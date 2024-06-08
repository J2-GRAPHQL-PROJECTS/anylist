<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Instrucciones para levantar la aplicacion
1. Clonar el proyecto
2. Copiar el ```env.template``` y renombrar a ```.env```
3. Ejecutar
```
npm install
```
4. Levantar la imagen de docker
```
docker compose up -dev --remove-orphans
```
5. Levantar nest
```
npm run start:dev
```
6. Ir a
```
http://localhost:3000
```