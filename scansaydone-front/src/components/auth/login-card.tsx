"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [statusMessage, setStatusMessage] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
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

    setStatusMessage("Demostración: no se ha iniciado ninguna sesión.");
  };

  return (
    <div className="mx-auto w-full max-w-[430px] rounded-[16px] border border-border-mid bg-surface-default px-6 py-10 lg:px-10 lg:py-12">
      {/* Lockup */}
      <Image
        src="/img/marca/lockup-nav.png"
        width={305}
        height={72}
        alt="Scan-Say-Done"
        className="h-9 w-auto"
        priority
      />

      {/* DEMO chip + confession */}
      <p className="mt-6 flex items-center gap-2">
        <span className="rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
          DEMO
        </span>
        <span className="font-ui text-[13px] font-medium text-text-secondary">
          Todavía no se abre ninguna sesión.
        </span>
      </p>

      {/* H1 */}
      <h1 className="mt-6 font-display text-[44px] leading-[0.95] text-text-primary md:text-[56px]">
        LEE LO QUE TE DICEN
      </h1>

      {/* Support text */}
      <p className="mt-4 font-ui text-[16px] leading-[1.5] text-text-secondary">
        Tu acceso, con usuario y contraseña.
      </p>

      {/* Form */}
      <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
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
          className="h-[52px] w-full rounded-[8px] border-2 border-interactive-primary bg-interactive-primary font-ui text-[15px] font-semibold text-text-primary hover:bg-interactive-hover hover:border-interactive-hover active:bg-interactive-pressed active:border-interactive-pressed focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-text-primary"
        >
          ENTRAR
        </button>

        {/* Status message */}
        <div role="status" aria-live="polite" className="min-h-5 font-ui text-[13px] text-text-secondary">
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
