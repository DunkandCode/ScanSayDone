"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"survey" | "dashboard">("survey");
  
  // Estados para la encuesta
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [speedRating, setSpeedRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Estados para simular métricas en el Dashboard
  const [responses, setResponses] = useState<Array<{ nps: number; comment: string; time: string }>>([
    { nps: 10, comment: "¡Excelente atención y el café exquisito!", time: "Hace 15 min" },
    { nps: 9, comment: "Muy rápido el servicio en la mesa.", time: "Hace 40 min" },
    { nps: 4, comment: "El pedido se demoró 25 minutos en llegar.", time: "Hace 1 hora" },
    { nps: 8, comment: "Todo bien, pero la música estaba muy alta.", time: "Hace 2 horas" },
    { nps: 10, comment: "El mejor local del barrio, volveremos.", time: "Hace 3 horas" },
  ]);

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (npsScore === null) return;

    setResponses([
      { nps: npsScore, comment: comment || "Sin comentario", time: "Justo ahora" },
      ...responses,
    ]);
    setSubmitted(true);
  };

  const handleReset = () => {
    setNpsScore(null);
    setComment("");
    setSubmitted(false);
  };

  // Cálculo de NPS en vivo
  const total = responses.length;
  const promoters = responses.filter((r) => r.nps >= 9).length;
  const passives = responses.filter((r) => r.nps >= 7 && r.nps <= 8).length;
  const detractors = responses.filter((r) => r.nps <= 6).length;
  const calculatedNPS = Math.round(((promoters - detractors) / total) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      {/* HEADER DE MARCA */}
      <header className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between py-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/30">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ScanSayDone <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">MVP Alpha</span>
            </h1>
            <p className="text-xs text-slate-400">Dunk & Code XD | Talento Digital 2026</p>
          </div>
        </div>

        {/* SELECTOR DE VISTAS */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab("survey")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "survey"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📱 Vista Cliente (QR)
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            👔 Vista Dueño (Dashboard)
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full max-w-2xl mt-6 flex-1 flex flex-col justify-center">
        {activeTab === "survey" ? (
          /* ======================================================== */
          /* 1. VISTA CLIENTE: ENCUESTA MÓVIL (< 30s)                */
          /* ======================================================== */
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">¡Muchas gracias por opinar!</h2>
                <p className="text-sm text-slate-300 max-w-sm mb-6">
                  Tu evaluación fue enviada de forma 100% anónima directamente a la gerencia del local. Nos ayudas a mejorar cada día.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  Probar otra encuesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitSurvey} className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
                    <span>☕ Café Dunk & Code</span> • <span>Mesa #4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    ¿Qué tan probable es que nos recomiendes con un amigo?
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Escala de 0 (Nada probable) a 10 (Totalmente probable). Encuesta rápida de 30 segundos.
                  </p>
                </div>

                {/* BOTONES NPS (0 al 10) */}
                <div>
                  <div className="grid grid-cols-11 gap-1 sm:gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                      let colorClass = "bg-slate-700 hover:bg-slate-600 text-slate-200";
                      if (npsScore === score) {
                        if (score >= 9) colorClass = "bg-emerald-500 text-white ring-2 ring-emerald-300";
                        else if (score >= 7) colorClass = "bg-amber-500 text-white ring-2 ring-amber-300";
                        else colorClass = "bg-rose-500 text-white ring-2 ring-rose-300";
                      }
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setNpsScore(score)}
                          className={`h-11 sm:h-12 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center transition-all ${colorClass}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
                    <span className="text-rose-400">Detractor (0-6)</span>
                    <span className="text-amber-400">Pasivo (7-8)</span>
                    <span className="text-emerald-400">Promotor (9-10)</span>
                  </div>
                </div>

                {/* PREGUNTAS SECUNDARIAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700/60">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      ⚡ Rapidez del Servicio
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSpeedRating(star)}
                          className={`text-xl ${star <= speedRating ? "text-amber-400" : "text-slate-600"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      👌 Calidad del Producto
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setQualityRating(star)}
                          className={`text-xl ${star <= qualityRating ? "text-amber-400" : "text-slate-600"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COMENTARIO OPCIONAL */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    💬 Comentario o sugerencia (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos algún detalle que podamos mejorar..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* BOTÓN ENVIAR */}
                <button
                  type="submit"
                  disabled={npsScore === null}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                    npsScore !== null
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                      : "bg-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {npsScore !== null ? "Enviar Opinión (100% Anónimo)" : "Selecciona una nota para enviar"}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* 2. VISTA COMERCIANTE: DASHBOARD EN TIEMPO REAL           */
          /* ======================================================== */
          <div className="space-y-6">
            {/* TARJETAS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* SEMÁFORO NPS */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Score NPS Actual
                </span>
                <div className="my-2 flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-black ${
                      calculatedNPS >= 50
                        ? "text-emerald-400"
                        : calculatedNPS >= 0
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {calculatedNPS > 0 ? `+${calculatedNPS}` : calculatedNPS}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md w-fit ${
                    calculatedNPS >= 50
                      ? "bg-emerald-500/20 text-emerald-300"
                      : calculatedNPS >= 0
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {calculatedNPS >= 50 ? "Excelente" : calculatedNPS >= 0 ? "Bueno" : "Atención Requerida"}
                </span>
              </div>

              {/* TOTAL OPINIONES */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Opiniones Hoy
                </span>
                <div className="my-2">
                  <span className="text-4xl font-black text-white">{total}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {promoters} Promotores • {detractors} Detractores
                </span>
              </div>

              {/* QR DEL LOCAL */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Código QR de Mesa
                </span>
                <div className="my-1 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center font-mono text-[9px] text-black font-bold text-center leading-tight">
                    [QR PNG]
                  </div>
                  <div className="text-xs text-slate-300">
                    Mesa #4 activa
                  </div>
                </div>
                <button
                  onClick={() => alert("Función de descarga en alta calidad para imprimir en mesa lista en la API.")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold text-left"
                >
                  Descargar para imprimir 📥
                </button>
              </div>
            </div>

            {/* FEED DE COMENTARIOS */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>Opiniones Recientes</span>
                <span className="text-xs font-normal text-slate-400">Tiempo real</span>
              </h3>
              <div className="space-y-3">
                {responses.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium">{r.comment}</p>
                      <span className="text-[10px] text-slate-500">{r.time}</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${
                        r.nps >= 9
                          ? "bg-emerald-500/20 text-emerald-300"
                          : r.nps >= 7
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      Nota {r.nps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-2xl text-center py-6 text-xs text-slate-500 border-t border-slate-800/80 mt-8">
        ScanSayDone • Plataforma de encuestas ágiles para MiPymes • Equipo Dunk & Code XD
      </footer>
    </div>
  );
}
