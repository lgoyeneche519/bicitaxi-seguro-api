import { Request, Response, NextFunction } from "express";
import { CrearVehiculoDTO, Vehiculo } from "../domain/models";
import { isIsoDate } from "../utils/validation";
import { query } from "../db/pool";

// Función para mapear fila de BD -> modelo Vehiculo (camelCase)
function mapVehiculoRow(row: any): Vehiculo {
  return {
    id: String(row.id),
    placa: row.placa,
    modelo: row.modelo,
    revisionVence: row.revision_vence
      ? new Date(row.revision_vence).toISOString()
      : null,
    activo: row.activo,
  } as Vehiculo;
}

// POST /api/v1/vehicles
export const crearVehiculo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as CrearVehiculoDTO;

    if (
      !dto?.placa ||
      !dto?.modelo ||
      !dto?.revisionVence ||
      !isIsoDate(dto.revisionVence)
    ) {
      return res
        .status(400)
        .json({
          error: "Datos inválidos: placa, modelo, revisionVence(ISO yyyy-mm-dd)",
        });
    }

    const placa = dto.placa.toUpperCase();
    const revisionDate = new Date(dto.revisionVence);

    const { rows } = await query<any>(
      `INSERT INTO bicitaxi.vehicles (placa, modelo, revision_vence, activo)
       VALUES ($1, $2, $3, TRUE)
       RETURNING id, placa, modelo, revision_vence, activo, created_at, qr_code`,
      [placa, dto.modelo, revisionDate]
    );

    const vehiculo = mapVehiculoRow(rows[0]);
    return res.status(201).json(vehiculo);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/vehicles
export const listarVehiculos = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rows } = await query<any>(
      `SELECT id, placa, modelo, revision_vence, activo, created_at, qr_code
       FROM bicitaxi.vehicles
       ORDER BY id DESC`
    );

    const vehiculos = rows.map(mapVehiculoRow);
    res.json(vehiculos);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/qr/:placa
export const validarQR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { placa } = req.params;

    const { rows } = await query<any>(
      `SELECT id, placa, modelo, revision_vence, activo
       FROM bicitaxi.vehicles
       WHERE placa = $1`,
      [placa.toUpperCase()]
    );

    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    const hoy = new Date();
    const vence = new Date(row.revision_vence);
    const dias = Math.ceil(
      (vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );
    const estado = dias < 0 ? "VENCIDA" : dias <= 7 ? "POR_VENCER" : "VIGENTE";

    return res.json({
      placa: row.placa,
      revisionVence: vence.toISOString(),
      estado,
      diasRestantes: dias,
    });
  } catch (error) {
    next(error);
  }
};
