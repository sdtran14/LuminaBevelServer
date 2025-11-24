#!/usr/bin/env node
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 1) Path to your homepage snapshot HTML
const SNAPSHOT_PATH = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'lumina-content',
    'snapshots',
    'getbevel.com',
    'https:getbevel.com.html'
);

// 2) Where product HTML should be stored for the extract script
const PRODUCTS_DIR = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'lumina-content',
    'lumina-demo',
    'bevel_src',
    'products'
);

// 3) Your existing single-product extractor
const EXTRACT_SCRIPT = path.join(__dirname, 'extract-product.mjs');

// Base URL for live product pages
const PRODUCT_BASE_URL = 'https://getbevel.com/products';


import puppeteer from 'puppeteer';


export async function fetchRenderedHtmlForHandle(handle) {
    const url = `${PRODUCT_BASE_URL}/${handle}`;
    console.log(`🌐 Puppeteer: loading ${url}`);

    const browser = await puppeteer.launch({
        headless: true, // "new" can be finicky; true is fine for now
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });

    try {
        const page = await browser.newPage();

        // Loosen the wait condition – networkidle2 can hang forever on trackers
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 45_000, // 45s hard timeout so it can't hang silently
        });

        console.log(`✅ Puppeteer: page loaded for ${url}`);


        // Try to wait for related products – but don't die if it's not there
        try {
            console.log(`⏳ Puppeteer: waiting for related products selector on ${handle}`);
            await page.waitForSelector(
                '.shopify-section.shopify-section--related-products',
                { timeout: 5000 }
            );
            console.log(`✅ Puppeteer: related products section detected for ${handle}`);
        } catch (err) {
            console.warn(`⚠️ Puppeteer: related products selector not found for ${handle}:`, err.message);
            // We still continue – we just won't have that section populated
        }

        const html = await page.content();
        console.log(`💾 Puppeteer: captured HTML for ${handle} (length: ${html.length})`);
        return html;
    } catch (err) {
        console.error(`❌ Puppeteer: failed to load ${url}:`, err);
        throw err;
    } finally {
        await browser.close().catch(() => {});
    }
}

async function main() {
    console.log('📄 Reading snapshot:', SNAPSHOT_PATH);
    const snapshotHtml = await readFile(SNAPSHOT_PATH, 'utf8');

    // Find href="/products/handle" patterns
    const productHrefRegex = /href=["']\/products\/([^"'\s?#>]+)["']/g;

    const handlesSet = new Set();
    let match;

    while ((match = productHrefRegex.exec(snapshotHtml)) !== null) {
        const raw = match[1]; // e.g. "electric-foil-shaver?ref=xyz"
        const handle = raw.split(/[?#]/)[0]; // strip ?query and #hash
        if (handle) handlesSet.add(handle);
    }

    const handles = [...handlesSet];

    if (handles.length === 0) {
        console.error('❌ No product links found in snapshot.');
        process.exit(1);
    }

    console.log('🧾 Found product handles:');
    handles.forEach(h => console.log('  -', h));

    // Ensure products directory exists
    await mkdir(PRODUCTS_DIR, { recursive: true });

    for (const handle of handles) {
        await fetchSaveAndExtract(handle);
    }

    console.log('\n✅ Done fetching and extracting all products.');
}

async function fetchSaveAndExtract(handle) {
    const destPath = path.join(PRODUCTS_DIR, `${handle}.html`);

    const html = await fetchRenderedHtmlForHandle(handle);

    console.log(`💾 Saving HTML to ${destPath}`);
    await writeFile(destPath, html, 'utf8');

    // Run your existing extract script
    await runExtract(handle);

    // Delete the HTML after extraction
    console.log(`🧹 Deleting temporary HTML: ${destPath}`);
    await unlink(destPath).catch(err => {
        console.warn(`⚠️ Could not delete ${destPath}:`, err.message);
    });
}

function runExtract(handle) {
    return new Promise((resolve, reject) => {
        console.log(`▶️  Extracting product JSON for: ${handle}`);
        const child = spawn(process.execPath, [EXTRACT_SCRIPT, handle], {
            stdio: 'inherit',
        });

        child.on('exit', (code) => {
            if (code === 0) {
                console.log(`✅ extract-product.mjs finished for: ${handle}`);
                resolve();
            } else {
                console.error(`❌ extract-product.mjs failed for ${handle} (exit code ${code})`);
                reject(new Error(`extract-product failed for ${handle}`));
            }
        });

        child.on('error', (err) => {
            console.error(`❌ Error running extract-product for ${handle}`, err);
            reject(err);
        });
    });
}

main().catch((err) => {
    console.error('❌ fetch-and-extract-all-products failed:', err);
    process.exit(1);
});
