// components/productGrid.js

import fs from "fs";
import path from "path";

export const productGridVariants = [
    {
        id: 'product_grid_hydra_men_line',
        componentType: 'ProductGrid',
        image: '[product_grid_hydra_men_line.png]',
        heading: 'Hydra Men Lineup',
        body: 'Facial cream, cleanser, and exfoliating pads designed for sensitive and congested skin.',
        tags: ['skin', 'hydra_men', 'specs'],
        goals: ['explain_product'],
        baseScore: 0.9
    },
    {
        id: 'product_grid_skin_only',
        componentType: 'ProductGrid',
        image: '[product_grid_skin_only.png]',
        heading: 'Skincare-Only Selection',
        body: 'A curated set of barrier-friendly skincare products with no devices.',
        tags: ['skin'],
        goals: ['explain_product'],
        baseScore: 0.85
    },
    {
        id: 'product_grid_mixed_best_sellers',
        componentType: 'ProductGrid',
        image: '[product_grid_mixed_best_sellers.png]',
        heading: 'Best Sellers',
        body: 'Top-performing devices and skincare products chosen by our community.',
        tags: ['devices', 'skin', 'generic'],
        goals: ['promo', 'explain_product'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-promo-grid.html'),
            'utf8'
        ),
        baseScore: 0.8
    }
];
