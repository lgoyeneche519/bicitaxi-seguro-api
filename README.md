# Bicitaxi Seguro – API (Node.js + TypeScript + Express)

API base para el proyecto Bicitaxi Seguro con Node.js, TypeScript y Express.

## Requisitos
- Node.js v20 (usa `nvm use` si tienes `.nvmrc`)
- npm o pnpm

## Instalación y ejecución
```bash
npm install
npm run build
npm run start
# o: npm run dev (si usas ts-node-dev / nodemon)

    # o: npm run dev (si usas ts-node-dev / nodemon)


## Inventario de Endpoints

| Método | Ruta | Params | Body (req) | Respuesta (ej.) | Descripción | Seguridad |
|---|---|---|---|---|---|---|
| GET | `/health` | – | – | `200 { "status":"ok" }` | Liveness probe | No |
| POST | `/api/v1/vehicles` | – | `{ placa, modelo, revisionVence }` | `201 { id, placa, modelo, revisionVence }` <br> `400 { error }` | Registrar vehículo (RAM) | No |
| GET | `/api/v1/vehicles` | `page?` | – | `200 [ { id, placa, modelo, revisionVence } ]` | Listar vehículos | No |
| GET | `/api/v1/vehicles/:placa/qr` | `placa` | – | `200 { placa, vigente }` <br> `404 { error }` | Validar QR / revisión de vehículo | No |
| POST | `/api/v1/trips/quote` | – | `{ origen:{lat,lon}, destino:{lat,lon}, distanciaKm, duracionMin }` | `200 { precio, etaMin, desglose:{ base, km, min } }` <br> `400 { error }` | Cotizar viaje (sin crear) | No |
| POST | `/api/v1/trips` | – | `{ pasajeroId, origen, destino, distanciaKm, duracionMin }` | `201 { id, estado:"CREADA", ... }` <br> `409 { code:"SIN_CONDUCTOR", error }` | Crear viaje (asigna conductor si hay) | No |
| POST | `/api/v1/incidents` | – | `{ tipo:"ACCIDENTE\|ROBO", descripcion?, viajeId }` | `201 { id, tipo, viajeId, fecha }` <br> `404 { error }` | Reportar incidente | Sí/No |
| GET | `/api/v1/incidents` | `viajeId?` | – | `200 [ { id, tipo, viajeId, fecha } ]` | Consultar incidentes | No |


## Colección de Postman

```markdown
[![Run in Postman](https://run.pstmn.io/button.svg)](https://raw.githubusercontent.com/lgoyeneche519/bicitaxi-seguro-api/dev/docs/postman/BicitaxiSeguro.postman_collection.json)

- Archivo: `./docs/postman/BicitaxiSeguro.postman_collection.json`
- Importar con URL (Postman → Import → Link → pegar URL):


# 1) Health
curl -i http://localhost:3001/health

# 2) Registrar vehículo
curl -i -X POST http://localhost:3001/api/v1/vehicles \
  -H "Content-Type: application/json" \
  -d '{ "placa":"ABC123", "modelo":"Bicitaxi 2024", "revisionVence":"2025-12-31" }'

# 3) Listar vehículos
curl -i "http://localhost:3001/api/v1/vehicles?page=1"

# 4) Validar QR/revisión de vehículo
curl -i http://localhost:3001/api/v1/vehicles/ABC123/qr

# 5) Cotizar viaje
curl -i -X POST http://localhost:3001/api/v1/trips/quote \
  -H "Content-Type: application/json" \
  -d '{ "origen":{"lat":4.65,"lon":-74.1}, "destino":{"lat":4.67,"lon":-74.05}, "distanciaKm":3.2, "duracionMin":12 }'

# 6) Crear viaje (puede 201 o 409 SIN_CONDUCTOR)
curl -i -X POST http://localhost:3001/api/v1/trips \
  -H "Content-Type: application/json" \
  -d '{ "pasajeroId":"USER001", "origen":{"lat":4.65,"lon":-74.1}, "destino":{"lat":4.67,"lon":-74.05}, "distanciaKm":3.2, "duracionMin":12 }'

# 7) Reportar incidente
curl -i -X POST http://localhost:3001/api/v1/incidents \
  -H "Content-Type: application/json" \
  -d '{ "tipo":"ACCIDENTE", "descripcion":"caída menor", "viajeId":"TRIP001" }'

# 8) Consultar incidentes
curl -i "http://localhost:3001/api/v1/incidents?viajeId=TRIP001"


✅ GET /health

✅ POST /api/v1/vehicles

✅ GET /api/v1/vehicles

✅ GET /api/v1/vehicles/:placa/qr

✅ POST /api/v1/trips/quote

✅/⚠️ POST /api/v1/trips (201 si hay conductor; 409 SIN_CONDUCTOR si no)

✅ POST /api/v1/incidents

✅ GET /api/v1/incidents

📝 Endpoints extra


# Asegura main limpio
git checkout main
git pull

# Trabajar una HU
git checkout -b feature/hu-trips-assign-driver
# ... cambios ...
npm run verify
git add .
git commit -m "feat(trips): asignación de conductor y manejo de 409"
git push -u origin feature/hu-trips-assign-driver

# PR: feature -> dev (revisión)
# Tras validar en dev:
# PR: dev -> main
