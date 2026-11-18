# Gestión de servidores dev/prueba — ScanSayDone front

> Fecha: 2026-11-07 · Ámbito: `scansaydone-front/` · Scripts: `scansaydone-front/scripts/dev-servers.ps1` (PowerShell 5.1, sin dependencias nuevas)

## Problema que resuelve

Corridas de agentes anteriores lanzaban servidores en puertos aleatorios (3190–3203) con `next start`/`npm run dev` y no los cerraban. Resultado: procesos `node` colgados consumiendo memoria, URLs de prueba distintas en cada corrida y riesgo de testear contra el servidor equivocado.

## Comandos

| Comando | Qué hace | Puerto |
|---|---|---|
| `npm run dev` | Servidor manual de desarrollo, en TU terminal. Mientras lo uses es tuyo; los comandos de abajo no lo detienen sin tu confirmación. | `localhost:3000` |
| `npm run servers:list` | **Solo lectura.** Lista procesos de este proyecto: puerto de escucha, URL, PID raíz, PIDs del árbol, estado (`escuchando` / `fila TCP sin State (ocupacion viva; listener no confirmado)` / `SIN listener (posible colgado)`) y comando. También avisa si 3000/3120 están ocupados por un proceso ajeno (incluye ocupantes con fila TCP sin State: nunca se declaran libres). | — |
| `npm run servers:stop` | Detiene **solo** árboles verificados de este proyecto. Muestra la lista y pide confirmación **por árbol** antes de matar. Variantes: `npm run servers:stop -- -WhatIf` (simulación, no mata nada; **prevalece sobre `-Yes`**) y `npm run servers:stop -- -Confirm:$false` (sin preguntas, para scripts). Exit `0` solo si no queda ningún verificado vivo; `1` si queda alguno (taskkill fallido o confirmación cancelada). | — |
| `npm run test:a11y` | 1) `next build` (hook `pretest:a11y`), 2) Playwright levanta **un único** servidor de producción en `127.0.0.1:3120`, 3) corre los proyectos `a11y-desktop` y `a11y-mobile` contra ese mismo `baseURL`, 4) Playwright apaga el servidor (árbol completo de procesos) al terminar. | `127.0.0.1:3120` fijo |

## `dev-saydone.bat` (envoltorio CMD de usuario)

Doble clic → menú interactivo (`start`, `list`, `stop`, `test`, salir; cada opción salta a su etiqueta — nunca se encadena `cmd & cmd` tras un `if errorlevel`, que ejecutaría la segunda parte incondicionalmente). También admite verbos desde terminal: `dev-saydone.bat start [puerto] | list | stop | stop-whatif | test`.

- `start [puerto]` (default `3000`): **validación de puerto inyección-segura** (el valor se valida desde la variable de entorno con un comando PowerShell estático; nunca se interpola en una cláusula CMD — `3000&<comando>` se rechaza como texto inerte) y **preflight del puerto** con `-Action CheckPort`. Si está ocupado, imprime el dueño exacto (PID, imagen, línea de comando, verificado/ajeno) y **se niega a arrancar** (exit 1) — así Next nunca deriva en silencio a 3001+. Si está libre, arranca `npm run dev -- --hostname 127.0.0.1 --port <puerto>` en primer plano (Ctrl+C para detener).
- `list`: idéntico a `npm run servers:list` (solo lectura).
- `stop`: idéntico a `npm run servers:stop` (confirmación por árbol). **Sin passthrough de argumentos**: concatenar tokens arbitrarios tras `-Action Stop` permitía inyección en la línea del manager (`stop "& <cmd>"`); cualquier argumento extra se rechaza con exit 2.
- `stop-whatif`: verbo dedicado de simulación (`-WhatIf`); muestra qué se detendría sin tocar nada. En el manager `-WhatIf` **siempre prevalece sobre `-Yes`** (`-Yes -WhatIf` = dry-run puro). Para `-Yes`/`-Confirm:$false` (scripts/CI) se usa el manager PowerShell directamente.
- `test`: preflight del 3120 y luego `npm run test:a11y` (servidor gestionado por Playwright; si 3120 está ocupado, avisa y aborta antes de quemar un build).
- La seguridad es la del manager: solo árboles verificados por ruta, confirmación por árbol, jamás kill por nombre de imagen ni de PIDs no verificados.

Acción nueva del manager (solo lectura): `-Action CheckPort -Port <p>` → exit `0` libre / `1` ocupado (imprime dueño exacto si es identificable) / `2` no verificable. Es la que usa el BAT para sus preflights. El veredicto lo da una **sonda de bind exclusivo** en `127.0.0.1`: conservador por diseño, cualquier socket que retenga el puerto — incluida una fila transitoria `TIME_WAIT` (dueño PID 0) — cuenta como ocupado (ver «Puerto 3120 ocupado»).

## Cómo se prueba que un proceso es de este proyecto (seguridad)

