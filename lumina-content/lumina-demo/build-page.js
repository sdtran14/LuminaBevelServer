// main/buildPage.js
import { audiences } from './personas.js';
import { layouts } from './layouts.js';
import { componentVariants } from './components/index.js';
import { chooseLayout, assemblePage, renderPageHtml} from './scoring.js';

export function buildPage({
                              audienceId = 'promo_shopper',
                              pageType = 'landing',      // 'landing' | 'product'
                              productHandle = null,       // e.g. 'face-wash'
                              weightsOverride = null
                          }) {
    const baseAudience = audiences[audienceId];
    if (!baseAudience) {
        throw new Error(`Unknown audience "${audienceId}"`);
    }

    const audience = {
        ...baseAudience,
        weights: weightsOverride || baseAudience.weights
    };
    if (!audience) {
        throw new Error(`Unknown audience "${audienceId}"`);
    }

    // Filter layouts by pageType (you can store pageType on layouts)
    const candidateLayouts = layouts.filter(
        l => (l.pageType || 'landing') === pageType
    );
    if (!candidateLayouts.length) {
        throw new Error(`No layouts defined for pageType "${pageType}"`);
    }

    const layout = chooseLayout(candidateLayouts, audience);

    const context = { pageType, productHandle };

    // IMPORTANT: pass context so product pages can filter variants by handle
    const pagePlan = assemblePage(layout, audience, componentVariants, context);

    // Also pass context to renderer if it needs to know productHandle
    const html = renderPageHtml(pagePlan, layout, audience, context);

    return { html, audience, context };
}
