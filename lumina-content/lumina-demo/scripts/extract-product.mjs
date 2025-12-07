// scripts/extract-product.mjs
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const args = process.argv.slice(2);
const liveFlag = args.includes('--live');
const productHandle = args.find(a => !a.startsWith('--')); // e.g. "face-wash" or full URL
if (!productHandle) {
    console.error('Usage: node scripts/extract-product.mjs <product-handle-or-url> [--live]');
    process.exit(1);
}

async function fetchHtmlWithPuppeteer(url) {
    const timeoutMs = Number(process.env.PUPPETEER_TIMEOUT_MS) || 45000;
    const extraWaitMs = Number(process.env.PUPPETEER_EXTRA_WAIT_MS) || 10000;
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
        if (extraWaitMs > 0) {
            await new Promise(res => setTimeout(res, extraWaitMs));
        }

        // Inline shadow-root content so it survives serialization
        await page.evaluate(() => {
            document.querySelectorAll('shadow-content').forEach(el => {
                const parent = el.parentElement;
                if (!parent) return;
                parent.insertAdjacentHTML('beforeend', el.innerHTML);
            });
            document.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot && el.shadowRoot.innerHTML) {
                    const container = document.createElement('div');
                    container.setAttribute('data-lumina-shadow-host', el.tagName.toLowerCase());
                    container.innerHTML = el.shadowRoot.innerHTML;
                    el.appendChild(container);
                }
            });
        });

        // Make hidden tab content (e.g., Ingredients) visible for capture and flatten custom tabs
        await page.evaluate(() => {
            document.querySelectorAll('[slot="content"]').forEach(el => {
                el.removeAttribute('hidden');
                el.style.display = 'block';
                el.style.visibility = 'visible';
            });
            document.querySelectorAll('x-tabs, x-accordion').forEach(host => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = host.innerHTML;
                wrapper.querySelectorAll('[slot]').forEach(n => n.removeAttribute('slot'));
                host.replaceWith(wrapper);
            });
        });

        const content = await page.evaluate(() => document.documentElement.outerHTML);
        return content;
    } finally {
        await browser.close();
    }
}

async function loadHtml() {
    if (liveFlag) {
        const base = process.env.PRODUCT_BASE_URL || 'https://getbevel.com/products';
        const url = productHandle.startsWith('http')
            ? productHandle
            : `${base}/${productHandle}`;
        console.log(`[extract] Fetching live page: ${url}`);
        return await fetchHtmlWithPuppeteer(url);
    }

    const htmlPath = path.join(process.cwd(), 'bevel_src', 'products', `${productHandle}.html`);
    console.log(`[extract] Reading local file: ${htmlPath}`);
    return fs.readFileSync(htmlPath, 'utf8');
}

const rawHtml = await loadHtml();
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
