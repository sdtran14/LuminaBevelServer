// product-from-json.js
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
import * as cheerio from 'cheerio';


/**
 * Given a single product page JSON object (handle + components with html),
 * return an array of componentVariants for that product.
 *
 * Example input shape:
 * {
 *   handle: "face-wash",
 *   components: {
 *     MainProduct: { componentType: "MainProduct", html: "<section>...</section>" },
 *     RelatedProducts: { componentType: "RelatedProducts", html: "<section>...</section>" },
 *     Comments: { componentType: "Comments", html: "<section>...</section>" }
 *   }
 * }
 */
export function buildProductVariantsFromPageJson(pageJson) {
    const { handle, components } = pageJson;
    if (!handle || !components) return [];

    const variants = [];

    for (const [slotKey, comp] of Object.entries(components)) {
        if (!comp || !comp.html) continue;

        const componentType = comp.componentType || slotKey;

        variants.push({
            // e.g. "face-wash-MainProduct"
            id: `${handle}-${slotKey}`,

            // helps you filter later when assembling a product page
            productHandle: handle,

            componentType,            // "MainProduct" | "RelatedProducts" | "Comments"

            // optional fields — you can make these smarter later if you want
            image: `[${handle}_${slotKey}.png]`,
            heading: comp.heading || `${handle} – ${slotKey}`,
            body: comp.body || `${componentType} content for ${handle}`,
            tags: ['product', handle, componentType, 'promo'],
            goals: ['explain_product', 'promo'],

            // the real Shopify markup from the JSON
            html: comp.html,

            baseScore: 0.9
        });
        // --- 2) If this is MainProduct, add an alternate variant by modifying the HTML ---
        if (componentType === 'MainProduct') {
            const modifiedHtml = buildAlternateMainProductHtml(comp.html, handle, slotKey);

            variants.push({
                id: `${handle}-${slotKey}-alt`,  // e.g. "face-wash-MainProduct-alt"
                productHandle: handle,
                componentType,
                image: `[${handle}_${slotKey}_alt.png]`,
                heading: comp.heading || `${handle} – ${slotKey} (alt)`,
                body: comp.body || `${componentType} alt content for ${handle}`,
                tags: ['product', handle, componentType, 'skin'],
                goals: ['explain_product'], // maybe more promo-oriented
                html: modifiedHtml,
                baseScore: 0.85, // a bit lower/higher depending on how you want it to compete
            });
        }
    }

    return variants;
}


// Directory containing all product JSONs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCT_DATA_DIR = path.join(
    process.cwd(),
    'src',
    'product-data'
);

// Read all .json files and build variants
function loadAllProductVariants() {
    const files = fs.readdirSync(PRODUCT_DATA_DIR);
    const allVariants = [];
    const variantsByHandle = {};

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const handle = file.replace(/\.json$/, ''); // "face-wash.json" -> "face-wash"
        const jsonPath = path.join(PRODUCT_DATA_DIR, file);
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const pageJson = JSON.parse(raw);

        const variants = buildProductVariantsFromPageJson(pageJson);

        allVariants.push(...variants);
        variantsByHandle[handle] = variants;
    }

    return { allVariants, variantsByHandle };
}

const { allVariants, variantsByHandle } = loadAllProductVariants();

export const productVariants = allVariants;            // flat list of all product variants
export const productVariantsByHandle = variantsByHandle; // map: handle -> [variants]

export function buildAlternateMainProductHtml(originalHtml, handle, slotKey) {
    const $ = cheerio.load(originalHtml);

    // 1) Remove recurring sub-container inside rc-selection__root
    //$('.rc-purchase-option rc-purchase-option__subscription .rc-purchase-option__sub-container').remove();
    $('.product-info__block-item[data-block-type="payment-terms"]').remove();
    $('.product-info__block-item[data-block-type="text"]').remove();
    $('.product-info__block-item[data-block-type="@app"]').remove();


    const injectedHtml = `
    <div class="lumina-clinical-card">
  <h4 class="lumina-clinical-title">Clinical Performance</h4>

  <div class="lumina-metrics">
    <!-- Metric 1 -->
    <div class="lumina-metric">
      <div class="lumina-metric-header">
        <span>Reduction in Razor Bumps</span>
        <span>94%</span>
      </div>
      <div class="lumina-progress-track">
        <div class="lumina-progress-fill" style="width: 94%;"></div>
      </div>
    </div>

    <!-- Metric 2 -->
    <div class="lumina-metric">
      <div class="lumina-metric-header">
        <span>Texture Improvement</span>
        <span>88%</span>
      </div>
      <div class="lumina-progress-track">
        <div class="lumina-progress-fill" style="width: 88%;"></div>
      </div>
    </div>
  </div>

  <div class="lumina-clinical-footer">
    <span>n=150 Participants</span>
    <span>4-Week Study</span>
  </div>
</div>
  `;

    // 2) Inject custom content under .safe-sticky .product-info
    const blockList = $('safe-sticky .product-info__block-list').first();
    if (!blockList || blockList.length === 0) {
        console.warn(`[${handle}/${slotKey}] product-info__block-list not found, appending at end of body`);
        $('body').append(injectedHtml);
        return $.root().html();
    }

    // Element children (ignores text nodes/whitespace)
    const children = blockList.children();
    const insertIndex = 3; // 0-based → 4th element

    if (children.length <= insertIndex) {
        // If there are fewer than 4 children, just append at the end
        blockList.append(injectedHtml);
    } else {
        // Insert *before* the existing child at index 3
        children.eq(insertIndex).before(injectedHtml);
    }

    const emoji_bar_html = `
    <section class="lumina-badges-section">
  <div class="lumina-badges-row">
    <div class="lumina-badge">
      <div class="lumina-badge-icon">⚗️</div>
      <p class="lumina-badge-label">Paraben Free</p>
    </div>

    <div class="lumina-badge">
      <div class="lumina-badge-icon">🧬</div>
      <p class="lumina-badge-label">Sulfate Free</p>
    </div>

    <div class="lumina-badge">
      <div class="lumina-badge-icon">🔬</div>
      <p class="lumina-badge-label">Clinically Tested</p>
    </div>

    <div class="lumina-badge">
      <div class="lumina-badge-icon">🐇</div>
      <p class="lumina-badge-label">Cruelty Free</p>
    </div>
  </div>
</section>
    `;

    $('body').append(emoji_bar_html);
    // Return full HTML for the component (not the whole page)
    return $.root().html();
}
