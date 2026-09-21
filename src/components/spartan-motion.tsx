import { withBasePath } from "@/lib/site-data";

export function SpartanMotion() {
  const moduleUrl = JSON.stringify(withBasePath("/vendor/anime.esm.min.js"));
  const bootstrap = `(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups = [];
    const on = (element, event, handler) => { element?.addEventListener(event, handler); cleanups.push(() => element?.removeEventListener(event, handler)); };

    document.querySelectorAll('[data-billing]').forEach((button) => on(button, 'click', () => {
      const period = button.dataset.billing;
      document.querySelectorAll('[data-billing]').forEach((item) => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
      document.querySelectorAll('[data-price]').forEach((price) => price.textContent = price.dataset[period]);
      document.querySelectorAll('[data-billing-label]').forEach((label) => label.textContent = period === 'annual' ? 'Annually' : 'Monthly');
    }));
    document.querySelectorAll('[data-capability]').forEach((button) => on(button, 'click', () => { document.querySelectorAll('.cap-panels article').forEach((panel) => panel.classList.remove('is-active')); button.closest('article')?.classList.add('is-active'); }));
    document.querySelectorAll('[data-process]').forEach((button) => on(button, 'click', () => { document.querySelectorAll('.process-panels article').forEach((panel) => panel.classList.remove('is-active')); button.closest('article')?.classList.add('is-active'); }));
    const rail = document.querySelector('[data-carousel]');
    on(document.querySelector('[data-carousel-next]'), 'click', () => rail?.scrollBy({ left: 311, behavior: reduced ? 'auto' : 'smooth' }));
    on(document.querySelector('[data-carousel-prev]'), 'click', () => rail?.scrollBy({ left: -311, behavior: reduced ? 'auto' : 'smooth' }));
    document.querySelectorAll('.faq-list details').forEach((detail) => on(detail, 'toggle', () => { if (!detail.open) return; document.querySelectorAll('.faq-list details').forEach((other) => { if (other !== detail) other.open = false; }); }));
    on(document.querySelector('.newsletter'), 'submit', (event) => event.preventDefault());

    let observer; let scope; let started = false;
    const start = async () => {
      if (started || reduced) return; started = true;
      const { animate, createScope, stagger, engine } = await import(${moduleUrl});
      engine.pauseOnDocumentHidden = true;
      scope = createScope({ root: document.body }).add(() => {
        animate('.hero-copy > *', { opacity:[0,1], y:[26,0], delay:stagger(90), duration:850, ease:'out(4)' });
        animate('.brain-card', { opacity:[0,1], scale:[.92,1], rotate:[-3,1.5], duration:1100, ease:'out(4)' });
        const seen = new WeakSet();
        observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (!entry.isIntersecting || seen.has(entry.target)) return; seen.add(entry.target); animate(entry.target, { opacity:[.01,1], y:[34,0], duration:820, ease:'out(4)' }); }), { rootMargin:'0px 0px -8%', threshold:.08 });
        document.querySelectorAll('[data-motion-section] > :not(.hero-landscape)').forEach((item) => observer.observe(item));
      });
    };
    if (!reduced) { requestAnimationFrame(start); }
    window.addEventListener('pagehide', () => { cleanups.forEach((cleanup) => cleanup()); observer?.disconnect(); scope?.revert(); }, { once:true });
  })();`;
  return <script type="module" dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}
