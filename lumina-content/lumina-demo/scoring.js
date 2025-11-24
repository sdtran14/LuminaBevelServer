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
      
    </html>
  `;
}
