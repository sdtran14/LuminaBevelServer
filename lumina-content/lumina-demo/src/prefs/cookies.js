// src/prefs/cookies.js
import { DEFAULT_WEIGHTS } from './weights.js';

const COOKIE_NAME = 'luminaWeights';
const LUMINA_BOOT_ID = Date.now().toString(); // changes every server start

export function getUserWeightsFromCookies(req) {
    try {
        const raw = req.cookies?.[COOKIE_NAME];
        if (!raw) return DEFAULT_WEIGHTS;

        const parsed = JSON.parse(raw);

        // If cookie is from an older server run, ignore it
        if (parsed._bootId !== LUMINA_BOOT_ID) {
            return DEFAULT_WEIGHTS;
        }

        // Very light sanity check
        if (!parsed.tag || !parsed.goal) return DEFAULT_WEIGHTS;

        // Strip internal field before returning
        const { _bootId, ...weights } = parsed;
        return weights;
    } catch (e) {
        return DEFAULT_WEIGHTS;
    }
}

export function setUserWeightsCookie(res, weights) {
    // Attach current boot ID so we can invalidate on next restart
    const payload = {
        ...weights,
        _bootId: LUMINA_BOOT_ID
    };

    const value = JSON.stringify(payload);

    res.cookie(COOKIE_NAME, value, {
        httpOnly: false,      // set true if you don’t need JS in browser
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });
}
export function bumpPromoWeightsForUser(req, res) {
    // Start from cookie weights, or default persona if none
    const base = getUserWeightsFromCookies(req) || DEFAULT_WEIGHTS || { tag: {}, goal: {} };

    const currentTag = base.tag || {};
    const currentGoal = base.goal || {};

    const updated = {
        tag: {
            ...currentTag,
            // Nudge toward promo shopper behavior
            sale: (currentTag.sale ?? -1.0) + 4.0,   // was -1.0 in your example, becomes +3.0
            promo: (currentTag.promo ?? -0.5) + 3.0, // tilt harder toward promos
        },
        goal: {
            ...currentGoal,
            promo: (currentGoal.promo ?? -0.5) + 3.0,
            social_proof: (currentGoal.social_proof ?? 0.5) + 1.0
        }
    };

    setUserWeightsCookie(res, updated);
    return updated;
}