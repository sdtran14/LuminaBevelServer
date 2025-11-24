// components/specsStrip.js

import fs from "fs";
import path from "path";

export const specsStripVariants = [
    {
        id: 'specs_strip_hydra_men',
        componentType: 'SpecsStrip',
        image: '[specs_strip_hydra_men.png]',
        heading: 'Clinical Specs at a Glance',
        body: 'Hydra Men: pH 5.5, 5% Niacinamide, non-comedogenic, fragrance-free.',
        tags: ['skin', 'specs', 'ph', 'hydra_men'],
        goals: ['explain_product', 'show_evidence'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-clinical-specs.html'),
            'utf8'
        ),
        baseScore: 0.95
    },
    {
        id: 'specs_strip_devices',
        componentType: 'SpecsStrip',
        image: '[specs_strip_devices.png]',
        heading: 'Device Performance Stats',
        body: 'Battery life, blade sharpness, and waterproof ratings at a glance.',
        tags: ['devices', 'specs'],
        goals: ['explain_product'],
        baseScore: 0.7
    }
];
