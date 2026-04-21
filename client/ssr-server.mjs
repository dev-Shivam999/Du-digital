/**
 * ssr-server.mjs
 *
 * Express SSR server for the DU Digital client app.
 *
 * How it works (production):
 *  1. Browser requests  GET /careers
 *  2. Server fetches API data from the backend (e.g. GET /api/careers)
 *  3. Server pre-populates the Redux store with that data
 *  4. Server renders the React app to HTML using renderToPipeableStream
 *  5. Server sends back a FULL HTML page – crawlers & "View Source" see real content
 *  6. React hydrates on the client so the page becomes interactive
 *
 * Run (production):  node ssr-server.mjs
 * Run (dev):         node ssr-server.mjs --dev
 */

import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// ─── Load Environment Variables ──────────────────────────────────────────────
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            if (!process.env[key.trim()] && !line.trim().startsWith('#')) {
                process.env[key.trim()] = value;
            }
        }
    });
}

const isDev = process.argv.includes('--dev');
const PORT = process.env.SSR_PORT || 3000;

// ─── Backend API base URL ─────────────────────────────────────────────────────
const API_BASE = process.env.VITE_BACKEND_URL || 'https://duapi.dudigitalglobal.com';

// ─── Helper: safe JSON fetch from backend ────────────────────────────────────
async function apiFetch(apiPath) {
    const url = `${API_BASE}${apiPath}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// ─── Route → API data to prefetch ────────────────────────────────────────────
async function prefetchForRoute(url) {
    const rawPathname = new URL(url, 'http://localhost').pathname;
    const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, '') : rawPathname;
    const state = {};

    // 🔥 Common Data for ALL Routes (for Footer/Nav/Offices)
    const commonData = await Promise.all([
        apiFetch('/api/office/locations/grouped'),
        apiFetch('/api/partner/official'),
    ]);

    state.office = {
        india: commonData[0]?.india || [],
        international: commonData[0]?.international || [],
        loading: false,
        error: null
    };
    state.partner = {
        officialPartners: commonData[1] || [],
        loadingOfficialPartners: false,
        error: null
    };

    if (pathname === '/careers') {
        const jobs = await apiFetch('/api/careers/');
        state.careers = {
            jobs: Array.isArray(jobs) ? jobs : (jobs?.data || []),
            loading: false,
            error: null,
            success: true,
            success2: false
        };
    } else if (pathname === '/blogs' || pathname.startsWith('/blog/')) {
        const parts = pathname.split('/');
        const blogId = parts[2];
        const [blogsData, singleBlogData] = await Promise.all([
            apiFetch('/api/blogs/'),
            blogId ? apiFetch(`/api/blogs/${blogId}`) : Promise.resolve(null)
        ]);
        state.blog = {
            Blogs: blogsData?.data || (Array.isArray(blogsData) ? blogsData : []),
            SingleBlog: singleBlogData || {},
            loading: false,
            error: null,
            totalPages: blogsData?.totalPages || 0
        };
    } else if (pathname === '/events' || pathname.startsWith('/events/')) {
        const parts = pathname.split('/');
        const eventId = parts[2];
        const [eventsData, singleEventData] = await Promise.all([
            apiFetch('/api/events/'),
            eventId ? apiFetch(`/api/events/${eventId}`) : Promise.resolve(null)
        ]);
        state.events = {
            events: eventsData?.data || (Array.isArray(eventsData) ? eventsData : []),
            selectedEvent: singleEventData || null,
            loading: false,
            eventLoading: false,
            error: null,
            totalPages: eventsData?.totalPages || 0
        };
    } else if (pathname === '/news-and-media') {
        const newsData = await apiFetch('/api/news/');
        state.news = {
            news: newsData?.data || (Array.isArray(newsData) ? newsData : []),
            loading: false,
            error: null,
            totalPages: newsData?.totalPages || 0,
            currentPage: newsData?.currentPage || 1
        };
    } else if (pathname === '/about-us') {
        const team = await apiFetch('/api/team-members/?groupBy=category');
        state.team = {
            teamMembersByCategory: (team && typeof team === 'object' && !Array.isArray(team)) ? team : {},
            loading: false,
            error: null
        };
    } else if (pathname === '/investor-relation' || pathname.startsWith('/investor-relation/')) {
        const parts = pathname.split('/');
        const slug = parts[2] || 'investor-relations';
        const investorData = await apiFetch(`/api/investor/category/${slug}`);
        state.investor = {
            category: investorData?.category || null,
            reports: investorData?.reports || [],
            loading: false,
            error: null
        };
    } else if (pathname === '/') {
        // Home page needs Blogs, News, and Events
        const [newsData, blogsData, eventsData] = await Promise.all([
            apiFetch('/api/news/'),
            apiFetch('/api/blogs/'),
            apiFetch('/api/events/')
        ]);
        state.news = {
            news: newsData?.data || (Array.isArray(newsData) ? newsData : []),
            loading: false,
            error: null,
            totalPages: newsData?.totalPages || 0
        };
        state.blog = {
            Blogs: blogsData?.data || (Array.isArray(blogsData) ? blogsData : []),
            loading: false,
            error: null
        };
        state.events = {
            events: eventsData?.data || (Array.isArray(eventsData) ? eventsData : []),
            loading: false,
            error: null
        };
    }
    return state;
}

// ─── Collect a piped stream into a string ────────────────────────────────────
function streamToString(pipe) {
    return new Promise((resolve, reject) => {
        const pt = new PassThrough();
        const chunks = [];
        pt.on('data', (c) => chunks.push(c));
        pt.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        pt.on('error', reject);
        pipe(pt);
    });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function createApp() {
    const app = express();
    let vite;

    if (isDev) {
        const { createServer } = await import('vite');
        vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    } else {
        // Serve static assets (JS/CSS/images) but NOT index.html
        app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
    }

    // ── SSR catch-all ──────────────────────────────────────────────────────────
    app.use(async (req, res) => {
        const url = req.originalUrl;
        const rawPathname = new URL(url, 'http://localhost').pathname;
        const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, '') : rawPathname;

        console.log(`[SSR] Request for: ${url}`);

        try {
            let template, render;

            if (isDev) {
                template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
            } else {
                template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
                // Dynamic import once per request so updates work after rebuild
                const mod = await import(`./dist/server/entry-server.js?t=${Date.now()}`).catch(
                    () => import('./dist/server/entry-server.js')
                );
                render = mod.render;
            }

            // 1️⃣  Prefetch API data
            console.log(`[SSR] Prefetching data for: ${url}`);
            const preloadedState = await prefetchForRoute(url);

            // 2️⃣  Render React
            console.log(`[SSR] Rendering React app...`);
            const { appHtml, finalState } = await new Promise((resolve, reject) => {
                render(
                    url,
                    preloadedState,
                    (html, state) => {
                        resolve({ appHtml: html, finalState: state });
                    },
                    (err) => {
                        console.error('[SSR] Render Error:', err);
                        reject(err);
                    }
                );
            });
            console.log(`[SSR] Render complete. HTML length: ${appHtml.length}`);

            // 3️⃣  Embed Redux state for client-side hydration
            const jsonState = JSON.stringify(finalState).replace(/</g, '\\u003c');
            const stateScript = `<script>window.__PRELOADED_STATE__ = ${jsonState}</script>`;


            // 4️⃣  SEO Metadata Mapping 
            const metaFile = path.resolve(__dirname, 'src/data/meta-data.json');
            let metaMap = {};
            if (fs.existsSync(metaFile)) {
                try {
                    metaMap = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
                } catch (err) {
                    console.error('[SSR] Failed to parse meta-data.json:', err);
                }
            }

            const routeMeta = metaMap[pathname] || metaMap['/'] || { title: 'DU Digital Global', desc: '' };

            // 5️⃣  JSON-LD Generation 
            const jsonLd = {
                "@context": "https://schema.org",
                "@type": pathname === '/about-us' ? "AboutPage" : (pathname === '/careers' ? "ItemList" : "Organization"),
                "name": routeMeta.title,
                "description": routeMeta.desc,
                "url": `https://dudigitalglobal.com${pathname}`,
                "logo": "https://dudigitalglobal.com/favicon.ico"
            };
            const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

            // 6️⃣  Assemble the full page
            const rootDiv = '<div id="root"></div>';

            // Inject Dynamic Title, Description and JSON-LD
            let processedTemplate = template
                .replace('<title>DU Digital Global</title>', `<title>${routeMeta.title}</title>`)
                .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${routeMeta.desc}">`);

            // Inject JSON-LD at the end of <head>
            processedTemplate = processedTemplate.replace('</head>', `${jsonLdScript}</head>`);

            const [htmlHead, htmlTail] = processedTemplate.split(rootDiv);
            const fullHtml = `${htmlHead}<div id="root">${appHtml}</div>${stateScript}${htmlTail}`;

            res.status(200).set('Content-Type', 'text/html').send(fullHtml);

        } catch (err) {
            if (isDev && vite) vite.ssrFixStacktrace(err);
            console.error('[SSR] Error for', url, ':', err);

            // Graceful fallback to SPA shell so the client can still render
            const fallbackPath = isDev ? 'index.html' : 'dist/index.html';
            const fallback = fs.readFileSync(path.resolve(__dirname, fallbackPath), 'utf-8');
            res.status(200).set('Content-Type', 'text/html').send(fallback);
        }
    });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 SSR server running at http://0.0.0.0:${PORT}`);
        console.log(`   Mode: ${isDev ? 'development (Vite HMR)' : 'production'}`);
        console.log(`   API:  ${API_BASE}\n`);
    });
}

createApp();
