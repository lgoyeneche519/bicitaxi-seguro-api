import { Router } from "express";
import { crearVehiculo, listarVehiculos, validarQR } from "../controller/vehicle.controller";
import { cotizarViaje, crearViaje, obtenerViaje } from "../controller/trip.controller";
import { crearIncidente, listarIncidentes } from "../controller/incident.controller";

const r = Router();

// Salud
r.get("/health", (_req, res) => res.json({ ok: true, service: "bicitaxi-seguro-api" }));

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
