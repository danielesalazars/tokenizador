Este proyecto es desplegado a traves de docker; al ejecutar los comandos el proyecto creara 5 contenedores los cuales son:

- postgres
- pgAdmin
- redis
- backend
- frontend

#### # Desarrollo

Ejecutar el comando lineas abajo para levantar un ambiente de desarrollo

`docker compose up -d build`

Podran visualizar los archivos necesarios el despliegue.

En el caso de las pruebas, se tendra que ingresar al contenedor backend a traves de:

`docker exec -it backend sh -c "npm test"`

#### Produccion

Ejecutar el comando lineas abajo para levantar un ambiente de produccion

`docker-compose -f docker-compose.prod.yml up -d --build`

Podran visualizar la carpeta dist desplegada para prod y los archivos necesarios para la misma.

###### Rutas de paginas:

- **"GET /",** => visualizaran todos los token creados
- **"POST /token",** => genera un token
- **"POST /token/data"**, => valida el token generado en periodo de 15min

#### Configuración archivo .env de la raiz:

Solo cambiar la variable **STAGE** cuyos valores son **dev** y **prod**

**NOTA: **
Por tema de tiempos no se logro la configuración de lambda.
