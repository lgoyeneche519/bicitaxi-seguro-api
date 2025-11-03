import { Request, Response } from "express";
import { db, id } from "../domain/store";
import { CrearIncidenteDTO, Incidente } from "../domain/models";

export const crearIncidente = (req: Request, res: Response) => {
  const dto = req.body as CrearIncidenteDTO;
  if (!dto?.tipo || !dto?.descripcion) {
    return res.status(400).json({ error: "tipo y descripcion son obligatorios" });
  }
  const inc: Incidente = {
    id: id(),
    viajeId: dto.viajeId,
    tipo: dto.tipo,
    descripcion: dto.descripcion,
    fotoUrl: dto.fotoUrl,
    ubicacion: dto.ubicacion,
    fecha: new Date().toISOString()
  };
  db.incidentes.push(inc);
  res.status(201).json(inc);
};

export const listarIncidentes = (_req: Request, res: Response) => {
  res.json(db.incidentes);
};
