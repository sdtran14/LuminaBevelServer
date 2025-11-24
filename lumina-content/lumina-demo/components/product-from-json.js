// product-from-json.js
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";

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
            tags: ['product', handle, componentType],
            goals: ['explain_product'],

            // the real Shopify markup from the JSON
            html: comp.html,

            baseScore: 0.9
        });
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