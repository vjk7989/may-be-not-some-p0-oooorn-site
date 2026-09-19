"use client";

import { useEffect, useRef } from "react";

export function NotFoundMotion() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let revertMotion: (() => void) | undefined;

    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    void import("animejs").then(({ animate, createScope, createTimeline, engine }) => {
      if (cancelled || !root.current) return;

      engine.pauseOnDocumentHidden = true;
      const scope = createScope({ root }).add(() => {
        const timeline = createTimeline({
          defaults: { duration: 720, ease: "out(4)" },
          loop: true,
          loopDelay: 900,
        });

        timeline
          .add("[data-resolve-route]", { strokeDashoffset: [520, 0], opacity: [0.35, 1] }, 0)
          .add("[data-checkpoint]", { scale: [0.72, 1], opacity: [0.35, 1] }, 160)
          .add(".not-found-token--one", { x: [0, 132, 278, 420], y: [0, -30, 28, -8] }, 120)
          .add(".not-found-token--two", { x: [0, 120, 240], y: [0, 46, 6] }, 360)
          .add("[data-broken-route]", { opacity: [0.35, 1, 0.35] }, 860)
          .add(".not-found-token--one", { x: [420, 330, 250], y: [-8, 52, 12] }, 1500)
          .add(".not-found-home-node", { scale: [1, 1.12, 1], opacity: [0.72, 1] }, 1840);

        animate(".not-found-orbit", {
          rotate: "1turn",
          duration: 9000,
          ease: "linear",
          loop: true,
        });
      });

      revertMotion = () => scope.revert();
    });

    return () => {
      cancelled = true;
      revertMotion?.();
    };
  }, []);

  return (
    <div className="not-found-motion" ref={root}>
      <svg
        data-not-found-visual
        aria-hidden="true"
        viewBox="0 0 720 620"
        role="presentation"
      >
        <defs>
          <pattern id="not-found-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" className="not-found-grid-line" />
          </pattern>
        </defs>

        <rect className="not-found-grid" width="720" height="620" fill="url(#not-found-grid)" />
        <circle className="not-found-orbit" cx="360" cy="310" r="232" />
        <circle className="not-found-orbit not-found-orbit--inner" cx="360" cy="310" r="168" />

        <path
          data-resolve-route
          className="not-found-route not-found-route--resolve"
          d="M86 330 C170 330 178 222 270 222 S390 380 478 330 S560 238 646 266"
        />
        <path
          data-broken-route
          className="not-found-route not-found-route--broken"
          d="M478 330 C528 352 556 388 584 430 M608 458 L646 496"
        />

        <g data-checkpoint className="not-found-checkpoint" transform="translate(270 222)">
          <circle r="28" />
          <text y="5">P</text>
        </g>
        <g data-checkpoint className="not-found-checkpoint" transform="translate(478 330)">
          <circle r="28" />
          <text y="5">C</text>
        </g>
        <g data-checkpoint className="not-found-checkpoint" transform="translate(584 430)">
          <circle r="28" />
          <text y="5">E</text>
        </g>

        <circle data-request-token className="not-found-token not-found-token--one" cx="86" cy="330" r="9" />
        <circle data-request-token className="not-found-token not-found-token--two" cx="128" cy="286" r="6" />
        <g className="not-found-home-node" transform="translate(646 266)">
          <circle r="40" />
          <path d="M-13 4 0-9 13 4V18H5V7H-5V18H-13Z" />
        </g>

        <text className="not-found-number" x="355" y="360" textAnchor="middle">404</text>
        <text className="not-found-diagram-label" x="70" y="382">REQUEST</text>
        <text className="not-found-diagram-label" x="566" y="548">BOUNDARY LOST</text>
      </svg>
    </div>
  );
}
