// components/ingredientPanel.js

import fs from "fs";
import path from "path";

export const ingredientPanelVariants = [
    {
        id: 'ingredient_panel_hydra_men',
        componentType: 'IngredientPanel',
        image: '[ingredient_panel_hydra_men.png]',
        heading: 'Ingredient Transparency',
        body: 'Niacinamide (5%), beta-glucan, and glycerin work together to calm and hydrate sensitive skin.',
        tags: ['skin', 'ingredients', 'hydra_men'],
        goals: ['explain_product', 'show_evidence'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-ingredients.html'),
            'utf8'
        ),
        baseScore: 0.9
    },
    {
        id: 'product_ingredient_panel_hydra_men',
        componentType: 'ProductIngredientPanel',
        image: '[ingredient_panel_hydra_men.png]',
        heading: 'Ingredient Transparency',
        body: 'Niacinamide (5%), beta-glucan, and glycerin work together to calm and hydrate sensitive skin.',
        tags: ['skin', 'ingredients', 'hydra_men'],
        goals: ['explain_product', 'show_evidence'],
        html: fs.readFileSync(
            path.join(process.cwd(), 'global', 'bevel-image-text-ingredients.html'),
            'utf8'
        ),
        baseScore: 0.9
    },
    {
        id: 'ingredient_panel_actives',
        componentType: 'IngredientPanel',
        image: '[ingredient_panel_actives.png]',
        heading: 'Clinically Backed Actives',
        body: 'We only use evidence-backed ingredients — no fragrances, no fillers, no irritants.',
        tags: ['skin', 'ingredients'],
        goals: ['explain_product', 'show_evidence'],
        baseScore: 0.85
    }
];
