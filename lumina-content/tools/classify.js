// tools/classify.js
const fs = require('fs');

function classify(raw){
    const modules = [];
    const conf = {};

    // Hero if large image + short headline near top title
    if(raw.product.name && raw.product.images?.length){
        modules.push({type:'hero', headline: raw.product.name, image: raw.product.images[0]});
        conf.hero = 0.8;
    }

    // Product card(s)
    if(raw.product.price || raw.product.highlights.length){
        modules.push({type:'product_card', name: raw.product.name, price: raw.product.price, bullets: raw.product.highlights});
        conf.product_card = raw.product.price ? 0.9 : 0.6;
    }

    // Specs table
    if(raw.product.specs?.length >= 3){
        modules.push({type:'specs_table', rows: raw.product.specs});
        conf.specs_table = 0.9;
    }

    // Social proof
    if(raw.social_proof.review_count || raw.social_proof.reviews?.length){
        modules.push({type:'social_proof', rating: raw.social_proof.rating, count: raw.social_proof.review_count, quotes: raw.social_proof.reviews?.slice(0,3)});
        conf.social_proof = 0.7;
    }

    // Story/description
    if(raw.product.description_html){
        modules.push({type:'story_section', html: raw.product.description_html});
        conf.story_section = 0.6;
    }

    return { modules, confidence: conf };
}

function run(){
    fs.mkdirSync('pooled', {recursive: true});
    for(const f of fs.readdirSync('extracted')){
        const raw = JSON.parse(fs.readFileSync(`extracted/${f}`, 'utf8'));
        const c = classify(raw);
        const pooled = { source: raw.source, product: raw.product, social_proof: raw.social_proof, modules: c.modules, confidence: c.confidence };
        fs.writeFileSync(`pooled/${f.replace('.raw.json','.json')}`, JSON.stringify(pooled,null,2));
    }
}
run();
