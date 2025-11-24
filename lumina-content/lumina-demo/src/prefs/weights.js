// src/prefs/weights.js
import {getUserWeightsFromCookies, setUserWeightsCookie} from "./cookies.js";

export const DEFAULT_WEIGHTS = {
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
};

export function adjustTagWeight(req, res, tagName, delta) {
    // 1. Load current cookie weights (or default structure if missing)
    const current = getUserWeightsFromCookies(req) || {
        tag: {},
        goal: {}
    };

    // 2. Ensure tag object exists
    if (!current.tag) current.tag = {};

    // 3. Initialize missing tag to 0
    const prev = typeof current.tag[tagName] === 'number'
        ? current.tag[tagName]
        : 0;

    // 4. Apply delta
    const updated = prev + delta;

    // 5. Save it back
    current.tag[tagName] = updated;
    setUserWeightsCookie(res, current);

    return current;
}
