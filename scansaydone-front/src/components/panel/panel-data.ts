/**
 * Dataset canónico del panel de ejemplo.
 * Origen: PANEL-2026-11-06.md §3 — conteos ficticios autoconsistentes.
 * Σn=486, Σpuntos=4131, media=8,5 exacta, 377 en 8-10.
 * No proviene de ningún negocio real.
 */

// ── Distribución por nota (0-10) ────────────────────────────────────────────
export const distribution = [
  { nota: 0, count: 1 },
  { nota: 1, count: 1 },
  { nota: 2, count: 2 },
  { nota: 3, count: 2 },
  { nota: 4, count: 4 },
  { nota: 5, count: 6 },
  { nota: 6, count: 20 },
  { nota: 7, count: 73 },
  { nota: 8, count: 100 },
  { nota: 9, count: 127 },
  { nota: 10, count: 150 },
] as const;

// ── Canales ─────────────────────────────────────────────────────────────────
export const channels = [
  { name: "QR en la mesa", count: 210, points: 1806 },
  { name: "Enlace de Instagram", count: 112, points: 941 },
  { name: "Google Maps", count: 89, points: 730 },
  { name: "WhatsApp", count: 55, points: 482 },
  { name: "Enlace directo", count: 20, points: 172 },
] as const;

// ── Serie de 30 días ────────────────────────────────────────────────────────
export const dailySeries = [
  { day: 1, reviews: 11, points: 92, mean: 8.4 },
  { day: 2, reviews: 10, points: 81, mean: 8.1 },
  { day: 3, reviews: 13, points: 115, mean: 8.8 },
  { day: 4, reviews: 15, points: 128, mean: 8.5 },
  { day: 5, reviews: 24, points: 206, mean: 8.6 },
  { day: 6, reviews: 27, points: 221, mean: 8.2 },
  { day: 7, reviews: 17, points: 152, mean: 8.9 },
  { day: 8, reviews: 11, points: 86, mean: 7.8 },
  { day: 9, reviews: 10, points: 84, mean: 8.4 },
  { day: 10, reviews: 13, points: 107, mean: 8.2 },
  { day: 11, reviews: 15, points: 132, mean: 8.8 },
  { day: 12, reviews: 24, points: 199, mean: 8.3 },
  { day: 13, reviews: 27, points: 238, mean: 8.8 },
  { day: 14, reviews: 17, points: 148, mean: 8.7 },
  { day: 15, reviews: 11, points: 97, mean: 8.8 },
  { day: 16, reviews: 10, points: 88, mean: 8.8 },
  { day: 17, reviews: 13, points: 113, mean: 8.7 },
  { day: 18, reviews: 15, points: 124, mean: 8.3 },
  { day: 19, reviews: 24, points: 209, mean: 8.7 },
  { day: 20, reviews: 27, points: 232, mean: 8.6 },
  { day: 21, reviews: 17, points: 133, mean: 7.8 },
  { day: 22, reviews: 11, points: 90, mean: 8.2 },
  { day: 23, reviews: 10, points: 89, mean: 8.9 },
  { day: 24, reviews: 13, points: 104, mean: 8.0 },
  { day: 25, reviews: 15, points: 121, mean: 8.1 },
  { day: 26, reviews: 24, points: 202, mean: 8.4 },
  { day: 27, reviews: 27, points: 233, mean: 8.6 },
  { day: 28, reviews: 17, points: 155, mean: 9.1 },
  { day: 29, reviews: 9, points: 77, mean: 8.6 },
  { day: 30, reviews: 9, points: 75, mean: 8.3 },
] as const;

// ── Últimas respuestas (muestra) ────────────────────────────────────────────
// D4: ≤72 chars, ≤12 words, sin nombres/mesas/cifras, ≥2 crítica, 1 sin texto.
// Antigüedades fijas: 9, 6, 5, 4, 2 días.
export const lastResponses: ReadonlyArray<{
  rating: number;
  quote: string | null;
  channel: string;
  day: number;
  daysAgo: number;
}> = [
  {
    rating: 10,
    quote: "La paella estaba buena, aunque el servicio fue algo lento.",
    channel: "QR en la mesa",
    day: 28,
    daysAgo: 9,
  },
  {
    rating: 9,
    quote: "Volveremos seguro, el trato fue agradable.",
    channel: "QR en la mesa",
    day: 21,
    daysAgo: 6,
  },
  {
    rating: 8,
    quote: "Buen arroz, pero llegó algo frío.",
    channel: "Google Maps",
    day: 26,
    daysAgo: 5,
  },
  {
    rating: 9,
    quote: null,
    channel: "Enlace de Instagram",
    day: 25,
    daysAgo: 4,
  },
  {
    rating: 7,
    quote: "La comida bien, pero la espera fue larga.",
    channel: "WhatsApp",
    day: 24,
    daysAgo: 2,
  },
];

// ── Derivados ───────────────────────────────────────────────────────────────
export const totalReviews = distribution.reduce((sum, d) => sum + d.count, 0); // 486
export const totalPoints = distribution.reduce(
  (sum, d) => sum + d.nota * d.count,
  0
); // 4131
export const meanRating = totalPoints / totalReviews; // 8.5
export const highRatings = distribution
  .filter((d) => d.nota >= 8)
  .reduce((sum, d) => sum + d.count, 0); // 377
export const highPercentage = (highRatings / totalReviews) * 100; // 77.57%
export const maxCount = 150; // escala máxima para barras
