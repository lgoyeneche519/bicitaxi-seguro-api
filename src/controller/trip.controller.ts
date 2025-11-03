import { Request, Response } from "express";
import { db, id } from "../domain/store";
import { CotizarViajeDTO, CrearViajeDTO, Viaje } from "../domain/models";
import { isPoint } from "../utils/validation";
import { calcularTarifa } from "../services/pricing.service";

export const cotizarViaje = (req: Request, res: Response) => {
  const dto = req.body as CotizarViajeDTO;
  if (!isPoint(dto?.origen) || !isPoint(dto?.destino) || typeof dto?.distanciaKm !== "number" || typeof dto?.duracionMin !== "number") {
    return res.status(400).json({ error: "Datos inválidos para cotización" });
  }
  // TODO: validar geocercas (placeholder)
  const { precio, etaMin } = calcularTarifa(dto.distanciaKm, dto.duracionMin);
  res.json({ precio, etaMin });
};

export const crearViaje = (req: Request, res: Response) => {
  const dto = req.body as CrearViajeDTO;
  if (!dto?.pasajeroId || !isPoint(dto?.origen) || !isPoint(dto?.destino) || typeof dto?.distanciaKm !== "number" || typeof dto?.duracionMin !== "number") {
    return res.status(400).json({ error: "Datos inválidos para crear viaje" });
  }
  // TODO: geocercas; si cruza zona prohibida -> 400 con código "ZONA_RESTRINGIDA"
  const { precio, etaMin } = calcularTarifa(dto.distanciaKm, dto.duracionMin);

  // Matching simple: primer conductor disponible
  const conductor = db.conductores.find(c => c.disponible);
  if (!conductor) return res.status(409).json({ error: "No hay conductores disponibles", code: "SIN_CONDUCTOR" });

  const viaje: Viaje = {
    id: id(),
    pasajeroId: dto.pasajeroId,
    origen: dto.origen,
    destino: dto.destino,
    etaMin,
    precio,
    conductorId: conductor.id,
    estado: "Asignado",
    createdAt: new Date().toISOString()
  };
  db.viajes.push(viaje);
  // marcar no disponible al conductor asignado (simulación)
  conductor.disponible = false;

  res.status(201).json(viaje);
};

export const obtenerViaje = (req: Request, res: Response) => {
  const { id } = req.params;
  const v = db.viajes.find(x => x.id === id);
  if (!v) return res.status(404).json({ error: "Viaje no encontrado" });
  res.json(v);
};
