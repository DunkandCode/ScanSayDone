"use client";

import { useState, useRef, useCallback } from "react";

const SCALE_VALUES = Array.from({ length: 11 }, (_, i) => i);

export function SurveyCard() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showDemoNote, setShowDemoNote] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (index + 1) % SCALE_VALUES.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextIndex =
            (index - 1 + SCALE_VALUES.length) % SCALE_VALUES.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = SCALE_VALUES.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        setSelected(SCALE_VALUES[nextIndex]);
        setShowDemoNote(false);
        buttonRefs.current[nextIndex]?.focus();
      }
    },
    []
  );

  const getTabIndex = (index: number) => {
    if (selected === null) return index === 0 ? 0 : -1;
    return SCALE_VALUES[index] === selected ? 0 : -1;
  };

  const handleSubmit = useCallback(() => {
    if (selected !== null) {
      setShowDemoNote(true);
    }
  }, [selected]);

  return (
    <div id="encuesta-demo" tabIndex={-1} className="scroll-mt-[92px] w-full border-2 border-border-mid rounded-lg bg-surface-default p-4 sm:p-6 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary">
      {/* Header: DEMO tag + store label */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-block bg-surface-elevated text-text-primary text-xs font-ui font-semibold px-2 py-0.5 rounded">
          DEMO
        </span>
        <p className="text-sm font-ui text-text-secondary">
          Tu negocio · Mesa 4
        </p>
      </div>

      {/* Question */}
      <h2
        id="survey-question"
        className="font-ui text-lg sm:text-xl font-semibold text-text-primary mb-6"
      >
        ¿Cómo fue tu experiencia hoy?
      </h2>

      {/* Scale 0–10 as radiogroup */}
      <div
        role="radiogroup"
        aria-labelledby="survey-question"
        className="grid grid-cols-5 xs:grid-cols-6 gap-2 mb-6"
      >
        {SCALE_VALUES.map((value, index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected === value}
            tabIndex={getTabIndex(index)}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => {
              setSelected(value);
              setShowDemoNote(false);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`min-h-11 min-w-11 rounded-md font-ui font-semibold text-sm border-2 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary ${
              selected === value
                ? "bg-interactive-primary border-interactive-primary text-text-primary"
                : "bg-surface-default border-border-mid text-text-primary hover:bg-surface-elevated"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={selected === null}
        className="w-full py-3 bg-interactive-primary text-text-primary font-ui font-semibold rounded-lg border-2 border-interactive-primary hover:bg-interactive-hover hover:border-interactive-hover active:bg-interactive-pressed active:border-interactive-pressed focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary disabled:bg-disabled-fill disabled:border-disabled-fill disabled:text-text-secondary disabled:cursor-not-allowed"
      >
        Enviar
      </button>

      {/* Demo note — shown after submit */}
      {showDemoNote && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm font-ui text-text-secondary"
        >
          Demostración: todavía no guardamos respuestas.
        </p>
      )}
    </div>
  );
}