1. El script toma la raíz del proyecto como la carpeta padre de `scripts/` y la normaliza (minúsculas, barras invertidas).
2. Un proceso queda **verificado** solo si su línea de comando contiene esa ruta (ej. `E:\Trabajos\ScanSayDone\scansaydone-front\node_modules\...`) **terminando en límite de ruta real**: barra invertida, comilla o fin de línea. Un espacio solo cuenta como límite si lo que sigue es una **bandera** (`-x`, `--x`, `/x`) o el fin de línea (cubre `... <raíz> --port 3000`). Hermanos de nombre prefijo quedan fuera: `...\scansaydone-front-v2\...` (guión tras la raíz) NO, y `...\scansaydone-front - copia\...` (espacio + «- copia», que no es bandera) TAMPOCO. Separadores `/` y `\` y mayúsculas no importan.
3. Los árboles se forman **solo con enlaces padre↔hijo entre procesos verificados**: ambos extremos del enlace deben estar verificados por ruta. Un proceso verificado cuyo padre no existe o no está verificado es **raíz** de su propio árbol (los huérfanos quedan como árboles de un solo PID). El manager **no asciende** a través de wrappers npm/npx (`npm-cli.js` / `npx-cli.js`) ni hasta tu shell: los wrappers npm/npx cuya línea de comando **no** referencia la raíz del proyecto se listan aparte como informativos (sección «Posibles wrappers npm/npx huérfanos») y **nunca** se detienen. Sí baja a los hijos verificados (ej. worker de Turbopack); los hijos vivos no verificados solo se ven afectados indirectamente, por el `taskkill /T` de la raíz (solapes del punto 4).
4. `Stop` solo actúa sobre árboles con ≥1 PID verificado, tras confirmación (`ShouldProcess`). **`-WhatIf` siempre prevalece sobre `-Yes`** (`-Yes -WhatIf` = dry-run puro, no se ejecuta ningún `taskkill`). El kill es `taskkill /PID <raíz> /T /F`: árbol completo de ese PID únicamente. Raíces ya muertas por solape (eliminadas al detener otro árbol que las cubría vía wrappers) se saltan con aviso y sin error, y la verificación post-stop **nunca** reporta éxito si queda un verificado vivo: exit `1` (el escaneo post-stop excluye el wrapper que invocó el propio comando, que sigue vivo por definición; no es un servidor residual).

**Nunca** hace: matar por nombre de imagen (`Stop-Process -Name node`, `taskkill /IM node.exe`), detener PIDs no verificados, ni limpiar "todos los node" de la máquina (mataría los 8+ servidores MCP del ecosistema y otros procesos ajenos). Si un proceso no se puede atar a este proyecto, se muestra como `NO VERIFICADO` con PID/comando/puerto y **no se toca**.

## Puerto 3120 ocupado / test falla al arrancar

`webServer.reuseExistingServer: false`: si 3120 está ocupado (por un proceso de este proyecto o ajeno), `npm run test:a11y` falla al arrancar el servidor — no prueba en silencio contra otro servidor ni deriva a otro puerto.

Diagnóstico:

1. `npm run servers:list` → revisa los bloques «Puertos vigilados». Muestra PID, nombre de imagen y comando del ocupante.
2. Si el ocupante **es de este proyecto** (aparece también en la tabla de árboles verificados): `npm run servers:stop`, confirma el árbol correspondiente, reintenta el test.
3. Si es **ajeno** (otro proyecto, MCP, etc.): ciérralo manualmente en su terminal/proceso dueño. El script no lo mata.
4. Si el dueño es **PID 0** o «no identificable»: puede ser una fila **TIME_WAIT** residual (conexión cerrada que Windows retiene un tiempo). El preflight (`CheckPort`, sonda de bind exclusivo) es conservador: ese caso se reporta como ocupado aunque sea un **falso ocupado transitorio** — `servers:list` ni siquiera lo muestra (las filas TIME_WAIT/PID 0 se excluyen del listado). Remedio: **espera un par de minutos y vuelve a comprobar** (`npm run servers:list`, o reintenta `dev-saydone.bat start` / `test`, que re-ejecutan el preflight). **Jamás** intentes detener el PID 0 o un PID desconocido: PID 0 es del sistema (no es un proceso real) y un PID no verificado puede pertenecer a otro proyecto o a los MCP del ecosistema.

## Dev manual (`npm run dev`) vs servidor de Playwright

| | `npm run dev` | Servidor de `npm run test:a11y` |
|---|---|---|
| Quién lo controla | Tú (tu terminal) | Playwright (`webServer`) |
| Puerto | 3000 (por defecto de Next) | `127.0.0.1:3120` fijo |
| Modo | Desarrollo (Turbopack, HMR) | Producción (`next build` + `next start`) |
| Apagado | Tú (Ctrl+C) | Automático al terminar los tests |
| baseURL de tests | No se usa para a11y | `http://127.0.0.1:3120` (único, desktop y móvil) |

Por qué producción y no `dev` para a11y: el servidor de desarrollo mantiene un websocket de HMR que hace poco fiable `waitForLoadState('networkidle')` (usado por los specs); `next start` no lo tiene.

## Cambios de configuración relevantes

- `playwright.config.ts`: añadido `webServer` con `reuseExistingServer: false`; `baseURL` fijo en `http://127.0.0.1:3120`.
- **Eliminado el override `A11Y_BASE_URL`**: con servidor gestionado, `baseURL` y `webServer.url` deben coincidir exactamente; un override externo rompería ese par y volvería el problema de probar contra el servidor equivocado. Cualquier script que exportaba `A11Y_BASE_URL=...` debe quitarse; no hace falta reemplazo.
- `package.json`: hooks `pretest:a11y` (build) + `servers:list` / `servers:stop`.
- Specs a11y (`entrar-verify.spec.ts`, `panel-verify.spec.ts`): eliminados los restos de `A11Y_BASE_URL` y los fallbacks por archivo (`localhost:3155`, `localhost:3170`); ahora usan `page.goto('/entrar')` / `page.goto('/panel')` relativos al `baseURL` fijo del config (mismo patrón que `landing.spec.ts`). Un solo servidor, una sola URL; ninguna variable de entorno puede desviar los tests.
- `dev-saydone.bat`: envoltorio CMD (menú + verbos) sobre el manager; usa `-Action CheckPort` para el preflight de `start`/`test`.
