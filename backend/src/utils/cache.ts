import NodeCache from 'node-cache';

// Cache with 5 minute TTL (time to live) and check period of 120 seconds
const cache = new NodeCache({
    stdTTL: 300,      // 5 minutes default TTL
    checkperiod: 120  // Check for expired keys every 2 minutes
});

// Helper functions
export const getCache = (key: string) => {
    return cache.get(key);
};

export const setCache = (key: string, value: any, ttl?: number) => {
    if (ttl) {
        cache.set(key, value, ttl);
    } else {
        cache.set(key, value);
    }
};

export const deleteCache = (key: string) => {
    cache.del(key);
};

export const deleteCacheByPattern = (pattern: string) => {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    cache.del(matchingKeys);
};

export const flushCache = () => {
    cache.flushAll();
};

// Cache keys
export const CACHE_KEYS = {
    CATEGORIES: 'investor_categories',
    CATEGORY_REPORTS: (slug: string) => `category_reports_${slug}`,
    CAREERS: 'careers_list',
    TEAM_MEMBERS: 'team_members',
    BLOGS: (page: number, limit: number) => `blogs_${page}_${limit}`,
    FORMS: 'forms_list',
    FORM_BY_SLUG: (slug: string) => `form_${slug}`,
    VIDEOS: 'videos_list',
    TRAVEL_PACKAGES: 'travel_packages',
    GALLERY: 'gallery_images',
    OFFICE_TYPES: 'office_types',
    OFFICE_LOCATIONS: 'office_locations',
};

export default cache;
