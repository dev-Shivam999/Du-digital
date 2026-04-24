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
const PORT = process.env.SSR_PORT || 5173;

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
        const blogSlug = parts[2];
        const [blogsData, singleBlogData] = await Promise.all([
            apiFetch('/api/blogs/?page=1&limit=12&IsUsers=true'),
            blogSlug ? apiFetch(`/api/blogs/${blogSlug}`) : Promise.resolve(null)
        ]);
        state.blog = {
            Blogs: blogsData?.blogs || blogsData?.data || (Array.isArray(blogsData) ? blogsData : []),
            SingleBlog: singleBlogData || {},
            loading: false,
            error: null,
            totalPages: blogsData?.totalPages || 0
        };
    } else if (pathname === '/events' || pathname.startsWith('/events/')) {
        const parts = pathname.split('/');
        const eventSlug = parts[2];
        const [eventsData, singleEventData] = await Promise.all([
            apiFetch('/api/events/?page=1&limit=9'),
            eventSlug ? apiFetch(`/api/events/${eventSlug}`) : Promise.resolve(null)
        ]);
        state.events = {
            events: eventsData?.data || eventsData?.events || (Array.isArray(eventsData) ? eventsData : []),
            selectedEvent: singleEventData || null,
            loading: false,
            eventLoading: false,
            error: null,
            success: false,
            totalPages: eventsData?.totalPages || 0
        };
    } else if (pathname === '/news-and-media') {
        const newsData = await apiFetch('/api/news/?page=1&limit=10');
        state.news = {
            news: newsData?.data || newsData?.news || (Array.isArray(newsData) ? newsData : []),
            yearCounts: newsData?.yearCounts || {},
            loading: false,
            error: null,
            success: false,
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
            apiFetch('/api/news/?page=1&limit=3'),
            apiFetch('/api/blogs/?page=1&limit=3&IsUsers=true'),
            apiFetch('/api/events/?page=1&limit=6')
        ]);
        state.news = {
            news: newsData?.data || newsData?.news || (Array.isArray(newsData) ? newsData : []),
            yearCounts: newsData?.yearCounts || {},
            loading: false,
            error: null,
            success: false,
            totalPages: newsData?.totalPages || 0,
            currentPage: newsData?.currentPage || 1
        };
        state.blog = {
            Blogs: blogsData?.blogs || blogsData?.data || (Array.isArray(blogsData) ? blogsData : []),
            SingleBlog: {},
            loading: false,
            error: null,
            totalPages: blogsData?.totalPages || 0
        };
        state.events = {
            events: eventsData?.data || eventsData?.events || (Array.isArray(eventsData) ? eventsData : []),
            selectedEvent: null,
            loading: false,
            eventLoading: false,
            error: null,
            success: false,
            totalPages: eventsData?.totalPages || 0
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

    // ── Security Headers ───────────────────────────────────────────────────────
    app.use((req, res, next) => {
        const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|otf|ttf|webp|avif)$/i.test(req.path);

        // X-Content-Type-Options — prevent MIME sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');

        // X-Frame-Options — prevent clickjacking
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');

        // Referrer-Policy — don't leak full URLs to third parties
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Strict-Transport-Security — force HTTPS (1 year, include subdomains)
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Permissions-Policy — disable unused browser features
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');

        // X-XSS-Protection — legacy browsers
        res.setHeader('X-XSS-Protection', '1; mode=block');

        // Content-Security-Policy — skip for static assets (breaks nothing, saves overhead)
        if (!isAsset) {
            const SELF = "'self'";
            const UNSAFE_INLINE = "'unsafe-inline'";   // needed for Tailwind inline styles + tracking scripts
            const UNSAFE_EVAL = "'unsafe-eval'";        // needed for Vite dev HMR only

            // Collect tracking domains dynamically
            const trackingScriptSrcs = [
                process.env.GTM_ID          && 'https://www.googletagmanager.com',
                process.env.GA4_ID          && 'https://www.googletagmanager.com https://www.google-analytics.com',
                process.env.FB_PIXEL_ID     && 'https://connect.facebook.net',
                process.env.LINKEDIN_PARTNER_ID && 'https://snap.licdn.com',
            ].filter(Boolean).join(' ');

            const trackingConnectSrcs = [
                process.env.GA4_ID          && 'https://www.google-analytics.com https://analytics.google.com',
                process.env.FB_PIXEL_ID     && 'https://www.facebook.com',
                process.env.LINKEDIN_PARTNER_ID && 'https://px.ads.linkedin.com',
            ].filter(Boolean).join(' ');

            const trackingImgSrcs = [
                process.env.FB_PIXEL_ID     && 'https://www.facebook.com',
                process.env.LINKEDIN_PARTNER_ID && 'https://px.ads.linkedin.com',
            ].filter(Boolean).join(' ');

            const csp = [
                `default-src ${SELF}`,
                `script-src ${SELF} ${UNSAFE_INLINE} ${isDev ? UNSAFE_EVAL : ''} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://snap.licdn.com https://s3.ap-south-1.amazonaws.com https://app.limechat.ai ${trackingScriptSrcs}`.trim(),
                `style-src ${SELF} ${UNSAFE_INLINE} https://fonts.googleapis.com`,
                `font-src ${SELF} data: https://fonts.gstatic.com`,
                `img-src ${SELF} data: blob: https: http:`,
                `media-src ${SELF} https:`,
                `frame-src ${SELF} https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://www.googletagmanager.com`,
                `connect-src ${SELF} ${process.env.VITE_BACKEND_URL || 'https://duapi.dudigitalglobal.com'} https://www.google-analytics.com https://analytics.google.com https://app.limechat.ai ${trackingConnectSrcs}`.trim(),
                `worker-src ${SELF} blob:`,
                `object-src 'none'`,
                `base-uri ${SELF}`,
                `form-action ${SELF}`,
                `upgrade-insecure-requests`,
            ].join('; ');

            res.setHeader('Content-Security-Policy', csp);
        }

        next();
    });

    if (isDev) {
        const { createServer } = await import('vite');
        vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    } else {
        // In production with Nginx, static files are served by Nginx directly.
        // express.static is kept as a fallback for running without Nginx (e.g. local dev).
        app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
        app.use(express.static(path.resolve(__dirname, 'public'), { index: false }));
    }

    // ── robots.txt ─────────────────────────────────────────────────────────────
    app.get('/robots.txt', (req, res) => {
        const SITE = process.env.VITE_DUDIGITAL_URL || 'https://dudigitalglobal.com';
        const NOINDEX = process.env.NOINDEX === 'true';

        if (NOINDEX) {
            // Staging mode — block all crawlers
            return res.status(200).set('Content-Type', 'text/plain').send(
`User-agent: *
Disallow: /

# This is a staging site — not for indexing`
            );
        }

        // Production mode — normal robots.txt
        res.status(200).set('Content-Type', 'text/plain').send(
`User-agent: *
Allow: /

Disallow: /api/
Disallow: /uploads/

Sitemap: ${SITE}/sitemap.xml`
        );
    });

    // ── Sitemap ────────────────────────────────────────────────────────────────
    app.get('/sitemap.xml', async (req, res) => {
        const SITE = process.env.VITE_DUDIGITAL_URL || 'https://dudigitalglobal.com';
        const today = new Date().toISOString().split('T')[0];

        // Static routes — priority/changefreq tuned per page type
        const staticRoutes = [
            { path: '/',                                  priority: '1.0', changefreq: 'daily' },
            { path: '/about-us',                          priority: '0.8', changefreq: 'monthly' },
            { path: '/careers',                           priority: '0.8', changefreq: 'weekly' },
            { path: '/contact-us',                        priority: '0.7', changefreq: 'monthly' },
            { path: '/blogs',                             priority: '0.8', changefreq: 'daily' },
            { path: '/news-and-media',                    priority: '0.8', changefreq: 'daily' },
            { path: '/events',                            priority: '0.8', changefreq: 'weekly' },
            { path: '/video-gallery',                     priority: '0.6', changefreq: 'weekly' },
            { path: '/investor-relation',                 priority: '0.6', changefreq: 'monthly' },
            { path: '/b2b-partner-program',               priority: '0.7', changefreq: 'monthly' },
            { path: '/embassy-government-partners',       priority: '0.7', changefreq: 'monthly' },
            { path: '/india-evisa',                       priority: '0.9', changefreq: 'weekly' },
            { path: '/dubai-5year-tourist-visa',          priority: '0.9', changefreq: 'weekly' },
            { path: '/south-korea-visa-for-indians',      priority: '0.9', changefreq: 'weekly' },
            { path: '/greece-work-visa',                  priority: '0.8', changefreq: 'weekly' },
            { path: '/serbia-work-permit-visa',           priority: '0.8', changefreq: 'weekly' },
            { path: '/australia-tourist-visa',            priority: '0.8', changefreq: 'weekly' },
            { path: '/malaysia-visa-for-indians',         priority: '0.8', changefreq: 'weekly' },
            { path: '/morocco-visa',                      priority: '0.8', changefreq: 'weekly' },
            { path: '/japan-tourist-visa-for-indians',    priority: '0.8', changefreq: 'weekly' },
            { path: '/egypt-visa-for-indians',            priority: '0.8', changefreq: 'weekly' },
            { path: '/georgia-evisa',                     priority: '0.8', changefreq: 'weekly' },
            { path: '/digital-arrival-cards',             priority: '0.8', changefreq: 'weekly' },
            { path: '/bangladesh-vac',                    priority: '0.8', changefreq: 'weekly' },
            { path: '/bangladesh-visas-for-uae-singapore',priority: '0.8', changefreq: 'weekly' },
            { path: '/vip-clearance-at-malaysia-airport', priority: '0.7', changefreq: 'weekly' },
            { path: '/lebanon',                           priority: '0.7', changefreq: 'weekly' },
            { path: '/apply-for-any-visa',                priority: '0.8', changefreq: 'weekly' },
            { path: '/company-setup-in-the-uae',          priority: '0.8', changefreq: 'monthly' },
            { path: '/global-recruitment-services',       priority: '0.7', changefreq: 'monthly' },
            { path: '/duverify',                          priority: '0.7', changefreq: 'monthly' },
            { path: '/tenant-and-domestic-help-verification', priority: '0.7', changefreq: 'monthly' },
            { path: '/our-capabilities',                  priority: '0.6', changefreq: 'monthly' },
            { path: '/swifttravels',                      priority: '0.7', changefreq: 'weekly' },
            { path: '/tnh-magazine',                      priority: '0.6', changefreq: 'monthly' },
            { path: '/terms-and-conditions',              priority: '0.3', changefreq: 'yearly' },
            { path: '/cookie-policy',                     priority: '0.3', changefreq: 'yearly' },
        ];

        // Fetch dynamic blog and event IDs
        const [blogsData, eventsData] = await Promise.all([
            apiFetch('/api/blogs?page=1&limit=100&IsUsers=true'),
            apiFetch('/api/events?page=1&limit=100'),
        ]);

        const blogUrls = (blogsData?.blogs || blogsData?.data || []).map(b => ({
            path: `/blog/${b.slug || b._id}`,
            lastmod: (b.updatedAt || b.publishedAt || today).split('T')[0],
            priority: '0.7',
            changefreq: 'monthly',
        }));

        const eventUrls = (eventsData?.data || eventsData?.events || []).map(e => ({
            path: `/events/${e.slug || e._id}`,
            lastmod: (e.updatedAt || today).split('T')[0],
            priority: '0.6',
            changefreq: 'monthly',
        }));

        const allUrls = [
            ...staticRoutes.map(r => ({ ...r, lastmod: today })),
            ...blogUrls,
            ...eventUrls,
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${SITE}${u.path}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        res.status(200).set('Content-Type', 'application/xml').send(xml);
    });

    // ── SSR catch-all ──────────────────────────────────────────────────────────
    app.use(async (req, res) => {
        const url = req.originalUrl;
        const rawPathname = new URL(url, 'http://localhost').pathname;
        const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, '') : rawPathname;

        // Static asset requests that weren't served by express.static — return 404
        if (/\.(jpg|jpeg|png|gif|svg|ico|webp|avif|woff|woff2|otf|ttf|eot|mp4|pdf|txt|xml|json|js|css|map)$/i.test(pathname)) {
            return res.status(404).end();
        }

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
            const { appHtml, finalState, is404 } = await new Promise((resolve, reject) => {
                render(
                    url,
                    preloadedState,
                    (html, state, meta = {}) => {
                        resolve({ appHtml: html, finalState: state, is404: meta.is404 || false });
                    },
                    (err) => {
                        console.error('[SSR] Render Error:', err);
                        reject(err);
                    }
                );
            });
            console.log(`[SSR] Render complete. HTML length: ${appHtml.length}${is404 ? ' [404]' : ''}`);

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

            // For single blog pages, use the blog's own SEO fields
            if (pathname.startsWith('/blog/') && preloadedState.blog?.SingleBlog?.title) {
                const blog = preloadedState.blog.SingleBlog;
                routeMeta.title = blog.seoTitle || `${blog.title} | DU Digital Global`;
                routeMeta.desc  = blog.seoDescription || blog.tags || `Read about ${blog.title} on DU Digital Global.`;
            }
            const SITE_URL = process.env.VITE_DUDIGITAL_URL || 'https://dudigitalglobal.com';
            const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
            const ogImage = `${SITE_URL}/favicon.png`;

            // 5️⃣  JSON-LD — route-aware schema type
            const schemaTypeMap = {
                '/about-us': 'AboutPage',
                '/careers': 'JobPosting',
                '/blogs': 'Blog',
                '/news-and-media': 'NewsArticle',
                '/events': 'EventSeries',
                '/contact-us': 'ContactPage',
            };
            const schemaType = schemaTypeMap[pathname] || (pathname.startsWith('/blog/') ? 'BlogPosting' : 'WebPage');
            const jsonLd = {
                "@context": "https://schema.org",
                "@type": schemaType,
                "name": routeMeta.title,
                "description": routeMeta.desc,
                "url": canonicalUrl,
                "publisher": {
                    "@type": "Organization",
                    "name": "DU Digital Global",
                    "logo": { "@type": "ImageObject", "url": ogImage }
                }
            };
            const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

            // 6️⃣  Assemble the full page
            const rootDiv = '<div id="root"></div>';

            // Build all SEO tags to inject into <head>
            const seoTags = [
                `<link rel="canonical" href="${canonicalUrl}">`,
                `<meta property="og:type" content="website">`,
                `<meta property="og:site_name" content="DU Digital Global">`,
                `<meta property="og:url" content="${canonicalUrl}">`,
                `<meta property="og:title" content="${routeMeta.title}">`,
                `<meta property="og:description" content="${routeMeta.desc}">`,
                `<meta property="og:image" content="${ogImage}">`,
                `<meta name="twitter:card" content="summary_large_image">`,
                `<meta name="twitter:title" content="${routeMeta.title}">`,
                `<meta name="twitter:description" content="${routeMeta.desc}">`,
                `<meta name="twitter:image" content="${ogImage}">`,
                jsonLdScript,
            ].join('\n');

            // Inject Dynamic Title, Description and all SEO tags
            let processedTemplate = template
                .replace('<title>DU Digital Global</title>', `<title>${routeMeta.title}</title>`)
                .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${routeMeta.desc}">`);

            // Remove any existing og/twitter/canonical tags from template to avoid duplicates
            processedTemplate = processedTemplate
                .replace(/<link rel="canonical"[^>]*>/g, '')
                .replace(/<meta property="og:[^>]*>/g, '')
                .replace(/<meta name="twitter:[^>]*>/g, '');

            // Inject all SEO tags before </head>
            processedTemplate = processedTemplate.replace('</head>', `${seoTags}\n</head>`);

            // Staging noindex — block crawlers on non-production environments
            if (process.env.NOINDEX === 'true') {
                processedTemplate = processedTemplate.replace(
                    '</head>',
                    `<meta name="robots" content="noindex, nofollow">\n</head>`
                );
            }

            const [htmlHead, htmlTail] = processedTemplate.split(rootDiv);
            const fullHtml = `${htmlHead}<div id="root">${appHtml}</div>${stateScript}${htmlTail}`;

            res.status(is404 ? 404 : 200).set('Content-Type', 'text/html').send(fullHtml);

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
