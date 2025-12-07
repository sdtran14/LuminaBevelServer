import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

function annotateFooterHtml(html) {
    if (!html) return html;
    const $ = cheerio.load(html);

    // Client-side tagger for late-inserted promo/teaser elements (e.g., Klaviyo popup)
    const clientTagger = `
    <script>
    (function(){
      const selectors = [
        'needsclick.kl-private-reset-css-Xuajs1',
        '.needsclick.Teaser-pointer-Hn1zd.kl-private-reset-css-Xuajs1',
        '.needsclick.kl-teaser-QSGcAn.kl-private-reset-css-Xuajs1',
        '.needsclick.go300628013',
        '[data-testid="animated-teaser"]',
        '.kl-teaser-QSGcAn'
      ];

      function tag(root) {
        if (typeof document === 'undefined') return;
        const base = root || document;
        if (!base.querySelectorAll) return;
        const nodes = base.querySelectorAll(selectors.join(','));
        if (nodes.length) console.log('[Lumina][footer-tagDynamic] tagged nodes:', nodes.length);
        nodes.forEach(node => {
          node.setAttribute('data-lumina-tag', 'promo,sale');
          node.setAttribute('data-lumina-goal', 'promo');
        });
      }

      if (typeof document !== 'undefined') {
        tag(document);
        const mo = new MutationObserver((mutations) => {
          mutations.forEach(m => {
            m.addedNodes.forEach(n => {
              if (n.nodeType !== 1) return;
              tag(n);
            });
          });
        });
        mo.observe(document.body, { childList: true, subtree: true });
      }
    })();
    </script>`;

    // Return annotated footer plus client-side tagger
    return $.root().html() + clientTagger;
}

const bevelHeadPath = path.join(process.cwd(), 'global', 'bevel-head.html');
const bevelFooterPath = path.join(process.cwd(), 'global', 'bevel-footer.html');

export const bevelHeadHtml = fs.readFileSync(bevelHeadPath, 'utf8');
export const bevelFooterHtml = annotateFooterHtml(
    fs.readFileSync(bevelFooterPath, 'utf8')
);
