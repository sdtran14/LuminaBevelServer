// personas.js

export const audiences = {
    skincare_expert: {
        id: 'skincare_expert',
        description: 'Derms, estheticians, advanced skincare hobbyists',
        weights: {
            tag: {
                skin: 3.0,
                specs: 2.5,
                ph: 2.0,
                ingredients: 2.0,
                hydra_men: 1.5,
                devices: -3.0,
                promo: -0.5,
                sale: -1.0,
                testimonials: 0.5,
                generic: 0.0
            },
            goal: {
                explain_product: 2.5,
                show_evidence: 2.0,
                promo: -0.5,
                social_proof: 0.5
            }
        }
    },

    promo_shopper: {
        id: 'promo_shopper',
        description: 'General shopper responding to discounts and bundles',
        weights: {
            tag: {
                skin: 0.5,
                specs: 0.2,
                ph: 0.1,
                ingredients: 0.1,
                hydra_men: 0.5,
                devices: 2.0,
                promo: 3.0,
                sale: 3.0,
                testimonials: 1.0,
                generic: 0.5
            },
            goal: {
                explain_product: 0.5,
                show_evidence: 0.2,
                promo: 2.5,
                social_proof: 1.5
            }
        }
    },

    device_grooming_fan: {
        id: 'device_grooming_fan',
        description: 'Cares about trimmers, shave devices, prices',
        weights: {
            tag: {
                skin: 0.2,
                specs: 0.2,
                ph: 0.0,
                ingredients: 0.0,
                hydra_men: 0.3,
                devices: 3.0,
                promo: 2.0,
                sale: 1.5,
                testimonials: 1.0,
                generic: 0.5
            },
            goal: {
                explain_product: 0.8,
                show_evidence: 0.3,
                promo: 2.0,
                social_proof: 1.0
            }
        }
    }
};
