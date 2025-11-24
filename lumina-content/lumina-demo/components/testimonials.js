// components/testimonials.js

import fs from "fs";
import path from "path";

export const testimonialVariants = [
    {
        id: 'testimonials_skin_pros',
        componentType: 'Testimonials',
        image: '[testimonials_skin_pros.png]',
        heading: 'What Skincare Experts Say',
        body: '“Hydra Men has become a staple recommendation for sensitive-skin clients.”',
        tags: ['skin', 'testimonials'],
        goals: ['social_proof'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-skincare-approved.html'),
            'utf8'
        ),
        baseScore: 0.85
    },
    {
        id: 'testimonials_devices',
        componentType: 'Testimonials',
        image: '[testimonials_devices.png]',
        heading: 'What Grooming Customers Say',
        body: '“Best trimmer I’ve ever owned. Smooth and irritation-free.”',
        tags: ['devices', 'testimonials'],
        goals: ['social_proof'],
        baseScore: 0.8
    },
    {
        id: 'testimonials_mixed',
        componentType: 'Testimonials',
        image: '[testimonials_mixed.png]',
        heading: 'Loved by Our Community',
        body: 'Real stories from customers who trust our products daily.',
        tags: ['generic', 'testimonials'],
        goals: ['social_proof'],
        baseScore: 0.75
    }
];
