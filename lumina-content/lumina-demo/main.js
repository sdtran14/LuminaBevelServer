// main.js
import fs from 'fs';
import path from 'path';
import { audiences } from './personas.js';
import { layouts } from './layouts.js';
import { componentVariants } from './components/index.js';
import {
    chooseLayout,
    assemblePage,
    renderPageHtml
} from './scoring.js';

function buildPageForAudience(audienceId) {
    const audience = audiences[audienceId];
    if (!audience) {
        throw new Error(`Unknown audience "${audienceId}"`);
    }
    const layout = chooseLayout(layouts, audience);
    const pagePlan = assemblePage(layout, audience, componentVariants);
    const html = renderPageHtml(pagePlan, layout, audience);

    return { html, audience };
}

const audienceId = process.argv[2] || 'skincare_expert';
const { html, audience } = buildPageForAudience(audienceId);

const outDir = path.join(process.cwd(), 'dist');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `page-${audience.id}.html`);
fs.writeFileSync(outPath, html, 'utf8');

console.log(`Built ${outPath}`);
