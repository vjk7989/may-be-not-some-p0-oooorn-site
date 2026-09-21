import { ArrowUpRight } from "lucide-react";
import { withBasePath } from "@/lib/site-data";

const footerVisual = withBasePath("/spartan-reference/v2cZIMtgjEII7EpDnUDGGgCyuiQ.png");

export function SiteFooter() {
  return <footer className="site-footer" style={{ backgroundImage: `linear-gradient(180deg,rgba(21,21,21,.03),#181818 92%),url(${footerVisual})` }}>
    <div className="shell footer-grid">
      <section className="footer-signup"><a className="footer-symbol" href={withBasePath("/")} aria-label="Spartan home"><span className="brand-mark"><i /><b /></span></a><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ac ultrices massa. Vivamus faucibus egestas nulla</p><form action="#" className="newsletter"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" placeholder="jane@framer.com" /><button type="submit">Subscribe <ArrowUpRight aria-hidden="true" /></button></form><div className="footer-social"><span>FOLLOW US:</span><a href="https://x.com/sirdelani">X</a><a href="https://www.linkedin.com/in/delanipro/">IN</a><a href="https://youtube.com/">YT</a><a href="https://instagram.com/sirdelani">IG</a></div></section>
      <nav aria-label="Quick links"><p>Quick Links</p><a href={withBasePath("/")}>Home</a><a href={withBasePath("/digital-brain/")}>Digital Brain</a><a href={withBasePath("/project/")}>Projects</a><a href={withBasePath("/articles/")}>Articles</a></nav>
      <nav aria-label="Company"><p>Company</p><a href={withBasePath("/about/")}>About Us</a><a href={withBasePath("/contact/")}>Contact Us</a><a href="https://cal.com/">Book A Call</a><a href="https://delani.pro/templates">More Templates</a></nav>
      <nav aria-label="Policies"><p>Policies</p><a href={withBasePath("/policies/terms-conditions/")}>Terms &amp; Conditions</a><a href={withBasePath("/policies/privacy-policy/")}>Privacy Policy</a></nav>
    </div><div className="footer-wordmark" aria-hidden="true">spartan</div>
  </footer>;
}
