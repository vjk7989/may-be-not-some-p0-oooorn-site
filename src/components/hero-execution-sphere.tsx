"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { withBasePath } from "@/lib/site-data";

type HeroStage = "protect" | "control" | "evidence";
type TokenStatus = "attack" | "approved" | "inspection" | "detected" | "blocked" | "passed";
type TokenId = "prompt-injection" | "user-request" | "deceptive-input";

const stages: ReadonlyArray<{
  id: HeroStage;
  label: string;
  outcome: string;
  explanation: string;
}> = [
  { id: "protect", label: "Protect data", outcome: "Protected context", explanation: "reduce sensitive-data exposure before inference." },
  { id: "control", label: "Control actions", outcome: "Controlled action", explanation: "check identity, permissions, tools, and actions against policy." },
  { id: "evidence", label: "Preserve evidence", outcome: "Execution evidence", explanation: "preserve attributable, tamper-evident execution records." },
];

const inputs = ["Data", "Identity", "Tools", "Actions"] as const;

const tokenDefinitions: ReadonlyArray<{
  id: TokenId;
  label: string;
  initialStatus: TokenStatus;
  path: string;
  width: number;
  start: readonly [number, number];
}> = [
  { id: "prompt-injection", label: "Prompt injection", initialStatus: "attack", path: "M76 118 C164 118 214 139 276 176 C315 199 338 208 360 211", width: 118, start: [76, 118] },
  { id: "user-request", label: "User request", initialStatus: "approved", path: "M76 215 C182 215 276 215 390 215 C478 215 540 215 642 215", width: 108, start: [76, 215] },
  { id: "deceptive-input", label: "Deceptive input", initialStatus: "inspection", path: "M76 312 C168 312 218 290 278 253 C316 230 339 221 360 218", width: 116, start: [76, 312] },
];

const initialStatuses: Record<TokenId, TokenStatus> = {
  "prompt-injection": "attack",
  "user-request": "approved",
  "deceptive-input": "inspection",
};

const statusLabels: Record<TokenStatus, string> = {
  attack: "Attack",
  approved: "Approved",
  inspection: "Inspecting",
  detected: "Detected",
  blocked: "Blocked",
  passed: "Passed",
};

