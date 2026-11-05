# Plan de subida a la rama — **RESUELTO**

> Estado: la determinación está tomada y **ejecutada en local**. Falta solo autenticarse y
> pushear. Nada se subió todavía.
> Fecha: 2026-11-05 · Rama preparada: `dev/nicolaslopezv` en `b152106`

---

## 1. Repositorio identificado

`https://github.com/DunkandCode/ScanSayDone` — **público**, creado el 2026-10-23.

Es un **monorepo** con estructura fija, y su CI (`/.github/workflows/ci.yml`) la impone:

```
ScanSayDone/
├── scansaydone-front/   → el CI hace `npm ci` + `npm run build` AQUÍ
├── scansaydone-back/    → el CI hace `pip install` + `py_compile main.py`
└── docs/                → documentación del equipo
```

Por eso el frontend **no va en la raíz**: va dentro de `scansaydone-front/`.

## 2. Escenario determinado: **B** (historias independientes)

Evidencia, no suposición:

```
git merge-base --is-ancestor origin/main HEAD               → 1
git merge-base --is-ancestor origin/dev/nicolaslopezv HEAD  → 1
local HEAD 9001d59 · origin/main 433c2c8 · origin/dev/nicolaslopezv 03ce92b
```

Nuestra historia (162 commits desde el baseline de plantilla del 2026-10-27) y la del equipo
son **sin ancestro común**. Forzar habría reemplazado su historia.

## 3. Ejecutado en local (sin push)

1. `git remote add origin` + `git fetch origin` — solo lectura del repo público.
2. Rama `dev/nicolaslopezv` **rebasada al seed del equipo** (`03ce92b`).
3. Injerto en un worktree aislado: el árbol del proyecto se copió a `scansaydone-front/`.
4. Commit **`b152106`** — *"feat(frontend): importa la landing y el panel de Scan-Say-Done"*.

```
rama:   dev/nicolaslopezv  b152106  [ahead 1 de origin/dev/nicolaslopezv]
diff:   419 archivos · +33.345 / −1.994
```

El `master` local **no se tocó**: sigue en `9001d59` con todo el trabajo.

## 4. Hallazgo crítico: el scaffold del equipo

`scansaydone-front/` **ya existía** en el repo del equipo, con otra pila:

| | Scaffold del equipo | Nuestro proyecto |
|---|---|---|
| Next.js | **16.4.3** | **15.4.1** |
| Lenguaje | **TypeScript** | **JavaScript (JSX)** |
| Estilos | **Tailwind CSS 4** | **SCSS + Bootstrap 5** |

Al superponerlos, el build **se rompe**:

```
Type error: Cannot find module or type declarations for side-effect import of './globals.css'
```

Causa: el `tsconfig.json` del scaffold activa el chequeo de tipos sobre nuestro código JS, que
no declara tipos para los `.css`. En local no se veía porque ahí existía un `next-env.d.ts`
generado e ignorado por git — un clon limpio no lo tiene.

**Decisión tomada:** reemplazar el scaffold por la implementación real. Se verificó que el
scaffold solo contenía el boilerplate de `create-next-app` y el bloque autogenerado de
`AGENTS.md`: **no se perdió documentación del equipo**.

**Verificación:** copia limpia sin `node_modules` ni `tsconfig` → `npm ci` (321 paquetes) +
`npm run build` → **compila**.

## 5. Decisión que necesita al administrador

El `README.md` del monorepo declara *"Next.js 16 / TypeScript / Tailwind CSS"*. Nuestra
implementación es **Next 15 / JavaScript / SCSS**. Ambas cosas no pueden ser ciertas a la vez:

| Opción | Implicancia |
|---|---|
| **Aceptar la implementación actual** (recomendada) | Se actualiza el README y el scaffold se descarta. El frontend ya está construido y validado |
| **Migrar a TypeScript + Tailwind** | Reescritura completa de 13 rutas y ~5.000 líneas de SCSS. No es un ajuste, es otro proyecto |

No se puede "mezclar": eso es exactamente lo que rompió el build.

## 6. Lo que falta para terminar

Solo dos cosas, ambas del operador:

```bash
# 1. autenticarse
gh auth login -h github.com -p https -w

# 2. subir (un comando)
git push -u origin dev/nicolaslopezv
```

Después: Pull Request `dev/nicolaslopezv` → `main`, con el resumen de
`docs/ENTREGA-FRONTEND-2026-11-05.md`.

**Rollback:** `git branch -D dev/nicolaslopezv` + `git branch dev/nicolaslopezv origin/dev/nicolaslopezv`.
El trabajo no se pierde: vive en `master`.

## 7. Criterio de aceptación

- [ ] El PR **no** incluye cambios en `scansaydone-back/`
- [ ] El CI en verde: `frontend-build` compila desde `scansaydone-front/`
- [ ] El diff no borra `docs/` ni el `README.md` de la raíz
- [ ] El administrador aprueba la decisión de pila (§5) antes del merge
