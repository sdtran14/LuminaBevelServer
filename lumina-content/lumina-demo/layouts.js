// layouts.js

export const layouts = [
    {
        id: 'layout_specs_first',
        label: 'Specs-first skincare layout',
        slots: [
            { id: 'hero',   componentType: 'Hero' },
            { id: 'slot_2', componentType: 'Carousel' },
            { id: 'slot_3', componentType: 'IngredientPanel' },
            { id: 'slot_1', componentType: 'SpecsStrip' },
            { id: 'slot_5', componentType: 'Testimonials' }
        ],
        tags: ['skin', 'specs_first'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.9
    },

    {
        id: 'layout_promo_first',
        label: 'Promo-first layout',
        slots: [
            { id: 'hero',   componentType: 'Hero' },
            { id: 'slot_2', componentType: 'Carousel' },
            { id: 'slot_1', componentType: 'PromoStrip' },
            { id: 'slot_4', componentType: 'Testimonials' }
        ],
        tags: ['promo', 'sale_first'],
        goals: ['promo'],
        baseScore: 0.9
    },

    {
        id: 'layout_balanced',
        label: 'Balanced layout (some specs, some promo)',
        slots: [
            { id: 'hero',   componentType: 'Hero' },
            { id: 'slot_1', componentType: 'ProductGrid' },
            { id: 'slot_2', componentType: 'SpecsStrip' },
            { id: 'slot_3', componentType: 'Carousel' },
            { id: 'slot_4', componentType: 'Testimonials' }
        ],
        tags: ['generic'],
        goals: ['explain_product', 'promo'],
        baseScore: 0.75
    },
    {
        id: 'product_page_layout',
        pageType: 'product',
        slots: [
            { id: 'product_hero', componentType: 'MainProduct' },
            { id: 'product_details', componentType: 'RelatedProducts' },
            { id: 'product_specs', componentType: 'Comments' }
        ],
        tags: ['generic'],
        goals: ['explain_product', 'promo'],
        baseScore: 0.75
    },
    {
        id: 'product_page_layout_skincare',
        pageType: 'product',
        slots: [
            { id: 'product_hero', componentType: 'MainProduct' },
            { id: 'product_ingredients', componentType: 'ProductIngredientPanel' },
            { id: 'product_details', componentType: 'RelatedProducts' },
            { id: 'product_specs', componentType: 'Comments' }
        ],
        tags: ['skin'],
        goals: ['explain_product', 'promo'],
        baseScore: 0.75
    }

];
