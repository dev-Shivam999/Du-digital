const Video = require("../dist/models/video.model.js").default || require("../dist/models/video.model.js");


const videos = [
    // ===============================
    // BRAND & CORPORATE FILMS
    // ===============================
    {
        title: "DU Digital Global – A Journey of Growth & Success",
        category: "Brand & Corporate Films",
        videoUrl: "https://www.youtube.com/watch?v=9Kp8GzKpQ0A",
        thumbnailUrl: "https://img.youtube.com/vi/9Kp8GzKpQ0A/maxresdefault.jpg",
        isFeatured: true
    },
    {
        title: "Inside DU Digital Global – Corporate Overview & Vision",
        category: "Brand & Corporate Films",
        videoUrl: "https://www.youtube.com/watch?v=R3KZ9YkJm2U",
        thumbnailUrl: "https://img.youtube.com/vi/R3KZ9YkJm2U/maxresdefault.jpg"
    },
    {
        title: "DU Digital Global | Empowering Global Mobility",
        category: "Brand & Corporate Films",
        videoUrl: "https://www.youtube.com/watch?v=F1x8Q0vWJ9Q",
        thumbnailUrl: "https://img.youtube.com/vi/F1x8Q0vWJ9Q/maxresdefault.jpg"
    },

    // ===============================
    // BUSINESS & COMPANY FORMATION
    // ===============================
    {
        title: "Company Formation in the UAE – Complete Business Setup Guide",
        category: "Business & Company Formation",
        videoUrl: "https://www.youtube.com/watch?v=8mKJ7pD2ZqA",
        thumbnailUrl: "https://img.youtube.com/vi/8mKJ7pD2ZqA/maxresdefault.jpg",
        isFeatured: true
    },
    {
        title: "Expand Your Business in Dubai with DU Digital Global",
        category: "Business & Company Formation",
        videoUrl: "https://www.youtube.com/watch?v=ZpA3T4HqY8M",
        thumbnailUrl: "https://img.youtube.com/vi/ZpA3T4HqY8M/maxresdefault.jpg"
    },
    {
        title: "Chennai Entrepreneurs: Expand Your Business in the UAE",
        category: "Business & Company Formation",
        videoUrl: "https://www.youtube.com/watch?v=KXq7mP2YF9A",
        thumbnailUrl: "https://img.youtube.com/vi/KXq7mP2YF9A/maxresdefault.jpg"
    },

    // ===============================
    // TRAVEL, VISA & DESTINATION
    // ===============================
    {
        title: "Direct Flights Now Available from Delhi to Tbilisi, Georgia",
        category: "Travel, Visa & Destination Updates",
        videoUrl: "https://www.youtube.com/watch?v=YpZQ3kM9A2E",
        thumbnailUrl: "https://img.youtube.com/vi/YpZQ3kM9A2E/maxresdefault.jpg"
    },
    {
        title: "Visa Updates & Travel Advisory – DU Digital Global",
        category: "Travel, Visa & Destination Updates",
        videoUrl: "https://www.youtube.com/watch?v=6WZxQ2T0P8Q",
        thumbnailUrl: "https://img.youtube.com/vi/6WZxQ2T0P8Q/maxresdefault.jpg"
    },
    {
        title: "How to Apply for Visa Easily | DU Digital Global Guide",
        category: "Travel, Visa & Destination Updates",
        videoUrl: "https://www.youtube.com/watch?v=3JmZ0KX9F2A",
        thumbnailUrl: "https://img.youtube.com/vi/3JmZ0KX9F2A/maxresdefault.jpg"
    }
];

const seedVideos = async () => {
    try {
        for (const video of videos) {
            await Video.updateOne(
                { videoUrl: video.videoUrl },
                { $setOnInsert: video },
                { upsert: true }
            );
        }

        console.log("✅ Videos seeded successfully (3 categories)");
    } catch (error) {
        console.error("❌ Error seeding videos:", error);
    }
};

module.exports = seedVideos;
