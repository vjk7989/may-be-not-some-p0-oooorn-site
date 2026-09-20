"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { withBasePath } from "@/lib/site-data";

type HeroStage = "protect" | "control" | "evidence";

const stages: ReadonlyArray<{
  id: HeroStage;
  label: string;
  outcome: string;
  explanation: string;
}> = [
  {
    id: "protect",
    label: "Protect data",
    outcome: "Protected context",
    explanation: "reduce sensitive-data exposure before inference.",
  },
  {
    id: "control",
    label: "Control actions",
    outcome: "Controlled action",
    explanation: "check identity, permissions, tools, and actions against policy.",
  },
  {
    id: "evidence",
    label: "Preserve evidence",
    outcome: "Execution evidence",
    explanation: "preserve attributable, tamper-evident execution records.",
  },
];

const inputs = ["Data", "Identity", "Tools", "Actions"] as const;

export function HeroExecutionSphere() {
  const root = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<HeroStage>("protect");

  useEffect(() => {
    let cancelled = false;
    let revertMotion: (() => void) | undefined;
    let idleHandle: number | undefined;

    if (
      !root.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const startMotion = () => {
      void Promise.all([
        import("animejs/animation"),
        import("animejs/scope"),
        import("animejs/engine"),
      ]).then(([{ animate }, { createScope }, { engine }]) => {
        if (cancelled || !root.current) return;

        engine.pauseOnDocumentHidden = true;
        const scope = createScope({ root }).add(() => {
          animate("[data-sphere-ring='outer']", {
            rotate: "1turn",
            duration: 12000,
            ease: "linear",
            loop: true,
          });
          animate("[data-sphere-ring='middle']", {
            rotate: "-1turn",
            duration: 9000,
            ease: "linear",
            loop: true,
          });
          animate("[data-sphere-ring='inner']", {
            rotate: "1turn",
            duration: 6800,
            ease: "linear",
            loop: true,
          });
          animate("[data-request-path]", {
            strokeDashoffset: [0, -48],
            duration: 2400,
            ease: "linear",
            loop: true,
          });
          animate("[data-request-particle='one']", {
            translateX: [0, 148, 292, 438],
            translateY: [0, -18, 9, -6],
            opacity: [0.25, 1, 1, 0.25],
            duration: 3600,
            ease: "inOut(2)",
            loop: true,
          });
          animate("[data-request-particle='two']", {
            translateX: [0, 126, 270, 420],
            translateY: [0, 24, -12, 6],
            opacity: [0.2, 0.9, 1, 0.2],
            duration: 4100,
            delay: 520,
            ease: "inOut(2)",
            loop: true,
          });
          animate("[data-request-particle='three']", {
            translateX: [0, 136, 286, 430],
            translateY: [0, -8, 20, 0],
            opacity: [0.2, 1, 0.85, 0.2],
            duration: 3900,
            delay: 980,
            ease: "inOut(2)",
            loop: true,
          });
          animate("[data-sphere-aperture]", {
            scale: [1, 1.045, 1],
            duration: 2200,
            ease: "inOut(3)",
            loop: true,
          });
        });

        revertMotion = () => scope.revert();
      });
    };

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      idleHandle = window.requestIdleCallback(startMotion);
    });

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      revertMotion?.();
    };
  }, []);

  const selectStage = (stage: HeroStage) => setActiveStage(stage);

  return (
    <div
      ref={root}
      className="hero-execution-sphere"
      data-hero-execution-sphere
      data-active-stage={activeStage}
      aria-label="Buckleson execution flow"
    >
      <div className="execution-visual">
        <ul className="execution-inputs" aria-label="AI request inputs">
          {inputs.map((input) => (
            <li key={input}>{input}</li>
          ))}
        </ul>

        <svg
          className="execution-field"
          aria-hidden="true"
          role="presentation"
          viewBox="0 0 720 430"
        >
          <path
            data-request-path
            className="execution-path execution-path--input execution-path--protect-input"
            d="M78 96 C180 96 204 150 284 174 C330 188 355 196 386 205"
          />
          <path
            data-request-path
            className="execution-path execution-path--input execution-path--control-input"
            d="M78 174 C184 174 212 178 292 201 C332 212 356 214 386 214"
          />
          <path
            data-request-path
            className="execution-path execution-path--input execution-path--control-input"
            d="M78 256 C182 256 210 238 292 226 C332 220 356 218 386 217"
          />
          <path
            data-request-path
            className="execution-path execution-path--input execution-path--evidence-input"
            d="M78 334 C178 334 206 286 286 252 C328 234 354 225 386 220"
          />

          {stages.map((stage, index) => (
            <g
              key={stage.id}
              data-hero-flow={stage.id}
              data-active={activeStage === stage.id ? "true" : "false"}
              className="execution-flow"
            >
              <path
                data-request-path
                className="execution-path execution-path--output"
                d={[
                  "M394 208 C458 180 504 118 648 108",
                  "M394 215 C480 215 536 215 648 215",
                  "M394 222 C458 248 506 310 648 322",
                ][index]}
              />
              <circle
                className="execution-output-node"
                cx="648"
                cy={[108, 215, 322][index]}
                r="8"
              />
            </g>
          ))}

          <g className="execution-ring execution-ring--outer" data-sphere-ring="outer">
            <ellipse cx="390" cy="215" rx="106" ry="60" />
            <ellipse cx="390" cy="215" rx="60" ry="106" />
          </g>
          <g className="execution-ring execution-ring--middle" data-sphere-ring="middle">
            <ellipse cx="390" cy="215" rx="88" ry="42" />
            <ellipse cx="390" cy="215" rx="42" ry="88" />
          </g>
          <g className="execution-ring execution-ring--inner" data-sphere-ring="inner">
            <ellipse cx="390" cy="215" rx="72" ry="27" />
          </g>
          <circle
            data-sphere-aperture
            className="execution-aperture"
            cx="390"
            cy="215"
            r="54"
          />

          <circle data-request-particle="one" className="execution-particle" cx="82" cy="96" r="5" />
          <circle data-request-particle="two" className="execution-particle" cx="82" cy="215" r="4" />
          <circle data-request-particle="three" className="execution-particle" cx="82" cy="334" r="4.5" />
        </svg>

        <div className="execution-core" aria-label="Buckleson execution sphere">
          <Image
            src={withBasePath("/brand/buckleson-logo-display.webp")}
            width={128}
            height={122}
            alt=""
            className="boundary-logo execution-sphere-logo"
            data-sphere-logo
            decoding="async"
            loading="eager"
          />
          <strong>Buckleson</strong>
        </div>

        <ul className="execution-outcomes" aria-label="Controlled outcomes">
          {stages.map((stage) => (
            <li
              key={stage.id}
              data-hero-outcome={stage.id}
              data-active={activeStage === stage.id ? "true" : "false"}
            >
              <span aria-hidden="true" />
              {stage.outcome}
            </li>
          ))}
        </ul>
      </div>

      <div className="execution-controls" aria-label="Explore Buckleson outcomes">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="execution-control"
            data-active={activeStage === stage.id ? "true" : "false"}
          >
            <button
              type="button"
              data-hero-control={stage.id}
              aria-pressed={activeStage === stage.id}
              onClick={() => selectStage(stage.id)}
              onFocus={() => selectStage(stage.id)}
              onPointerEnter={() => selectStage(stage.id)}
            >
              {stage.label}
            </button>
            <p>{stage.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
