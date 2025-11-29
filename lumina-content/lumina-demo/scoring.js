// scoring.js

// expects:
// - personas.js: export const audiences = { ... }
// - layouts.js: export const layouts = [ ... ]
// - components.js: export const componentVariants = [ ... ]

// ---------- scoring helpers ----------

export function scoreThing(thing, audience) {
    let score = thing.baseScore ?? 0;

    for (const tag of thing.tags ?? []) {
        score += audience.weights?.tag?.[tag] ?? 0;
    }

    for (const goal of thing.goals ?? []) {
        score += audience.weights?.goal?.[goal] ?? 0;
    }

    return score;
}

// choose which layout (i.e., which componentTypes in which slots)
export function chooseLayout(layouts, audience) {
    return layouts
        .map(layout => ({
            layout,
            score: scoreThing(layout, audience)
        }))
        .sort((a, b) => b.score - a.score)[0].layout;
}

// choose which variant (image + heading + body) for a given componentType
// componentType: "MainProduct", "Comments", etc.
// audience: your weights object
// componentVariants: full list of variants
// options.productHandle: e.g. "electric-foil-shaver"
export function chooseVariantForComponent(
    componentType,
    audience,
    componentVariants,
    options = {}
) {
    const { productHandle, requireProductMatch = false } = options;

    // 1) Start with variants of the right component type
    let candidates = componentVariants.filter(
        v => v.componentType === componentType
    );
    if (!candidates.length) return null;

    // 2) If productHandle is provided, prefer variants that match it
    if (productHandle) {
        const handleMatches = candidates.filter(
            v => v.productHandle === productHandle
        );

        if (handleMatches.length > 0) {
            candidates = handleMatches;
        } else if (requireProductMatch) {
            // If you want to *only* allow product-specific variants, bail here
            return null;
        }
        // else: fall back to the generic candidates (no productHandle)
    }

    // 3) Score + pick best
    const best = candidates
        .map(v => ({ variant: v, score: scoreThing(v, audience) }))
        .sort((a, b) => b.score - a.score)[0];

    return best?.variant ?? null;
}

// build a "page plan" = ordered list of slots with chosen variants
export function assemblePage(layout, audience, componentVariants,context = {}) {
    return layout.slots.map(slot => {
        const variant = chooseVariantForComponent(
            slot.componentType,
            audience,
            componentVariants,
            { productHandle: context.productHandle }
        );

        return {
            slotId: slot.id,
            componentType: slot.componentType,
            variant,
            context
        };
    });
}

// ---------- render helpers (component templates) ----------

function renderHero(variant) {
    const heading = variant.heading ?? '';
    const body = variant.body ?? '';
    const imageCaption = variant.image ?? '[heroimage.png]';

    return `
    <section class="hero">
      <div class="hero-content">
        <h1>${heading}</h1>
        <p>${body}</p>
        <div class="hero-ctas">
          <a href="#specs" class="btn btn-primary">View Specs</a>
          <a href="#products" class="btn btn-secondary">See Products →</a>
        </div>
      </div>
      <div class="hero-image">
        ${imageCaption}
      </div>
    </section>
  `;
}

// Example: carousel component uses just captions instead of real images
function renderCarousel(variant) {
    // you can extend your variant schema with `items` later;
    // for now just show heading/body/image as placeholders.
    const heading = variant.heading ?? 'Recommended products';
    const body = variant.body ?? 'Carousel placeholder.';
    const imageCaption = variant.image ?? '[carousel-placeholder.png]';

    return `
    <section class="section carousel">
      <h2>${heading}</h2>
      <p>${body}</p>
      <div class="carousel-track">
        ${imageCaption}
      </div>
    </section>
  `;
}

// Example: graph component
function renderGraph(variant) {
    const heading = variant.heading ?? 'Performance Graph';
    const body = variant.body ?? 'Graph placeholder.';
    const imageCaption = variant.image ?? '[graph-placeholder.png]';

    return `
    <section class="section graph">
      <h2>${heading}</h2>
      <p>${body}</p>
      <pre class="graph-placeholder">${imageCaption}</pre>
    </section>
  `;
}

// Fallback template for any other component types
function renderGenericSection(variant) {
    const heading = variant.heading ?? variant.id;
    const body = variant.body ?? '';
    const imageCaption = variant.image ?? '';

    return `
    <section class="section generic">
      <h2>${heading}</h2>
      <p>${body}</p>
      ${imageCaption ? `<div class="generic-image">${imageCaption}</div>` : ''}
    </section>
  `;
}

// maps componentType -> render function
function renderComponent(componentType, variant) {
    if (!variant) {
        return `<!-- ${componentType}: no variant selected -->`;
    }
    if (variant.html) {
        return variant.html;
    }

    switch (componentType) {
        case 'Hero':
            return renderHero(variant);
        case 'Carousel':
            return renderCarousel(variant);
        case 'Graph':
            return renderGraph(variant);
        // You can add more: 'SpecsStrip', 'ProductGrid', etc.
        default:
            return renderGenericSection(variant);
    }
}

// ---------- main renderPageHtml ----------
import {navbarHTML} from "./global/navbar.js";
import {bevelHeadHtml} from "./global/head.js";
import {bevelFooterHtml} from "./global/head.js";

