// components/promoStrip.js

import fs from "fs";
import path from "path";

export const promoStripVariants = [
    {
        id: 'promo_strip_sale',
        componentType: 'PromoStrip',
        image: '[promo_strip_sale.png]',
        heading: 'Limited-Time Offer',
        body: '20% off sitewide with code GLOW20.',
        tags: ['promo', 'sale'],
        goals: ['promo'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-limited-sale.html'),
            'utf8'
        ),
        baseScore: 0.9
    },
    {
        id: 'promo_strip_hydra_men',
        componentType: 'PromoStrip',
        image: '[promo_strip_hydra_men.png]',
        heading: 'Hydra Men Intro Deal',
        body: 'Free shipping on all Hydra Men orders over $40.',
        tags: ['promo', 'skin', 'hydra_men'],
        goals: ['promo'],
        baseScore: 0.85
    }
];
