import { Router } from "express";
import { crearVehiculo, listarVehiculos, validarQR } from "../controller/vehicle.controller";
import { cotizarViaje, crearViaje, obtenerViaje } from "../controller/trip.controller";
import { crearIncidente, listarIncidentes } from "../controller/incident.controller";
import { query } from "../db/pool";

const r = Router();

/** Health simple de la API */
r.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bicitaxi-seguro-api" });
});

/** Health de la BD Neon */
r.get("/db/health", async (_req, res, next) => {
  try {
    const { rows } = await query<{ now: string }>("SELECT now()");
    res.json({ ok: true, now: rows[0]?.now });
  } catch (error) {
    next(error);
  }
});

// Vehículos
r.post("/vehicles", crearVehiculo);
r.get("/vehicles", listarVehiculos);
r.get("/qr/:placa", validarQR);

// Viajes
r.post("/trips/quote", cotizarViaje);
r.post("/trips", crearViaje);
r.get("/trips/:id", obtenerViaje);

// Incidentes
r.post("/incidents", crearIncidente);
r.get("/incidents", listarIncidentes);

export default r;
