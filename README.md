# API de Servicios y Reservas

Primera versión del Sistema Backend de Turnos y Reservas, hecha con Node.js, Express (ESM) y FileSystem. Gestiona dos recursos, `services` y `bookings`, y persiste los datos en archivos JSON, por lo que no se pierden al reiniciar el servidor.

## Instalación

```bash
git clone <url-del-repo>
cd <carpeta-del-repo>
npm install
```

Creá tu archivo `.env` a partir de `.env.example`:

```
PORT=8080
NODE_ENV=development
```

## Ejecución

```bash
npm start
```

El servidor corre en `http://localhost:8080`.

## Variables de entorno

| Variable   | Descripción          | Ejemplo       |
|------------|----------------------|---------------|
| `PORT`     | Puerto del servidor  | `8080`        |
| `NODE_ENV` | Entorno de ejecución | `development` |

Si falta alguna, la app no arranca y muestra un mensaje de error.

## Estructura

```
src/
  app.js                       Configura Express y monta los routers
  server.js                    Levanta el servidor
  config/env.config.js         Carga y valida las variables de entorno
  routes/                      services.router.js, bookings.router.js
  managers/                    ServiceManager.js, BookingManager.js, instances.js
  middlewares/errorHandler.js  Manejo central de errores
  errors/AppError.js           Error con código HTTP
  data/                        services.json, bookings.json
```

## Recurso `services`

```json
{
  "id": 1,
  "name": "Corte de cabello",
  "description": "Corte de cabello clásico con lavado incluido",
  "duration": 30,
  "price": 5000,
  "category": "peluquería",
  "available": true
}
```

El `id` se genera automáticamente y no se puede modificar. `duration` está en minutos.

| Método | Ruta                 | Descripción                          | Códigos       |
|--------|----------------------|--------------------------------------|---------------|
| GET    | `/api/services`      | Lista los servicios (acepta filtros) | 200           |
| GET    | `/api/services/:sid` | Obtiene un servicio por id           | 200, 404      |
| POST   | `/api/services`      | Crea un servicio                     | 201, 400      |
| PUT    | `/api/services/:sid` | Actualiza un servicio                | 200, 404      |
| DELETE | `/api/services/:sid` | Elimina un servicio                  | 200, 404      |

Filtros en `GET /api/services`: `?category=estética` y `?available=true` (combinables).

## Recurso `bookings`

```json
{
  "id": 1,
  "clientName": "Gonzalo",
  "clientEmail": "gonzalo@mail.com",
  "date": "2026-11-10",
  "time": "15:00",
  "status": "pending",
  "services": [{ "service": 1, "quantity": 2 }]
}
```

El `id` se genera automáticamente. Una reserva nueva arranca con `services` vacío y `status` en `pending` si no se indica otro. Si se agrega dos veces el mismo servicio, se incrementa `quantity`.

| Método | Ruta                                | Descripción                              | Códigos       |
|--------|-------------------------------------|------------------------------------------|---------------|
| POST   | `/api/bookings`                     | Crea una reserva                         | 201, 400      |
| GET    | `/api/bookings/:bid`                | Obtiene una reserva por id               | 200, 404      |
| POST   | `/api/bookings/:bid/services/:sid`  | Agrega un servicio a una reserva         | 200, 404      |

Campos requeridos en `POST /api/bookings`: `clientName`, `clientEmail`, `date`, `time`.

## Errores

Todas las respuestas de error tienen la forma `{ "error": "mensaje" }`:

- `400`: faltan campos o el JSON enviado no es válido.
- `404`: el servicio o la reserva no existe.
- `500`: error interno, por ejemplo una falla al leer o escribir los archivos JSON.

## Ejemplos

```bash
# Listar y filtrar servicios
curl http://localhost:8080/api/services
curl "http://localhost:8080/api/services?category=estética&available=true"

# Crear un servicio
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Depilación","description":"Depilación con cera","duration":20,"price":4000,"category":"estética","available":true}'

# Crear una reserva
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Gonzalo","clientEmail":"gonzalo@mail.com","date":"2026-11-10","time":"15:00"}'

# Agregar el servicio 1 a la reserva 1
curl -X POST http://localhost:8080/api/bookings/1/services/1

# Ver la reserva
curl http://localhost:8080/api/bookings/1
```