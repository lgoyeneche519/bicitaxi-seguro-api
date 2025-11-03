export function calcularTarifa(distanciaKm: number, duracionMin: number) {
  const base = 2000;
  const k1 = 800;   // por km
  const k2 = 120;   // por min
  const minimo = 4000;
  const tope = 30000;

  let precio = base + (distanciaKm * k1) + (duracionMin * k2);
  if (precio < minimo) precio = minimo;
  if (precio > tope) precio = tope;

  // Redondeo al múltiplo de 50 más cercano
  precio = Math.round(precio / 50) * 50;
  return { precio, etaMin: Math.max(3, Math.round(duracionMin)) };
}
