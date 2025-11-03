export const isIsoDate = (s: string) => !Number.isNaN(Date.parse(s));
export const isPoint = (p: any) =>
  p && typeof p.lat === "number" && typeof p.lon === "number" &&
  p.lat >= -90 && p.lat <= 90 && p.lon >= -180 && p.lon <= 180;
