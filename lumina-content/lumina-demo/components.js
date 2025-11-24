// components.js

export const componentVariants = [
    // ---------- HERO ----------

    {
        id: 'hero_skin_lab',
        componentType: 'Hero',
        image: '[hero_skin_lab.png]',
        heading: 'Engineered for Healthier Skin.',
        body: 'Clinically optimized formulas for professionals who demand evidence.',
        tags: ['skin', 'specs', 'hydra_men', 'clinical'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.95
    },
    {
        id: 'hero_clinical_blue',
        componentType: 'Hero',
        image: '[hero_clinical_blue.png]',
        heading: 'Clinical-Grade Skincare for Real Results.',
        body: 'pH-balanced, non-comedogenic, and tested on real sensitive skin.',
        tags: ['skin', 'specs', 'ph', 'clinical'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.9
    },
    {
        id: 'hero_holiday_sale',
        componentType: 'Hero',
        image: '[hero_holiday_sale.png]',
        heading: '20% Off Sitewide.',
        body: 'Skip the rush, not the routine. Limited time holiday pricing.',
        tags: ['promo', 'sale', 'devices', 'generic'],
        goals: ['promo'],
        baseScore: 0.9
    },
    {
        id: 'hero_device_trimmer',
        componentType: 'Hero',
        image: '[hero_device_trimmer.png]',
        heading: 'The World’s Most Advanced Trimmer.',
        body: 'Sharper lines, less irritation. Designed for daily use.',
        tags: ['devices', 'promo'],
        goals: ['promo', 'explain_product'],
        baseScore: 0.85
    },

    // ---------- SPECS STRIP ----------

    {
        id: 'specs_strip_hydra_men',
        componentType: 'SpecsStrip',
        image: '[specs_strip_hydra_men.png]',
        heading: 'Clinical Specs at a Glance',
        body: 'Hydra Men: pH 5.5, 5% Niacinamide, non-comedogenic, fragrance-free.',
        tags: ['skin', 'specs', 'ph', 'hydra_men'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.95
    },
    {
        id: 'specs_strip_generic_skin',
        componentType: 'SpecsStrip',
        image: '[specs_strip_generic_skin.png]',
        heading: 'Barrier-Friendly Formulas',
        body: 'All key products sit between pH 4.7–5.8 and are tested on sensitive skin.',
        tags: ['skin', 'specs', 'ph'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.85
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
    },

    // ---------- PRODUCT GRID ----------

    {
        id: 'product_grid_hydra_men_line',
        componentType: 'ProductGrid',
        image: '[product_grid_hydra_men_line.png]',
        heading: 'Hydra Men Lineup',
        body: 'Facial cream, cleanser, and exfoliating pads for barrier-first routines.',
        tags: ['skin', 'hydra_men'],
        goals: ['explain_product'],
        baseScore: 0.9
    },
    {
        id: 'product_grid_skin_only',
        componentType: 'ProductGrid',
        image: '[product_grid_skin_only.png]',
        heading: 'Skincare-Only Selection',
        body: 'Curated skin-focused products, no devices or accessories.',
        tags: ['skin'],
        goals: ['explain_product'],
        baseScore: 0.85
    },
    {
        id: 'product_grid_mixed_best_sellers',
        componentType: 'ProductGrid',
        image: '[product_grid_mixed_best_sellers.png]',
        heading: 'Best Sellers',
        body: 'Top-performing devices and skincare picked by our community.',
        tags: ['devices', 'skin', 'generic'],
        goals: ['promo', 'explain_product'],
        baseScore: 0.8
    },

    // ---------- INGREDIENT PANEL ----------

    {
        id: 'ingredient_panel_hydra_men',
        componentType: 'IngredientPanel',
        image: '[ingredient_panel_hydra_men.png]',
        heading: 'Ingredient Transparency',
        body: 'Niacinamide, beta-glucan, and glycerin work together for calm, hydrated skin.',
        tags: ['skin', 'ingredients', 'hydra_men'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.9
    },
    {
        id: 'ingredient_panel_actives',
        componentType: 'IngredientPanel',
        image: '[ingredient_panel_actives.png]',
        heading: 'Clinically Backed Actives',
        body: 'We prioritize evidence-backed actives over marketing filler.',
        tags: ['skin', 'ingredients'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.85
    },

    // ---------- GRAPH ----------

    {
        id: 'graph_ph_profile',
        componentType: 'Graph',
        image: '[graph_ph_profile.png]',
        heading: 'pH Profile vs Skin Barrier Range',
        body: 'Hydra Men formulas sit within the optimal range for barrier recovery.',
        tags: ['skin', 'ph', 'specs'],
        goals: ['show_evidence'],
        baseScore: 0.9
    },
    {
        id: 'graph_hydration_gain',
        componentType: 'Graph',
        image: '[graph_hydration_gain.png]',
        heading: 'Hydration Gain Over 24 Hours',
        body: 'Measured increase in skin hydration compared to untreated control.',
        tags: ['skin', 'specs'],
        goals: ['show_evidence'],
        baseScore: 0.85
    },

    // ---------- CAROUSEL ----------

    {
        id: 'carousel_skin_suite',
        componentType: 'Carousel',
        image: '[carousel_skin_suite.png]',
        heading: 'Recommended Skincare Set',
        body: 'Hydra Men products most often combined by professionals.',
        tags: ['skin', 'hydra_men'],
        goals: ['promo', 'explain_product'],
        baseScore: 0.85
    },
    {
        id: 'carousel_mixed_best_sellers',
        componentType: 'Carousel',
        image: '[carousel_mixed_best_sellers.png]',
        heading: 'Best Sellers',
        body: 'Devices, skincare, and accessories in a single sliding view.',
        tags: ['devices', 'skin', 'generic'],
        goals: ['promo'],
        baseScore: 0.8
    },

    // ---------- PROMO STRIP ----------

    {
        id: 'promo_strip_sale',
        componentType: 'PromoStrip',
        image: '[promo_strip_sale.png]',
        heading: 'Limited-Time Offer',
        body: '20% off sitewide with code GLOW20.',
        tags: ['promo', 'sale'],
        goals: ['promo'],
        baseScore: 0.9
    },
    {
        id: 'promo_strip_skin_focus',
        componentType: 'PromoStrip',
        image: '[promo_strip_skin_focus.png]',
        heading: 'Hydra Men Intro Offer',
        body: 'Free shipping on all Hydra Men orders over $40.',
        tags: ['promo', 'skin', 'hydra_men'],
        goals: ['promo'],
        baseScore: 0.85
    },

    // ---------- TESTIMONIALS ----------

    {
        id: 'testimonials_skin_pros',
        componentType: 'Testimonials',
        image: '[testimonials_skin_pros.png]',
        heading: 'What Skincare Pros Say',
        body: '“Hydra Men has become a staple for my sensitive-skin clients.”',
        tags: ['skin', 'testimonials'],
        goals: ['social_proof'],
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
    }
];
