import { Request, Response } from "express";
import { db, id } from "../domain/store";
import { CrearVehiculoDTO, Vehiculo } from "../domain/models";
import { isIsoDate } from "../utils/validation";

export const crearVehiculo = (req: Request, res: Response) => {
  const dto = req.body as CrearVehiculoDTO;
  if (!dto?.placa || !dto?.modelo || !dto?.revisionVence || !isIsoDate(dto.revisionVence)) {
    return res.status(400).json({ error: "Datos inválidos: placa, modelo, revisionVence(ISO)" });
  }
  const v: Vehiculo = {
    id: id(),
    placa: dto.placa.toUpperCase(),
    modelo: dto.modelo,
    revisionVence: new Date(dto.revisionVence).toISOString(),
    activo: true
  };
  db.vehiculos.push(v);
  res.status(201).json(v);
};

export const listarVehiculos = (_req: Request, res: Response) => {
  res.json(db.vehiculos);
};

// Simula lectura de QR: devuelve estado de revisión
export const validarQR = (req: Request, res: Response) => {
  const { placa } = req.params;
  const vehiculo = db.vehiculos.find(v => v.placa === placa?.toUpperCase());
  if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });

  const hoy = new Date();
  const vence = new Date(vehiculo.revisionVence);
  const dias = Math.ceil((vence.getTime() - hoy.getTime()) / (1000*60*60*24));
  const estado = dias < 0 ? "VENCIDA" : (dias <= 7 ? "POR_VENCER" : "VIGENTE");

  res.json({
    placa: vehiculo.placa,
    revisionVence: vehiculo.revisionVence,
    estado,
    diasRestantes: dias
  });
};
