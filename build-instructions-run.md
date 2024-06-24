## Build
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build

## Run
docker-compose -f docker-compose.prod.yml --env-file .env.prod up

## Nota
Por defecto, __docker-compose__ usa el archivo ```.env```, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```
docker-compose -f docker-compose.prod.yml up --build
```

## Cambiar nombre
```
docker tag <nombre app> <usuario docker hub>/<nombre repositorio>
```
Ingresar a Docker Hub
```
docker login
```

#Subir imagen
```
docker push <usuario docker hub>/<nombre repositorio>
docker push jotacollantes/nest-graphql-prod:1.0.0
```

# Para crear la imagen sin el docker-compose
```
docker build -t nest-graphql-prod
```
# Para ejecutar la imagen sin el docker-compose
```
docker run --env-file=.env.prod -p 4000:4000 nest-graphql-prod
```
# Para cambiar de nombre a una imagen
```
docker tag nest-graphql jotacollantes/nest-graphql-prod:1.0.0
```