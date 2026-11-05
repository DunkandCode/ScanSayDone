# Publicar un avance en tu rama

Procedimiento para dejar el trabajo en tu rama personal **sin tocar `main` ni la rama de nadie
más**. Los cambios llegan a `main` solo por Pull Request.

---

## 0. Antes de empezar: ¿está conectado el remoto?

```bash
git remote -v
git branch --show-current
```

Debe aparecer `origin` y tu rama `dev/<tu-usuario>`.

**Si `git remote -v` no devuelve nada** (estado de este checkout al 2026-11-05), el repositorio
local no está conectado y nada de lo de abajo puede ejecutarse todavía. Ver §5.

---

## 1. Cambiarse a tu rama

```bash
git fetch origin
git checkout dev/<tu-usuario>
```

Si la rama no existe en local pero sí en el remoto:

```bash
git switch -c dev/<tu-usuario> --track origin/dev/<tu-usuario>
```

---

## 2. Verificar que todo pasa

No se sube un avance con la validación en rojo:

```bash
npm run build
npm run lint          # 0 errores (los warnings de label-has-associated-control son conocidos)
npm test              # 3/3
npm run check:tokens
npm run check:placeholders
```

Opcional, si tocaste pantallas: abrir `npm start` y comprobar las rutas afectadas a 1440 y 375.

---

## 3. Revisar qué vas a subir

```bash
git status --short
git diff --stat
```

Reglas:

- **Un commit por tema**, no uno gigante con todo mezclado.
- **Nunca `git add -A`** sin haber mirado `git status`: se cuelan binarios y borradores.
- **Nunca** commitear `.env*`, claves, o capturas temporales de trabajo.
- Commit por ruta explícita: `git add src/app/contactus/page.jsx`.

Formato de mensaje (conventional commits):

```
feat(contacto): formulario real con validacion y 3 modos de envio
fix(hero): separacion entre breadcrumb y titulo
docs(anchor): reparto frontend/backend y contrato del formulario
```

---

## 4. Subir a **tu** rama

```bash
git push origin dev/<tu-usuario>
```

Y abrir el Pull Request en GitHub: `dev/<tu-usuario>` → `main`.

**Prohibido, sin excepciones:**

| Comando | Por qué |
|---|---|
| `git push origin main` | `main` está protegida; se llega por PR |
| `git push origin dev/<otra-persona>` | no es tu rama |
| `git push --force` / `-f` | reescribe historia que otros ya tienen |
| `git reset --hard` / `git clean -fd` | borra trabajo sin vuelta atrás |

---

## 5. Si el remoto no está configurado

```bash
git remote add origin <URL-del-repositorio>
git fetch origin
git switch -c dev/<tu-usuario> --track origin/dev/<tu-usuario>
```

Verificación: `git remote -v` muestra `origin` y `git branch --show-current` devuelve tu rama
**antes** de commitear.

Si el repositorio del equipo no es este directorio (el del equipo tiene además el backend
FastAPI), este checkout es el espacio de trabajo del frontend y habrá que decidir cómo se
integran los dos historiales antes de empujar.

---

## 6. Antes de pedir revisión

- [ ] `package.json` sin dependencias nuevas sin justificar
- [ ] Sin `console.log` de depuración
- [ ] Sin archivos `.zip`, capturas temporales ni `evidence/`
- [ ] La documentación que tocaba está actualizada (`README.md`, `AGENTS.md`, `opendesign/`)
- [ ] El Pull Request explica **qué** cambia y **por qué**, no solo "cambios varios"
