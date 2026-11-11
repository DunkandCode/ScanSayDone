import { defineConfig } from '@playwright/test';

// URL fija del servidor de pruebas a11y. Debe coincidir EXACTAMENTE con
// webServer.url: con reuseExistingServer=false, si el puerto 3120 ya esta
// ocupado (por cualquier proceso), Playwright falla al arrancar en lugar de
// reusar/derivarse a otro servidor. Los proyectos desktop y mobile comparten
// este mismo baseURL, asi que nunca se generan URLs publicas distintas.
const A11Y_BASE_URL = 'http://127.0.0.1:3120';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: A11Y_BASE_URL,
    trace: 'off',
  },
  // Playwright gestiona el ciclo de vida: levanta UN servidor de produccion
  // (requiere `next build` previo — lo hace el hook pretest:a11y), espera a que
  // responda la URL y lo apaga (arbol de procesos completo) al terminar.
  webServer: {
    command: 'npx next start -p 3120 -H 127.0.0.1',
    url: A11Y_BASE_URL,
    timeout: 120_000,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'a11y-desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'a11y-mobile',
      use: { viewport: { width: 375, height: 812 } },
    },
  ],
});
