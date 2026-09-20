import { BrandLogo } from "@/components/brand-logo";
import { siteConfig, withBasePath } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-lead">
        <div><p className="eyebrow">Independent AI systems studio</p><h2>Build intelligence that stays useful under pressure.</h2></div>
        <a className="button button--light" href={siteConfig.calendarUrl}>Book a working session</a>
      </div>
      <div className="shell footer-grid">
        <div className="footer-brand"><BrandLogo light /><p>Systems, workflows, and interfaces for deliberate automation.</p></div>
        <nav aria-label="Footer navigation"><p>Explore</p><a href={withBasePath("/digital-brain/")}>Digital Brain</a><a href={withBasePath("/project/")}>Projects</a><a href={withBasePath("/articles/")}>Articles</a></nav>
        <nav aria-label="Company navigation"><p>Company</p><a href={withBasePath("/about/")}>About</a><a href={withBasePath("/contact/")}>Contact</a><a href={siteConfig.calendarUrl}>Schedule a call</a></nav>
        <nav aria-label="Policy navigation"><p>Policies</p><a href={withBasePath("/policies/terms-conditions/")}>Terms</a><a href={withBasePath("/policies/privacy-policy/")}>Privacy</a></nav>
      </div>
      <div className="shell footer-bottom"><p>© 2026 Spartan. Independent concept studio.</p><p>No affiliation with the reference template creator.</p></div>
    </footer>
  );
}
