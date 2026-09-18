import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ViewportSection } from "@/components/ui/viewport-section";
import { siteConfig } from "@/lib/site-data";

export function AssessmentCta() {
  return (
    <ViewportSection className="assessment-cta" aria-labelledby="assessment-title">
      <div className="shell assessment-layout">
        <div>
          <p className="section-label section-label-light">Start with your workflow</p>
          <h2 id="assessment-title">Know what your AI can reach before it acts.</h2>
          <p>
            Map the data, identities, tools, permissions, and destinations
            involved in one real AI workflow.
          </p>
        </div>
        <Button asChild variant="inverse" className="assessment-button">
          <a href={siteConfig.calendarUrl}>
            Book a Security Assessment
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </Button>
      </div>
    </ViewportSection>
  );
}
