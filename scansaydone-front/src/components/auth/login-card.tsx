"use client";

/**
 * Tarjeta de acceso (/entrar): login real contra
 * `POST /api/v1/auth/login`.
 *
 * - Valida los campos en cliente (igual que antes) y recién entonces
 *   llama a `iniciarSesion`.
 * - Mientras envía: botón deshabilitado con «Entrando…» y `aria-busy`
 *   en el formulario.
 * - Mensajes por estado (es-CL, sin revelar cuál credencial falló):
 *   401 → «Usuario o contraseña incorrectos.»
 *   422 → «Revisa el usuario y la contraseña.»
 *   5xx/red/otro fallo → «No se pudo consultar el servicio. Intenta de nuevo.»
 * - Éxito: guarda la sesión (`ssd.sesion`) y navega a /panel. La tarjeta
 *   nunca muestra datos de la cuenta.
 */
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { iniciarSesion } from "@/lib/api/auth";
import { guardarSesion } from "@/lib/auth/sesion";

export function LoginCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [esError, setEsError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;

    setStatusMessage("");
    setEsError(false);
    setErrors({});

    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Escribe tu usuario para continuar.";
    }
    if (!password.trim()) {
      newErrors.password = "Escribe tu contraseña para continuar.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.username) {
        usernameRef.current?.focus();
      } else if (newErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setEnviando(true);
    const resultado = await iniciarSesion({
      usuario: username.trim(),
      contrasena: password,
    });
    setEnviando(false);

    if (resultado.estado === "ok") {
      guardarSesion(resultado.sesion);
      router.push("/panel");
      return;
    }

    // Sin éxito: mensaje general, sin revelar cuál de los dos falló.
    if (resultado.estado === "credenciales") {
      setStatusMessage("Usuario o contraseña incorrectos.");
    } else if (resultado.estado === "datos-invalidos") {
      setStatusMessage("Revisa el usuario y la contraseña.");
    } else {
      // no-disponible | error
      setStatusMessage("No se pudo consultar el servicio. Intenta de nuevo.");
    }
    setEsError(true);
  }

  return (
    <div className="mx-auto w-full max-w-[430px] rounded-[16px] border border-border-mid bg-surface-default px-6 py-10 lg:px-10 lg:py-12">
      {/* Lockup */}
      <Image
        src="/img/marca/lockup-nav.png"
        width={305}
        height={72}
        alt="Scan-Say-Done"
        className="h-9 w-auto"
        style={{ width: "auto" }}
        priority
      />

      {/* H1 */}
      <h1 className="mt-6 font-display text-[44px] leading-[0.95] text-text-primary md:text-[56px]">
        LEE LO QUE TE DICEN
      </h1>

      {/* Support text */}
      <p className="mt-4 font-ui text-[16px] leading-[1.5] text-text-secondary">
        Tu acceso, con usuario y contraseña.
      </p>

      {/* Form */}
      <form
        className="mt-8 space-y-6"
        noValidate
        onSubmit={handleSubmit}
        aria-busy={enviando}
      >
        {/* Username field */}
        <div>
          <label
            htmlFor="username"
            className="block font-ui text-[13px] font-semibold text-text-secondary"
          >
            Tu usuario
          </label>
          <input
            ref={usernameRef}
            id="username"
            name="usuario"
            type="text"
            autoComplete="username"
            spellCheck={false}
            autoCapitalize="none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-describedby={errors.username ? "username-error" : undefined}
            aria-invalid={!!errors.username}
            className={`mt-2 h-12 w-full rounded-[8px] border bg-surface-default px-3 font-ui text-[16px] text-text-primary placeholder:text-text-secondary focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-text-primary ${
              errors.username ? "border-error-text" : "border-border-mid"
            }`}
          />
          <div
            id="username-error"
            aria-live="polite"
            className="mt-2 min-h-5 font-ui text-[13px] text-error-text"
          >
            {errors.username || ""}
          </div>
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="block font-ui text-[13px] font-semibold text-text-secondary"
          >
            Tu contraseña
          </label>
          <div className="relative mt-2">
            <input
              ref={passwordRef}
              id="password"
              name="contrasena"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              spellCheck={false}
              autoCapitalize="none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              className={`h-12 w-full rounded-[8px] border bg-surface-default pl-3 pr-[72px] font-ui text-[16px] text-text-primary placeholder:text-text-secondary focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-text-primary ${
                errors.password ? "border-error-text" : "border-border-mid"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="absolute right-3.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[4px] font-ui text-[13px] font-medium text-text-secondary hover:text-text-primary focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-text-primary"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
          <div
            id="password-error"
            aria-live="polite"
            className="mt-2 min-h-5 font-ui text-[13px] text-error-text"
          >
            {errors.password || ""}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={enviando}
          className="h-[52px] w-full rounded-[8px] border-2 border-interactive-primary bg-interactive-primary font-ui text-[15px] font-semibold text-text-primary hover:bg-interactive-hover hover:border-interactive-hover active:bg-interactive-pressed active:border-interactive-pressed focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-text-primary disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-interactive-primary disabled:hover:border-interactive-primary"
        >
          {enviando ? "Entrando…" : "ENTRAR"}
        </button>

        {/* Status message */}
        <div
          role="status"
          aria-live="polite"
          className={`min-h-5 font-ui text-[13px] ${
            esError ? "text-error-text" : "text-text-secondary"
          }`}
        >
          {statusMessage}
        </div>
      </form>

      {/* Back link */}
      <div className="mt-6 border-t border-border-subtle pt-6 text-center">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-ui text-[15px] font-semibold text-text-primary underline decoration-border-mid underline-offset-4 focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-text-primary"
        >
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
