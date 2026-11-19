/// <reference types="vitest/globals" />
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CLAVE_SESION,
  cerrarSesion,
  esSesionValida,
  guardarSesion,
  leerSesion,
} from "./sesion";
import type { SesionUsuario } from "@/lib/api/auth";

/** jsdom trae localStorage, pero el setup lo limpia entre tests. */

const SESION: SesionUsuario = {
  usuario: "peluqueria_estilo_sur",
  empresa_id: 3,
  nombre_negocio: "Peluquería Estilo Sur",
};

describe("sesión en localStorage (ssd.sesion)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("guardar y leer devuelven la misma sesión", () => {
    guardarSesion(SESION);

    expect(window.localStorage.getItem(CLAVE_SESION)).toBe(JSON.stringify(SESION));
    expect(leerSesion()).toEqual(SESION);
  });

  it("cerrar elimina la sesión y leer devuelve null", () => {
    guardarSesion(SESION);
    cerrarSesion();

    expect(window.localStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(leerSesion()).toBeNull();
  });

  it("sin sesión guardada, leer devuelve null", () => {
    expect(leerSesion()).toBeNull();
  });

  it("JSON corrupto → null (nunca lanza, nunca devuelve un objeto a medias)", () => {
    window.localStorage.setItem(CLAVE_SESION, "{esto no es json");
    expect(leerSesion()).toBeNull();
  });

  it("JSON válido con forma incorrecta → null", () => {
    window.localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ usuario: "x", empresa_id: "3", nombre_negocio: "N" }),
    );
    expect(leerSesion()).toBeNull();

    window.localStorage.setItem(CLAVE_SESION, JSON.stringify({ hola: 1 }));
    expect(leerSesion()).toBeNull();

    // empresa_id 0 no es una empresa válida (entero ≥ 1).
    window.localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ usuario: "x", empresa_id: 0, nombre_negocio: "N" }),
    );
    expect(leerSesion()).toBeNull();
  });

  it("sin window no explota: leer → null, guardar/cerrar → no-op", () => {
    // Simula el render de servidor: `typeof window === "undefined"`.
    vi.stubGlobal("window", undefined);

    expect(leerSesion()).toBeNull();
    expect(() => guardarSesion(SESION)).not.toThrow();
    expect(() => cerrarSesion()).not.toThrow();
  });

  it("storage bloqueado (setItem/removeItem lanzan) no rompe el flujo", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceeded", "QuotaExceededError");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("Unavailable", "SecurityError");
    });

    expect(() => guardarSesion(SESION)).not.toThrow();
    expect(() => cerrarSesion()).not.toThrow();
  });

  it("esSesionValida: true solo para la forma de la API", () => {
    expect(esSesionValida(SESION)).toBe(true);
    expect(esSesionValida(null)).toBe(false);
    expect(esSesionValida({ ...SESION, empresa_id: 1.5 })).toBe(false);
    expect(esSesionValida({ ...SESION, nombre_negocio: "" })).toBe(false);
  });
});
