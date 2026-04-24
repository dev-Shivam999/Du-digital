/**
 * migrate-slugs.mjs
 * One-time migration: backfill slug field for all existing Blog and Event documents.
 * Run: node migrate-slugs.mjs
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

// ── Slug generator (same logic as TypeScript models) ─────────────────────────
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s_-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

// ── Minimal schemas (just what we need) ──────────────────────────────────────
const blogSchema = new mongoose.Schema({ title: String, slug: String }, { strict: false });
const eventSchema = new mongoose.Schema({ title: String, slug: String }, { strict: false });

const Blog = mongoose.model('Blog', blogSchema);
const Event = mongoose.model('Event', eventSchema);

// ── Migration ─────────────────────────────────────────────────────────────────
async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // ── Blogs ──────────────────────────────────────────────────────────────────
    const blogs = await Blog.find({ $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] });
    console.log(`Found ${blogs.length} blogs without slugs`);

    const usedBlogSlugs = new Set();
    let blogUpdated = 0;

    for (const blog of blogs) {
        let slug = generateSlug(blog.title || '');
        if (!slug) slug = blog._id.toString();

        // Ensure uniqueness within this batch + DB
        let candidate = slug;
        let attempt = 1;
        while (usedBlogSlugs.has(candidate) || await Blog.exists({ slug: candidate, _id: { $ne: blog._id } })) {
            candidate = `${slug}_${attempt++}`;
        }
        usedBlogSlugs.add(candidate);

        await Blog.updateOne({ _id: blog._id }, { $set: { slug: candidate } });
        console.log(`  Blog: "${blog.title}" → /blog/${candidate}`);
        blogUpdated++;
    }

    // ── Events ─────────────────────────────────────────────────────────────────
    const events = await Event.find({ $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] });
    console.log(`\nFound ${events.length} events without slugs`);

    const usedEventSlugs = new Set();
    let eventUpdated = 0;

    for (const event of events) {
        let slug = generateSlug(event.title || '');
        if (!slug) slug = event._id.toString();

        let candidate = slug;
        let attempt = 1;
        while (usedEventSlugs.has(candidate) || await Event.exists({ slug: candidate, _id: { $ne: event._id } })) {
            candidate = `${slug}_${attempt++}`;
        }
        usedEventSlugs.add(candidate);

        await Event.updateOne({ _id: event._id }, { $set: { slug: candidate } });
        console.log(`  Event: "${event.title}" → /events/${candidate}`);
        eventUpdated++;
    }

    console.log(`\n✅ Done — ${blogUpdated} blogs, ${eventUpdated} events updated`);
    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
