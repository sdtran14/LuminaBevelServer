// tools/extract.js
const fs = require('fs'); const path = require('path');
const cheerio = require('cheerio');

function extractFromHtml(html, url){
    const $ = cheerio.load(html);

    const out = {
        source: { url, fetched_at: new Date().toISOString() },
        product: { name:"", price:"", currency:"", images:[], specs:[], highlights:[], description_html:"" },
        social_proof: { rating:0, review_count:0, reviews:[] },
        page: { title:$('title').text().trim(), breadcrumbs:[] }
    };

    // JSON-LD (Product/AggregateRating/Review)
    $('script[type="application/ld+json"]').each((_, el)=>{
        try {
            const data = JSON.parse($(el).contents().text());
            const nodes = Array.isArray(data) ? data : [data];
            nodes.forEach(n=>{
                if(n['@type']==='Product'){
                    out.product.name ||= n.name || "";
                    const imgs = (Array.isArray(n.image)?n.image:[n.image]).filter(Boolean);
                    imgs.forEach(u => out.product.images.push({url:u, alt: out.product.name}));
                    const off = Array.isArray(n.offers)?n.offers[0]:n.offers;
                    if(off){ out.product.price ||= off.price || ""; out.product.currency ||= off.priceCurrency || ""; }
                    if(n.aggregateRating){ out.social_proof.rating = +n.aggregateRating.ratingValue || 0; out.social_proof.review_count = +n.aggregateRating.reviewCount || 0; }
                    if(n.description){ out.product.description_html ||= `<p>${n.description}</p>`; }
                }
            });
        } catch {}
    });

    // Fallbacks
    if(!out.product.name) out.product.name = $('h1,[itemprop=name],.product-title').first().text().trim();
    if(out.product.images.length===0){
        $('img').slice(0,6).each((_,img)=>{
            const src = $(img).attr('src') || $(img).attr('data-src');
            if(src && !/sprite|icon/i.test(src)) out.product.images.push({url:new URL(src, url).href, alt:$(img).attr('alt')||out.product.name});
        });
    }

    // Highlights (short <li>)
    const bullets = $('ul').filter((_,ul)=>$(ul).find('li').length>=3 && $(ul).text().length<800).first();
    bullets.find('li').each((_,li)=> out.product.highlights.push($(li).text().trim()));
    out.product.highlights = out.product.highlights.slice(0,6);

    // Specs (2-col table or dl)
    const specTable = $('table').filter((_,t)=> $(t).find('tr').length>=3).first();
    if(specTable.length){
        specTable.find('tr').each((_,tr)=>{
            const tds = $(tr).find('th,td');
            if(tds.length===2){
                const k=$(tds[0]).text().trim(), v=$(tds[1]).text().trim();
                if(k&&v) out.product.specs.push([k,v]);
            }
        });
    } else {
        $('dl').first().find('dt').each((i,dt)=>{
            const k=$(dt).text().trim(), v=$(dt).next('dd').text().trim();
            if(k&&v) out.product.specs.push([k,v]);
        });
    }

    return out;
}

function runOne(htmlPath){
    const url = path.basename(htmlPath).replace(/\.html$/,'').replace(/getbevel\.com/,'getbevel.com/')
    const html = fs.readFileSync(htmlPath,'utf8');
    const data = extractFromHtml(html, url);
    const outPath = path.join('extracted', path.basename(htmlPath).replace('.html','.raw.json'));
    fs.mkdirSync('extracted', {recursive:true}); fs.writeFileSync(outPath, JSON.stringify(data,null,2));
}

if(require.main === module){
    const files = process.argv.slice(2);
    files.forEach(runOne);
}
