// scripts/extract-product.mjs
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const productHandle = process.argv[2]; // e.g. "face-wash"
if (!productHandle) {
    console.error('Usage: node scripts/extract-product.mjs <product-handle>');
    process.exit(1);
}

const htmlPath = path.join(process.cwd(), 'bevel_src', 'products', `${productHandle}.html`);
const rawHtml = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(rawHtml);

/**
 * Helpers: find sections by class/selector.
 * Adjust these selectors to match your theme if needed.
 */
function getHtml(selector) {
    const el = $(selector).first();
    return el.length ? $.html(el) : '';
}

// Main product section
const mainProductHtml = getHtml('.shopify-section.shopify-section--main-product');

// Related products / recommendations (guessing typical classes – tweak as needed)
const relatedHtml =
    getHtml('.shopify-section.shopify-section--related-products');

// Comments / reviews (again, tweak if your theme uses different markup)
const commentsHtml =
    getHtml('.shopify-section.shopify-section--apps') ||
    getHtml('.shopify-section--reviews') ||
    getHtml('.shopify-section.shopify-section--comments');

const productJson = {
    handle: productHandle,
    components: {
        MainProduct: {
            componentType: 'MainProduct',
            html: mainProductHtml
        },
        RelatedProducts: {
            componentType: 'RelatedProducts',
            html: relatedHtml
        },
        Comments: {
            componentType: 'Comments',
            html: commentsHtml
        }
    }
};

const outDir = path.join(process.cwd(), 'src', 'product-data');
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, `${productHandle}.json`);
fs.writeFileSync(outPath, JSON.stringify(productJson, null, 2), 'utf8');

console.log(`✅ Wrote ${outPath}`);
