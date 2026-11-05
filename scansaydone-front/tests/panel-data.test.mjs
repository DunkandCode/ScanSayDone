// Guardas de regresión sobre los datos del panel demo y la config del sitio.
// Runner nativo de Node (sin dependencias): npm test → node --test tests/
import test from 'node:test'
import assert from 'node:assert/strict'

import { SITE, hasPricing } from '../src/app/data/site.js'
import {
  PANEL_QUESTIONS,
  PANEL_DEMO_ROWS,
  PANEL_TOTALS,
  PANEL_TOTAL_RESPONSES,
} from '../src/app/data/panel-demo.js'

test('la sección de precios no se publica: hasPricing() es booleano y coherente con el flag showPricing', () => {
  assert.equal(typeof hasPricing(), 'boolean', 'hasPricing() debe devolver un booleano')

  // Invariante: con el flag desactivado la sección no se publica,
  // aunque alguien rellene SITE.plans sin activar el flag.
  if (SITE.features.showPricing === false) {
    assert.equal(hasPricing(), false, 'showPricing=false implica hasPricing()=false')
  }

  // Comportamiento actual del repo (showPricing=false, plans vacío): false.
  // Si falla en el futuro es que se activaron los precios: actualizar a conciencia.
  assert.equal(hasPricing(), false)

  // Camino positivo: con flag activado y 3 planes con precio debe publicar.
  // Mutación controlada y restauración: evita que la conjunción se degenere
  // a un "return false" constante que pasaría el test vacío.
  const showPricingOriginal = SITE.features.showPricing
  const plansOriginal = SITE.plans
  try {
    SITE.features.showPricing = true
    SITE.plans = [
      { price: '0' }, { price: '10' }, { price: '25' },
    ]
    assert.equal(hasPricing(), true, 'flag on + 3 planes con precio → true')

    SITE.plans = [{ price: '0' }, { price: '10' }] // solo 2 planes
    assert.equal(hasPricing(), false, 'flag on + 2 planes → false (sección incompleta)')

    SITE.plans = [{ price: '0' }, { price: '10' }, { price: '  ' }] // precio vacío
    assert.equal(hasPricing(), false, 'flag on + plan sin precio → false')
  } finally {
    SITE.features.showPricing = showPricingOriginal
    SITE.plans = plansOriginal
  }
})

test('el total de respuestas del panel es exactamente el número de filas del demo', () => {
  // Guarda del defecto G5: totales y filas ya no son el mismo dato escrito dos veces.
  assert.equal(PANEL_TOTAL_RESPONSES, PANEL_DEMO_ROWS.length)
})

test('los totales por pregunta cuadran con las filas del demo', () => {
  PANEL_QUESTIONS.forEach((pregunta, qi) => {
    // Distribución esperada derivada de las filas en tiempo de test,
    // no copiada de PANEL_TOTALS (evita duplicar el dato que se está guardando).
    const esperada = [1, 2, 3, 4, 5].map(
      (valor) => PANEL_DEMO_ROWS.filter((fila) => fila.answers[qi] === valor).length
    )

    assert.deepEqual(
      PANEL_TOTALS[qi],
      esperada,
      `la distribución de "${pregunta.label}" no cuadra con las filas`
    )

    // Cada fila debe contarse exactamente una vez: si una respuesta cae fuera
    // de la escala 1-5, la distribución deja de sumar el total.
    const suma = esperada.reduce((a, b) => a + b, 0)
    assert.equal(
      suma,
      PANEL_TOTAL_RESPONSES,
      `la distribución de "${pregunta.label}" suma ${suma}, no el total de respuestas`
    )
  })
})
