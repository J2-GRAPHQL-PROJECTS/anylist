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
Formato corto: Por defecto lee el archivo .env y el docker-compose.yml.
docker compose up -d --remove-orphans

Formato Largo:
docker-compose -f docker-compose.yml --env-file .env up --remove-orphans -d
```



5. Levantar nest
```
npm run start:dev
```
6. Ir a
```
http://localhost:3000/graphql
```
7. Ejecutar la "mutation" executeSeed, para llenar la base de datos con información

8. Para crear las imagenes de docker es necesario cambiar la dependencia bcrypt por bcryptjs e instalar su respectiva dependencia para el typado esctricto. al parecer el linux alpine tiene conflicto con la libreria bcrypt y no con bcryptjs