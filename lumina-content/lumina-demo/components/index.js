// components/index.js

import { heroVariants } from './hero.js';
import { specsStripVariants } from './specsStrip.js';
import { productGridVariants } from './productGrid.js';
import { ingredientPanelVariants } from './ingredientPanel.js';
import { graphVariants } from './graph.js';
import { carouselVariants } from './carousel.js';
import { promoStripVariants } from './promoStrip.js';
import { testimonialVariants } from './testimonials.js';
import {productVariants} from "./product-from-json.js";


// Flatten everything into one big array

export const componentVariants = [
    ...heroVariants,
    ...specsStripVariants,
    ...productGridVariants,
    ...ingredientPanelVariants,
    ...graphVariants,
    ...carouselVariants,
    ...promoStripVariants,
    ...testimonialVariants,
    ...productVariants,
];
