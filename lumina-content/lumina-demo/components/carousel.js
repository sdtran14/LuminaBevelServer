// components/carousel.js

import fs from "fs";
import path from "path";

export const carouselVariants = [
    {
        id: 'carousel_skin_suite',
        componentType: 'Carousel',
        image: '[carousel_skin_suite.png]',
        heading: 'Recommended Skincare Routine',
        body: 'Professionally curated Hydra Men essentials designed to work together.',
        tags: ['skin', 'hydra_men'],
        goals: ['explain_product'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-carousel-skincare.html'),
            'utf8'
        ),
        baseScore: 0.85
    },
    {
        id: 'carousel_mixed_best_sellers',
        componentType: 'Carousel',
        image: '[carousel_mixed_best_sellers.png]',
        heading: 'Best Sellers',
        body: 'Top devices, skincare, and accessories all in one carousel.',
        tags: ['devices', 'skin', 'generic'],
        goals: ['explain_product'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-carousel.html'),
            'utf8'
        ),
        baseScore: 0.8
    },
    {
        id: 'carousel_promo',
        componentType: 'Carousel',
        image: '[carousel_mixed_best_sellers.png]',
        heading: 'Best Sellers',
        body: 'Top devices, skincare, and accessories all in one carousel.',
        tags: ['devices', 'skin', 'generic'],
        goals: ['promo'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-promo-grid.html'),
            'utf8'
        ),
        baseScore: 0.8
    },
    // {
    //     id: 'carousel_device_line',
    //     componentType: 'Carousel',
    //     image: '[carousel_device_line.png]',
    //     heading: 'Grooming Essentials',
    //     body: 'Trimmers, blades, guards, and device accessories.',
    //     tags: ['devices'],
    //     goals: ['promo', 'explain_product'],
    //     baseScore: 0.78
    // }
];
