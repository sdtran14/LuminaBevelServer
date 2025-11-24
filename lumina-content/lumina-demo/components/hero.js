// components/hero.js

import fs from "fs";
import path from "path";

export const heroVariants = [
    // {
    //     id: 'hero_skin_lab',
    //     componentType: 'Hero',
    //     image: '[hero_skin_lab.png]',
    //     heading: 'Engineered for Healthier Skin.',
    //     body: 'Clinically optimized formulas for professionals who demand evidence.',
    //     tags: ['skin', 'specs', 'hydra_men', 'clinical'],
    //     goals: ['explain_product', 'show_evidence'],
    //     baseScore: 0.95
    // },
    {
        id: 'hero_clinical_blue',
        componentType: 'Hero',
        image: '[hero_clinical_blue.png]',
        heading: 'Clinical-Grade Skincare for Real Results.',
        body: 'pH-balanced, non-comedogenic, and tested on sensitive skin.',
        tags: ['skin', 'specs', 'ph', 'clinical'],
        goals: ['explain_product', 'show_evidence'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-clinical-hero.html'),
            'utf8'
        ),
        baseScore: 0.9
    },
    {
        id: 'hero_holiday_sale',
        componentType: 'Hero',
        image: '[hero_holiday_sale.png]',
        heading: '20% Off Sitewide.',
        body: 'Skip the rush, not the routine. Limited time holiday pricing.',
        tags: ['promo', 'sale', 'devices'],
        goals: ['promo'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-holiday-hero.html'),
            'utf8'
        ),
        baseScore: 0.9
    }
];
