export type Punto = { lat: number; lon: number };

export type Vehiculo = {
  id: string;
  placa: string;
  modelo: string;
  revisionVence: string;
  activo: boolean;
};

export type Conductor = {
  id: string;
  nombre: string;
  disponible: boolean;
};

export type EstadoViaje = "Solicitado" | "Asignado" | "EnCurso" | "Finalizado" | "Cancelado";

export type Viaje = {
  id: string;
  pasajeroId: string;
  origen: Punto;
  destino: Punto;
  etaMin: number;
  precio: number;
  vehiculoId?: string;
  conductorId?: string;
  estado: EstadoViaje;
  createdAt: string;
};

export type Incidente = {
  id: string;
  viajeId?: string;
  tipo: string;
  descripcion: string;
  fotoUrl?: string;
  ubicacion?: Punto;
  fecha: string; // ISO
};

// DTOs
export type CrearVehiculoDTO = Pick<Vehiculo, "placa" | "modelo" | "revisionVence">;
export type CotizarViajeDTO = { origen: Punto; destino: Punto; distanciaKm: number; duracionMin: number };
export type CrearViajeDTO = CotizarViajeDTO & { pasajeroId: string };
export type CrearIncidenteDTO = Pick<Incidente, "tipo" | "descripcion"> & { viajeId?: string; ubicacion?: Punto; fotoUrl?: string };
