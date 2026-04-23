import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import metaMap from '../../data/meta-data.json';

/**
 * SEO component — works both on server (SSR) and client.
 * On the server, the ssr-server.mjs already injects title/desc/og/canonical
 * into the HTML template before sending. This component handles client-side
 * navigation updates (SPA route changes after hydration).
 */
const SEO = ({ title: customTitle, description: customDescription }) => {
    const location = useLocation();

    useEffect(() => {
        let pathname = location.pathname;
        if (pathname.endsWith('/') && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }

        const routeMeta = metaMap[pathname] || metaMap['/'] || {};
        const title = customTitle || routeMeta.title;
        const description = customDescription || routeMeta.desc;

        if (title) document.title = title;

        const setMeta = (selector, attr, value) => {
            if (!value) return;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                const [attrName, attrVal] = selector.match(/\[([^\]]+)="([^"]+)"\]/)?.slice(1) || [];
                if (attrName) el.setAttribute(attrName, attrVal);
                document.head.appendChild(el);
            }
            el.setAttribute(attr, value);
        };

        const SITE_URL = import.meta.env.VITE_DUDIGITAL_URL || 'https://dudigitalglobal.com';
        const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;

        setMeta('meta[name="description"]', 'content', description);
        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[property="og:url"]', 'content', canonicalUrl);
        setMeta('meta[name="twitter:title"]', 'content', title);
        setMeta('meta[name="twitter:description"]', 'content', description);

        // Update canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;

    }, [customTitle, customDescription, location.pathname]);

    return null;
};

export default SEO;
