export const PANEL_QUESTIONS = [
  { id: 'q1', label: '¿Cómo fue tu atención?' },
  { id: 'q2', label: '¿Volverías?' },
  { id: 'q3', label: '¿Qué mejorarías?' },
]

export const PANEL_CHANNELS = ['Todos', 'Mostrador', 'Instagram', 'WhatsApp', 'TikTok LIVE']

export const PANEL_DEMO_ROWS = [
  { when: '30-oct 09:12', iso: '2026-10-30T09:12', channel: 'Mostrador', answers: [5, 4, 4] },
  { when: '30-oct 08:47', iso: '2026-10-30T08:47', channel: 'WhatsApp', answers: [4, 4, 3] },
  { when: '29-oct 19:20', iso: '2026-10-29T19:20', channel: 'Instagram', answers: [5, 5, 5] },
  { when: '29-oct 17:05', iso: '2026-10-29T17:05', channel: 'Mostrador', answers: [2, 3, 1] },
  { when: '29-oct 12:33', iso: '2026-10-29T12:33', channel: 'TikTok LIVE', answers: [5, 5, 4] },
  { when: '28-oct 18:10', iso: '2026-10-28T18:10', channel: 'Instagram', answers: [4, 3, 2] },
  { when: '28-oct 15:52', iso: '2026-10-28T15:52', channel: 'Mostrador', answers: [5, 4, 4] },
  { when: '27-oct 11:24', iso: '2026-10-27T11:24', channel: 'WhatsApp', answers: [3, 4, 5] },
]

// Totales derivados de PANEL_DEMO_ROWS: 5 posiciones por pregunta, índice 0 = valor 1
export const PANEL_TOTALS = PANEL_QUESTIONS.map((_, qi) =>
  [1, 2, 3, 4, 5].map(
    (value) => PANEL_DEMO_ROWS.filter((row) => row.answers[qi] === value).length
  )
)

export const PANEL_TOTAL_RESPONSES = PANEL_DEMO_ROWS.length

export const PANEL_SCALE_LABELS = ['Muy mala', 'Mala', 'Regular', 'Buena', 'Muy buena']
