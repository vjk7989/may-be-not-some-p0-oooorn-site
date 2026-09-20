import { withBasePath } from "@/lib/site-data";

export function SpartanMotion() {
  const moduleUrl = JSON.stringify(withBasePath("/vendor/anime.esm.min.js"));
  const bootstrap = `(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let started = false;
    let observer;
    let scope;
    const remove = () => {
      window.removeEventListener('scroll', start);
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
    const cleanup = () => {
      remove();
      observer?.disconnect();
      scope?.revert();
    };
    const start = async () => {
      if (started) return;
      started = true;
      remove();
      const { animate, createScope, stagger, engine } = await import(${moduleUrl});
      engine.pauseOnDocumentHidden = true;
      const seen = new WeakSet();
      scope = createScope({ root: document.body }).add(() => {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || seen.has(entry.target)) return;
            seen.add(entry.target);
            animate(entry.target, { y: [28, 0], duration: 760, ease: 'out(4)' });
            const children = entry.target.querySelectorAll('[data-motion-item]');
            if (children.length) animate(children, { y: [18, 0], delay: stagger(70), duration: 620, ease: 'out(3)' });
          });
        }, { rootMargin: '0px 0px -12%', threshold: 0.08 });
        document.querySelectorAll('[data-motion-section]').forEach((element) => observer.observe(element));
      });
    };
    window.addEventListener('scroll', start, { passive: true, once: true });
    window.addEventListener('pointerdown', start, { passive: true, once: true });
    window.addEventListener('keydown', start, { once: true });
    window.addEventListener('pagehide', cleanup, { once: true });
  })();`;

  return <script type="module" dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}
