import { Vehiculo, Conductor, Viaje, Incidente } from "./models";

export const db = {
  vehiculos: [] as Vehiculo[],
  conductores: [
    { id: "c1", nombre: "Ana", disponible: true },
    { id: "c2", nombre: "Luis", disponible: false }
  ] as Conductor[],
  viajes: [] as Viaje[],
  incidentes: [] as Incidente[],
};

export const id = () => Math.random().toString(36).slice(2);
