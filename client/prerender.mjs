/**
 * prerender.mjs
 * 
 * Runs AFTER `vite build`. Serves the dist folder on a local port,
 * visits every route with headless Puppeteer, and saves the full
 * rendered HTML to dist/<route>/index.html so "View Page Source"
 * shows real content instead of just <div id="root"></div>.
 *
 * Usage:  node prerender.mjs
 * (automatically called by `npm run build` via postbuild script)
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, 'dist');
const PORT = 5050;

// ─── All static routes to pre-render ────────────────────────────────────────
const ROUTES = [
    '/',
    '/about-us',
    '/contact-us',
    '/b2b-partner-program',
    '/investor-relation',
    '/news-and-media',
    '/events',
    '/careers',
    '/video-gallery',
    '/blogs',
    '/du-travel-services',
    '/terms-and-conditions',
    '/duverify',
    '/our-capabilities',
    '/embassy-government-partners',
    '/tenant-and-domestic-help-verification',
    '/india-evisa',
    '/global-recruitment-services',
    '/greece-work-visa',
    '/digital-arrival-cards',
    '/dubai-5year-tourist-visa',
    '/south-korea-visa-for-indians',
    '/malaysia-visa-for-indians',
    '/morocco-visa',
    '/serbia-work-permit-visa',
    '/australia-tourist-visa',
    '/company-setup-in-the-uae',
    '/apply-for-any-visa',
    '/japan-tourist-visa-for-indians',
    '/egypt-visa-for-indians',
    '/tnh-magazine',
    '/bangladesh-vac',
    '/bangladesh-visas-for-uae-singapore',
    '/vip-clearance-at-malaysia-airport',
    '/georgia-evisa',
    '/lebanon',
    '/cookie-policy',
];

// ─── Minimal static file server ─────────────────────────────────────────────
const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.otf': 'font/otf',
    '.ttf': 'font/ttf',
    '.json': 'application/json',
};

function getMime(filePath) {
    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    return MIME[ext] || 'application/octet-stream';
}

function startServer() {
    return new Promise((resolve) => {
        const server = createServer((req, res) => {
            let urlPath = req.url.split('?')[0];

            // Try exact file first
            let filePath = join(DIST_DIR, urlPath);

            if (existsSync(filePath) && !filePath.endsWith('/')) {
                const stat = readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': getMime(filePath) });
                res.end(stat);
                return;
            }

            // SPA fallback → always serve index.html
            const indexPath = join(DIST_DIR, 'index.html');
            const html = readFileSync(indexPath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });

        server.listen(PORT, () => {
            console.log(`\n🚀 Pre-render server running at http://localhost:${PORT}\n`);
            resolve(server);
        });
    });
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
    const server = await startServer();
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log(`📄 Pre-rendering ${ROUTES.length} routes...\n`);

    for (const route of ROUTES) {
        const url = `http://localhost:${PORT}${route}`;
        const page = await browser.newPage();

        // Suppress console noise from the page
        page.on('console', () => { });
        page.on('pageerror', () => { });

        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait until React has mounted content into #root
            await page.waitForFunction(
                () => {
                    const root = document.getElementById('root');
                    return root && root.children.length > 0;
                },
                { timeout: 15000 }
            );

            // Extra buffer for lazy-loaded components / animations to settle
            await new Promise((r) => setTimeout(r, 1500));

            const html = await page.content();

            // Determine output path
            const outDir =
                route === '/'
                    ? DIST_DIR
                    : join(DIST_DIR, ...route.split('/').filter(Boolean));

            if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

            writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
            console.log(`  ✅  ${route}`);
        } catch (err) {
            console.warn(`  ⚠️   ${route} — ${err.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();
    server.close();
    console.log('\n✨ Pre-rendering complete! All routes have full HTML.\n');
}

main().catch((err) => {
    console.error('Pre-render failed:', err);
    process.exit(1);
});
