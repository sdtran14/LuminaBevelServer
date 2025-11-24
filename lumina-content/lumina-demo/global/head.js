import fs from 'fs';
import path from 'path';

export const bevelHeadHtml = fs.readFileSync(
    path.join(process.cwd(), 'global', 'bevel-head.html'),
    'utf8'
);