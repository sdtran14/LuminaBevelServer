// components/graph.js

export const graphVariants = [
    {
        id: 'graph_ph_profile',
        componentType: 'Graph',
        image: '[graph_ph_profile.png]',
        heading: 'pH Profile vs Skin Barrier Range',
        body: 'Hydra Men formulas sit in the optimal 4.7–5.8 range for barrier recovery.',
        tags: ['skin', 'ph', 'specs'],
        goals: ['show_evidence'],
        baseScore: 0.9
    },
    {
        id: 'graph_hydration_gain',
        componentType: 'Graph',
        image: '[graph_hydration_gain.png]',
        heading: 'Hydration Increase Over 24 Hours',
        body: 'Measured 32% increase in skin hydration compared to untreated control.',
        tags: ['skin', 'specs'],
        goals: ['show_evidence'],
        baseScore: 0.85
    },
    {
        id: 'graph_device_performance',
        componentType: 'Graph',
        image: '[graph_device_performance.png]',
        heading: 'Device Performance Stats',
        body: 'Battery life, blade retention, and RPM consistency over time.',
        tags: ['devices', 'specs'],
        goals: ['explain_product'],
        baseScore: 0.75
    }
];