export function HeroExecutionSphere() {
  const root = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<HeroStage>("protect");
  const [tokenStatuses, setTokenStatuses] = useState(initialStatuses);

  useEffect(() => {
    let cancelled = false;
    let revertMotion: (() => void) | undefined;
    let idleHandle: number | undefined;

    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const setTokenStatus = (id: TokenId, status: TokenStatus) => {
      if (cancelled) return;
      setTokenStatuses((current) => current[id] === status ? current : { ...current, [id]: status });
    };

    const startMotion = () => {
      void Promise.all([
        import("animejs/animation"),
        import("animejs/scope"),
        import("animejs/engine"),
        import("animejs/svg"),
      ]).then(([{ animate }, { createScope }, { engine }, { createMotionPath }]) => {
        if (cancelled || !root.current) return;

        engine.pauseOnDocumentHidden = true;
        const scope = createScope({ root }).add(() => {
          animate("[data-sphere-ring='outer']", { rotate: "1turn", duration: 12000, ease: "linear", loop: true });
          animate("[data-sphere-ring='middle']", { rotate: "-1turn", duration: 9000, ease: "linear", loop: true });
          animate("[data-sphere-ring='inner']", { rotate: "1turn", duration: 6800, ease: "linear", loop: true });
          animate("[data-request-path]", { strokeDashoffset: [0, -28], duration: 2800, ease: "linear", loop: true });

          const promptPath = root.current?.querySelector<SVGPathElement>('[data-token-path="prompt-injection"]');
          const userPath = root.current?.querySelector<SVGPathElement>('[data-token-path="user-request"]');
          const deceptivePath = root.current?.querySelector<SVGPathElement>('[data-token-path="deceptive-input"]');

          if (promptPath) {
            animate('[data-request-token="prompt-injection"]', {
              ...createMotionPath(promptPath), opacity: [1, 1, 1, 0.64, 0], scale: [1, 1, 1, 0.82, 0.38], duration: 6200, ease: "inOut(2)", loop: true,
              onLoop: () => setTokenStatus("prompt-injection", "attack"),
              onUpdate: (animation) => {
                if (animation.iterationProgress >= 0.64) setTokenStatus("prompt-injection", "blocked");
              },
            });
          }
          if (userPath) {
            animate('[data-request-token="user-request"]', {
              ...createMotionPath(userPath), duration: 6200, ease: "inOut(2)", loop: true,
              onLoop: () => setTokenStatus("user-request", "approved"),
              onUpdate: (animation) => {
                if (animation.iterationProgress >= 0.68) setTokenStatus("user-request", "passed");
              },
            });
          }
          if (deceptivePath) {
            animate('[data-request-token="deceptive-input"]', {
              ...createMotionPath(deceptivePath), opacity: [1, 1, 1, 0.64, 0], scale: [1, 1, 1, 0.82, 0.38], duration: 7000, delay: 320, ease: "inOut(2)", loop: true,
              onLoop: () => setTokenStatus("deceptive-input", "inspection"),
              onUpdate: (animation) => {
                if (animation.iterationProgress >= 0.72) setTokenStatus("deceptive-input", "blocked");
                else if (animation.iterationProgress >= 0.52) setTokenStatus("deceptive-input", "detected");
              },
            });
          }

          animate("[data-token-fragment]", {
            translateX: [0, 8], translateY: [0, -7], opacity: [0.15, 0.72, 0.15], scale: [0.7, 1, 0.7],
            duration: 1600, ease: "inOut(2)", loop: true,
          });
          animate("[data-sphere-aperture]", { scale: [1, 1.04, 1], duration: 2200, ease: "inOut(3)", loop: true });
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

  return (
    <div ref={root} className="hero-execution-sphere" data-hero-execution-sphere data-active-stage={activeStage} aria-label="Buckleson execution flow" role="group">
      <div className="execution-visual">
        <ul className="execution-inputs" aria-label="AI request inputs">
          {inputs.map((input) => <li key={input}>{input}</li>)}
        </ul>

        <svg className="execution-field" aria-hidden="true" role="presentation" viewBox="0 0 720 430">
          <g className="execution-lanes">
            {tokenDefinitions.map((token) => (
              <path key={token.id} data-request-path data-token-path={token.id} className={`execution-token-path execution-token-path--${token.id}`} d={token.path} />
            ))}
          </g>

          {stages.map((stage, index) => (
            <g key={stage.id} data-hero-flow={stage.id} data-active={activeStage === stage.id ? "true" : "false"} className="execution-flow">
              <path data-request-path className="execution-path execution-path--output" d={[
                "M396 208 C458 176 508 118 648 108",
                "M396 215 C482 215 540 215 648 215",
                "M396 222 C458 254 508 312 648 322",
              ][index]} />
              <circle className="execution-output-node" cx="648" cy={[108, 215, 322][index]} r="8" />
            </g>
          ))}

          <g className="execution-ring execution-ring--outer" data-sphere-ring="outer"><ellipse cx="390" cy="215" rx="106" ry="60" /><ellipse cx="390" cy="215" rx="60" ry="106" /></g>
          <g className="execution-ring execution-ring--middle" data-sphere-ring="middle"><ellipse cx="390" cy="215" rx="88" ry="42" /><ellipse cx="390" cy="215" rx="42" ry="88" /></g>
          <g className="execution-ring execution-ring--inner" data-sphere-ring="inner"><ellipse cx="390" cy="215" rx="72" ry="27" /></g>
          <circle data-sphere-aperture className="execution-aperture" cx="390" cy="215" r="54" />

          {tokenDefinitions.map((token) => {
            const status = tokenStatuses[token.id];
            return (
              <g key={token.id} data-request-particle={token.id} data-request-token={token.id} data-token-status={status} className="request-token" transform={`translate(${token.start[0]} ${token.start[1]})`}>
                <rect className="request-token-surface" x={token.width / -2} y="-19" width={token.width} height="38" rx="12" />
                <circle className="request-token-icon" cx={token.width / -2 + 14} cy="0" r="5" />
                <text className="request-token-label" x={token.width / -2 + 24} y="-3">{token.label}</text>
                <text className="request-token-status" x={token.width / -2 + 24} y="10">{statusLabels[status]}</text>
              </g>
            );
          })}

          <g className="token-fragments" data-fragment-status={tokenStatuses["prompt-injection"]}>
            <circle data-token-fragment data-token-owner="prompt-injection" cx="350" cy="196" r="3" />
            <path data-token-fragment data-token-owner="prompt-injection" d="M357 201 l7 -5" />
          </g>
          <g className="token-fragments" data-fragment-status={tokenStatuses["deceptive-input"]}>
            <circle data-token-fragment data-token-owner="deceptive-input" cx="351" cy="234" r="3" />
            <path data-token-fragment data-token-owner="deceptive-input" d="M358 229 l7 5" />
          </g>
        </svg>

        <div className="execution-core" aria-label="Buckleson execution sphere">
          <Image src={withBasePath("/brand/buckleson-logo-display.webp")} width={128} height={122} alt="" className="boundary-logo execution-sphere-logo" data-sphere-logo decoding="async" loading="eager" />
          <strong>Buckleson</strong>
        </div>

        <ul className="execution-outcomes" aria-label="Controlled outcomes">
          {stages.map((stage) => (
            <li key={stage.id} data-hero-outcome={stage.id} data-active={activeStage === stage.id ? "true" : "false"}>
              <span aria-hidden="true" />{stage.outcome}
            </li>
          ))}
        </ul>
      </div>

      <div className="token-flow-summary" data-token-flow-summary>
        <p><strong>Illustrative request flow.</strong> Detected harmful requests can be blocked at the boundary.</p>
        <ul>
          <li><span className="flow-key flow-key--blocked" aria-hidden="true">×</span><strong>Known attack</strong> — blocked</li>
          <li><span className="flow-key flow-key--passed" aria-hidden="true">✓</span><strong>Approved request</strong> — passed</li>
          <li><span className="flow-key flow-key--inspection" aria-hidden="true">?</span><strong>Deceptive input</strong> — when detected, blocked</li>
        </ul>
      </div>

      <div className="execution-controls" aria-label="Explore Buckleson outcomes">
        {stages.map((stage) => (
          <div key={stage.id} className="execution-control" data-active={activeStage === stage.id ? "true" : "false"}>
            <button type="button" data-hero-control={stage.id} aria-pressed={activeStage === stage.id} onClick={() => setActiveStage(stage.id)} onFocus={() => setActiveStage(stage.id)} onPointerEnter={() => setActiveStage(stage.id)}>{stage.label}</button>
            <p>{stage.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
