import { Cpu, Database, Laptop, Server, ShieldCheck, Workflow } from "lucide-react";

import { risks } from "@/lib/site-data";

const sources = [
  { name: "Copilots", icon: Laptop },
  { name: "RAG agents", icon: Database },
  { name: "Workflow agents", icon: Workflow },
  { name: "Customer agents", icon: Cpu },
  { name: "Custom models", icon: Server },
];

const destinations = ["Individual users", "Servers", "Applications", "Devices"];

export function RiskLandscape() {
  return (
    <section
      className="risk-section"
      aria-labelledby="risk-label risk-title"
    >
      <div className="shell">
        <div className="risk-intro">
          <div>
          <p className="section-label" id="risk-label">
            The risk landscape
          </p>
            <h2 id="risk-title">AI acts across systems. Risk travels with it.</h2>
          </div>
          <p>
            Buckleson sits between AI activity and the systems it can reach,
            helping reduce exposure, enforce policy, and preserve evidence.
          </p>
        </div>

        <div
          className="risk-visual"
          role="img"
          aria-labelledby="risk-title risk-description"
        >
          <p id="risk-description" className="sr-only">
            AI agents pass through risks including prompt injection, sensitive
            information disclosure, excessive agency, intent breaking and goal
            manipulation, tool misuse, and memory poisoning. Buckleson applies
            protection, control, and evidence before activity reaches individual
            users, servers, applications, and devices.
          </p>

          <div className="risk-sources" aria-hidden="true">
            <h3>AI activity</h3>
            {sources.map(({ name, icon: Icon }) => (
              <div className="source-node" key={name}>
                <Icon className="size-4" />
                <span>{name}</span>
              </div>
            ))}
          </div>

          <div className="risk-threats" aria-hidden="true">
            <h3>Threats and unsafe paths</h3>
            <div className="threat-stack">
              {risks.map((risk) => (
                <span key={risk.name}>{risk.name}</span>
              ))}
            </div>
            <svg className="risk-paths" viewBox="0 0 420 360" focusable="false">
              <path id="risk-path-a" d="M0 52 C160 52 180 168 418 178" />
              <path id="risk-path-b" d="M0 180 C160 180 230 180 418 180" />
              <path id="risk-path-c" d="M0 306 C160 306 180 192 418 182" />
              {[0, 1, 2, 3, 4, 5].map((token) => (
                <circle key={token} r="4" className="moving-token">
                  <animateMotion
                    dur={`${7 + (token % 3) * 1.5}s`}
                    begin={`${token * -1.2}s`}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#risk-path-${["a", "b", "c"][token % 3]}`} />
                  </animateMotion>
                </circle>
              ))}
            </svg>
          </div>

          <div className="buckleson-boundary" aria-hidden="true">
            <ShieldCheck className="size-7" />
            <strong>BUCKLESON</strong>
            <span>Protect</span>
            <span>Control</span>
            <span>Preserve evidence</span>
          </div>

          <div className="risk-destinations" aria-hidden="true">
            <h3>Approved destinations</h3>
            {destinations.map((destination) => (
              <span key={destination}>{destination}</span>
            ))}
          </div>
        </div>

        <ol className="risk-sequence" aria-label="Risk control sequence">
          <li><strong>1. AI activity</strong><span>Agents and models receive context and tasks.</span></li>
          <li><strong>2. Risk appears</strong><span>Untrusted content or excessive authority can change the path.</span></li>
          <li><strong>3. Buckleson intervenes</strong><span>Data protection, policy checks, and evidence surround execution.</span></li>
          <li><strong>4. Systems receive controlled activity</strong><span>Approved users, servers, applications, and devices remain the destination.</span></li>
        </ol>
      </div>
    </section>
  );
}