export function renderPageHtml(pagePlan, layout, audience,context = {}) {
    const slotsHtml = pagePlan
        .map(entry => {
            const { slotId, componentType, variant } = entry;
            return `
<!--        <div class="lumina-frame">   -->
        <!-- Slot: ${slotId}, Component: ${componentType}, Variant: ${variant?.id ?? 'none'} -->
        ${renderComponent(componentType, variant)}
<!--        </div>-->
      `;
        })
        .join('\n');

    // simple page shell + tiny debug block so you can see the decisions
    return `
    <!doctype html>
    <html>
      <head>
        ${bevelHeadHtml}
        <meta charset="utf-8" />
        <title>Lumina Demo – ${context.pageType === 'product'
        ? `${context.productHandle} – ${audience.id}`
        : audience.id
    }</title>

      </head>
      <style>
      /* Card container (mb-10 p-6 bg-gray-50 border border-gray-100 rounded-sm) */
.lumina-clinical-card {
  margin-bottom: 40px;              /* mb-10 (2.5rem) */
  padding: 24px;                    /* p-6 (1.5rem)   */
  background-color: #f9fafb;        /* bg-gray-50     */
  border: 1px solid #f3f4f6;        /* border-gray-100 */
  border-radius: 2px;               /* rounded-sm     */
}

/* Title (text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4) */
.lumina-clinical-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;            /* tracking-widest */
  color: #9ca3af;                   /* text-gray-400 */
  margin-bottom: 16px;              /* mb-4 (1rem) */
}

/* Stack of metrics (space-y-5) */
.lumina-metrics > .lumina-metric + .lumina-metric {
  margin-top: 20px;                 /* space-y-5 (~1.25rem) */
}

/* Metric header row (flex justify-between text-xs font-bold text-[#1c1c1c] mb-1) */
.lumina-metric-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;                  /* text-xs ~ 0.75rem */
  font-weight: 700;
  color: #1c1c1c;
  margin-bottom: 4px;               /* mb-1 (0.25rem) */
}

/* Progress bar track (h-1.5 w-full bg-gray-200 rounded-full overflow-hidden) */
.lumina-progress-track {
  height: 6px;                      /* h-1.5 (0.375rem) */
  width: 100%;
  background-color: #e5e7eb;        /* bg-gray-200 */
  border-radius: 9999px;            /* rounded-full */
  overflow: hidden;
}

/* Progress bar fill (h-full bg-[#1c1c1c]) */
.lumina-progress-fill {
  height: 100%;
  background-color: #1c1c1c;        /* bg-[#1c1c1c] */
}

/* Footer (mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-500 font-medium) */
.lumina-clinical-footer {
  margin-top: 16px;                 /* mt-4 */
  padding-top: 16px;                /* pt-4 */
  border-top: 1px solid #e5e7eb;    /* border-gray-200 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #6b7280;                   /* text-gray-500 */
  font-weight: 500;                 /* font-medium */
}
/* Section wrapper (py-12 bg-neutral-50 border-y border-gray-200) */
.lumina-badges-section {
  padding-top: 48px;                /* py-12 (3rem) */
  padding-bottom: 48px;
  background-color: #fafafa;        /* bg-neutral-50 */
  border-top: 1px solid #e5e7eb;    /* border-gray-200 */
  border-bottom: 1px solid #e5e7eb;
}

/* Inner container (mx-auto max-w-6xl px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center) */
.lumina-badges-row {
  margin-left: auto;
  margin-right: auto;
  max-width: 72rem;                 /* max-w-6xl */
  padding-left: 24px;               /* px-6 (1.5rem) */
  padding-right: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;                        /* gap-8 */
  text-align: center;
}

/* Larger gap on medium+ screens (md:gap-16) */
@media (min-width: 768px) {
  .lumina-badges-row {
    gap: 64px;                      /* gap-16 */
  }
}

/* Individual badge wrapper */
.lumina-badge {
  /* no extra styles required, but here if you want future tweaks */
}

/* Icon circle (w-12 h-12 mx-auto mb-3 rounded-full border border-gray-300 flex items-center justify-center text-xl) */
.lumina-badge-icon {
  width: 48px;                      /* w-12 (3rem) */
  height: 48px;                     /* h-12 */
  margin-left: auto;                /* mx-auto */
  margin-right: auto;
  margin-bottom: 12px;              /* mb-3 (0.75rem) */
  border-radius: 9999px;            /* rounded-full */
  border: 1px solid #d1d5db;        /* border-gray-300 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;                  /* text-xl-ish */
}

/* Label (text-[10px] font-bold uppercase tracking-widest text-gray-500) */
.lumina-badge-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;            /* tracking-widest */
  color: #6b7280;                   /* text-gray-500 */
}

</style>
  
      <body class="kaxsdc features--button-transition features--zoom-image color-scheme color-scheme--scheme-3"  >
        ${navbarHTML}
       
        ${slotsHtml}
        
        
        <div class="debug">
          Layout: <strong>${layout.id}</strong> (${layout.label ?? ''}) –
          Audience: <strong>${audience.id}</strong>
        </div>
         <!-- DEBUG: any button click bumps tag.sale by +4.0 -->
        <script>
          document.addEventListener('click', async (event) => {
            const btn = event.target.closest('button');
            if (!btn) return; // only react to button clicks

            // For now, hardcode: tag "sale" += 4.0
            const tag = 'sale';
            const delta = 4.0;

            try {
              const res = await fetch('/api/preferences/adjust-tag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag, delta }),
              });

              if (!res.ok) {
                console.error('Failed to update preferences', await res.text());
                return;
              }

              const data = await res.json();
              console.log('Updated weights (debug):', data.weights);

              // Optional: quick visual feedback
              btn.classList.add('lumina-button-ack');
              setTimeout(() => btn.classList.remove('lumina-button-ack'), 300);
            } catch (err) {
              console.error('Error updating preferences', err);
            }
          });
        </script>
      </body>
      ${bevelFooterHtml}
      
    </html>
  `;
}
