# API REST de Servicios

API REST con Express (ESM) para gestionar el recurso `services` de un Sistema Backend de Turnos y Reservas. Las rutas están en un router y la lógica vive en la clase `ServiceManager`, que persiste los datos en un archivo JSON.

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
  config/env.config.js
  managers/ServiceManager.js
  routes/services.router.js
  data/services.json
  app.js
  server.js
```

- `app.js`: configura Express y monta el router en `/api/services`.
- `server.js`: levanta el servidor en el puerto del `.env`.

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

El `id` se genera automáticamente y no puede modificarse. `duration` está en minutos.

## Endpoints

| Método | Ruta                 | Descripción                         | Códigos  |
|--------|----------------------|-------------------------------------|----------|
| GET    | `/api/services`      | Lista los servicios (acepta filtros) | 200      |
| GET    | `/api/services/:sid` | Obtiene un servicio por id          | 200, 404 |
| POST   | `/api/services`      | Crea un servicio                    | 201, 400 |
| PUT    | `/api/services/:sid` | Actualiza un servicio               | 200, 404 |
| DELETE | `/api/services/:sid` | Elimina un servicio                 | 200, 404 |

### Filtros (query params)

- `?category=estética`: servicios de esa categoría.
- `?available=true`: servicios disponibles (`false` para los no disponibles).
- Se pueden combinar: `?category=estética&available=true`.

### Ejemplos

```bash
# Listar y filtrar
curl http://localhost:8080/api/services
curl "http://localhost:8080/api/services?category=estética&available=true"

# Obtener por id
curl http://localhost:8080/api/services/1

# Crear (id generado automáticamente)
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Depilación","description":"Depilación con cera","duration":20,"price":4000,"category":"estética","available":true}'

# Actualizar (el id del body se ignora)
curl -X PUT http://localhost:8080/api/services/1 \
  -H "Content-Type: application/json" \
  -d '{"price":5500}'

# Eliminar
curl -X DELETE http://localhost:8080/api/services/1
```

Si faltan campos en el POST, responde `400` con `{ "error": "Faltan campos requeridos: ..." }`. Si el id no existe, responde `404` con `{ "error": "No existe un servicio con id ..." }`.