// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { buildPage } from './build-page.js';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import {bumpPromoWeightsForUser, getUserWeightsFromCookies, setUserWeightsCookie} from './src/prefs/cookies.js';
import {adjustTagWeight, DEFAULT_WEIGHTS} from "./src/prefs/weights.js";
import {renderPageHtml} from "./scoring.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(bodyParser.json());

app.post('/api/preferences', (req, res) => {
    const weights = req.body?.weights;

    if (!weights || !weights.tag || !weights.goal) {
        return res.status(400).json({ error: 'Invalid weights payload' });
    }

    setUserWeightsCookie(res, weights);
    return res.json({ ok: true });
});

app.post('/api/preferences/adjust-tag', (req, res) => {
    const { tag, delta } = req.body;

    if (!tag || typeof delta !== 'number') {
        return res.status(400).json({ error: 'tag and delta are required' });
    }

    const updated = adjustTagWeight(req, res, tag, delta);
    return res.json({ ok: true, weights: updated });
});

app.get('/api/preferences', (req, res) => {
    try {
        const weights = getUserWeightsFromCookies(req) || DEFAULT_WEIGHTS;
        return res.json({ weights });
    } catch (e) {
        console.error('Error reading preferences:', e);
        return res.status(500).json({ error: 'Failed to read preferences' });
    }
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Landing page: use landing layouts + landing components
app.get('/', (req, res) => {
    const audienceId = req.query.audience || process.env.LUMINA_DEFAULT_AUDIENCE || 'skincare_expert';
    try {
        const weights = getUserWeightsFromCookies(req);
        const { html } = buildPage({
            audienceId: audienceId,
            pageType: 'landing',
            weightsOverride: weights
        });
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error rendering landing page');
    }
});

// Product page: /products/face-wash
app.get('/products/:handle', (req, res) => {
    const handle = req.params.handle; // e.g. 'face-wash'
    const audienceId = req.query.audience || process.env.LUMINA_DEFAULT_AUDIENCE || 'skincare_expert';

    try {
        bumpPromoWeightsForUser(req, res);
        const weights = getUserWeightsFromCookies(req);
        const { html } = buildPage({
            audienceId: audienceId,   // or from cookie / profile later
            pageType: 'product',
            productHandle: handle,
            weightsOverride: weights
        });

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error rendering product: ${handle}`);
    }
});

// app.use(async (req, res, next) => {
//     console.log("HERE")
//     // Let non-GET requests (POST/PUT/etc) fall through to 404 or other handlers
//     if (req.method !== 'GET') return next();
//
//     try {
//         const { pagePlan, layout, audience, context } = buildPage({
//             pageType: 'landing',
//             req,
//         });
//
//         const html = renderPageHtml(pagePlan, layout, audience, context);
//         res.send(html);
//     } catch (err) {
//         console.error('Error in fallback handler:', err);
//         res.status(500).send('Something went wrong');
//     }
// });

app.listen(PORT, () => {
    console.log(`Lumina demo server listening on http://localhost:${PORT}`);
});

