import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import metaMap from '../../data/meta-data.json';

const SEO = ({ title: customTitle, description: customDescription }) => {
    const location = useLocation();

    useEffect(() => {
        // Normalize pathname (remove trailing slash)
        let pathname = location.pathname;
        if (pathname.endsWith('/') && pathname.length > 1) {
            pathname = pathname.slice(0, -1);
        }

        const routeMeta = metaMap[pathname] || metaMap['/'] || {};
        const title = customTitle || routeMeta.title;
        const description = customDescription || routeMeta.desc;

        if (title) {
            document.title = title;
        }

        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
        }
    }, [customTitle, customDescription, location.pathname]);

    return null;
};

export default SEO;
