/// <reference types="vitest/globals" />
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Guard del corte de la instantánea local: ningún módulo VIVO del panel
 * (páginas, layouts y componentes) puede importar la instantánea local
 * ni el snapshot JSON. Los archivos `src/lib/panel/instantanea.ts` y
 * `src/data/local-snapshot.json` quedan en disco, pero como módulo
 * muerto: si alguien los vuelve a importar desde la UI, este test
 * falla.
 */

const RAICES = ["src/app", "src/components"] as const;
const PROHIBIDOS = [
  '@/lib/panel/instantanea',
  '@/../src/data/local-snapshot.json',
  'local-snapshot.json',
  'data/local-snapshot',
];

/** Archivos .ts/.tsx de un directorio (recorrido recursivo). */
function archivosTs(directorio: string): string[] {
  const archivos: string[] = [];
  let entradas: string[];
  try {
    entradas = readdirSync(directorio);
  } catch {
    return archivos;
  }
  for (const entrada of entradas) {
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) {
      archivos.push(...archivosTs(ruta));
    } else if (/\.(ts|tsx)$/.test(entrada)) {
      archivos.push(ruta);
    }
  }
  return archivos;
}

/** Ruta absoluta del proyecto (vitest corre con cwd en la raíz). */
const raizProyecto = process.cwd();

describe("corte de la instantánea local", () => {
  it("ningún archivo de src/app ni src/components importa la instantánea", () => {
    const infractores: string[] = [];

    for (const raiz of RAICES) {
      for (const archivo of archivosTs(join(raizProyecto, raiz))) {
        const contenido = readFileSync(archivo, "utf8");
        for (const prohibido of PROHIBIDOS) {
          if (contenido.includes(prohibido)) {
            infractores.push(`${archivo} → ${prohibido}`);
          }
        }
      }
    }

    expect(infractores).toEqual([]);
  });

  it("la página del panel usa el resumen global (consultas al servicio)", async () => {
    const { ResumenGlobal } = await import("@/components/panel/resumen-global");
    expect(typeof ResumenGlobal).toBe("function");
  });
});
