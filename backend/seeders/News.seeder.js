
const NewsMedia = require("../dist/models/News.model.js").default || require("../dist/models/News.model.js");

const newsData = [
    {
        title: "DU Digital Global Opens Indian Consular Centres in Bangkok & Chiang Mai",
        datePublished: new Date("2024-07-15"),
        source: "Travel Biz Monitor",
        excerpt:
            "DU Digital Global has launched Indian Consular Centres in Thailand to enhance visa and passport-related services.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-opens-indian-consular-centres-in-bangkok-chiang-mai/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/07/news-1.jpg",
        isFeatured: true
    },
    {
        title: "DU Digital Global Expands Visa Facilitation Services Across Asia",
        datePublished: new Date("2024-06-20"),
        source: "ANI",
        excerpt:
            "The company is expanding its footprint across Asia with enhanced visa facilitation services.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-expands-visa-facilitation-services-across-asia/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/06/news-2.jpg"
    },
    {
        title: "DU Digital Global Strengthens Presence in Middle East",
        datePublished: new Date("2024-06-05"),
        source: "The Print",
        excerpt:
            "With new offices in the UAE, DU Digital Global aims to serve travelers more efficiently.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-strengthens-presence-in-middle-east/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/06/news-3.jpg"
    },
    {
        title: "DU Digital Global Partners with Airlines for Seamless Travel Solutions",
        datePublished: new Date("2024-05-22"),
        source: "Business Standard",
        excerpt:
            "The partnership will improve end-to-end travel services for international travelers.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-partners-with-airlines/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/05/news-4.jpg"
    },
    {
        title: "Visa Processing Time Reduced by DU Digital Global",
        datePublished: new Date("2024-05-10"),
        source: "Financial Express",
        excerpt:
            "The company introduces new digital workflows to reduce visa processing time.",
        link:
            "https://dudigitalglobal.com/news-and-media/visa-processing-time-reduced/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/05/news-5.jpg"
    },
    {
        title: "DU Digital Global Launches New Customer Support Platform",
        datePublished: new Date("2024-04-28"),
        source: "Tech Circle",
        excerpt:
            "A new AI-enabled customer support platform was launched to assist applicants.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-launches-customer-support-platform/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/04/news-6.jpg"
    },
    {
        title: "DU Digital Global Wins Excellence Award in Travel Services",
        datePublished: new Date("2024-04-10"),
        source: "Travel Daily",
        excerpt:
            "The company was recognized for its innovation in visa and consular services.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-wins-excellence-award/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/04/news-7.jpg"
    },
    {
        title: "Digital Transformation Driving DU Digital Global Growth",
        datePublished: new Date("2024-03-25"),
        source: "Economic Times",
        excerpt:
            "Digital initiatives are helping DU Digital Global scale operations globally.",
        link:
            "https://dudigitalglobal.com/news-and-media/digital-transformation-driving-growth/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/03/news-8.jpg"
    },
    {
        title: "DU Digital Global Enhances Security in Visa Processing",
        datePublished: new Date("2024-03-12"),
        source: "Cyber Security News",
        excerpt:
            "New security measures ensure safer handling of applicant data.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-enhances-security/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/03/news-9.jpg"
    },
    {
        title: "DU Digital Global to Open More Centres in South Asia",
        datePublished: new Date("2024-02-28"),
        source: "South Asia Monitor",
        excerpt:
            "Expansion plans include new centres across South Asian countries.",
        link:
            "https://dudigitalglobal.com/news-and-media/du-digital-global-open-more-centres-south-asia/",
        imageUrl:
            "https://dudigitalglobal.com/wp-content/uploads/2024/02/news-10.jpg"
    }
];

const seedNewsMedia = async () => {
    try {
        for (const item of newsData) {
            await NewsMedia.updateOne(
                { title: item.title },
                { $setOnInsert: item },
                { upsert: true }
            );
        }
        console.log("✅ News & Media seeded successfully (10 records)");
    } catch (error) {
        console.error("❌ Error seeding News & Media:", error);
    }
};

module.exports = seedNewsMedia;
