
const Event = require("../dist/models/event.model.js").default || require("../dist/models/event.model.js");

const eventsData = [
    {
        title:
            "Expanding Horizons: DU Digital Global & Meydan Free Zone Showcase UAE Company Formation Opportunities",
        description:
            "A collaboration event highlighting company formation opportunities in UAE with Meydan Free Zone.",
        date: new Date("2025-10-10"),
        venue: "Dubai, UAE",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/expanding-horizons-du-digital-global-meydan-free-zone/",
        isFeatured: true
    },
    {
        title:
            "Expanding Footprints: DU Digital Global Opens the Indian Consular Application Centre (ICAC) in Bangkok, Thailand",
        description:
            "Inaugural event marking the opening of the ICAC center in Bangkok to assist visa services.",
        date: new Date("2025-08-20"),
        venue: "Bangkok, Thailand",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-digital-global-opens-indian-consular-application-centre-bangkok/",
    },
    {
        title:
            "New Horizons: DU Digital Global Opens the Indian Consular Application Centre (ICAC) in Seoul, South Korea",
        description:
            "Launch event for the South Korea ICAC center.",
        date: new Date("2025-07-25"),
        venue: "Seoul, South Korea",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-digital-global-opens-indian-consular-application-centre-seoul/",
    },
    {
        title:
            "DU Digital Global’s Sixth DU CONNECT Network Meet in Bangalore",
        description:
            "Networking event aimed at strengthening travel alliances through collaboration and growth.",
        date: new Date("2025-06-15"),
        venue: "Bangalore, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-connect-network-meet-bangalore/",
    },
    {
        title:
            "DU Digital Global’s Fifth DU CONNECT Network Meet in Chandigarh",
        description:
            "A high-impact meet focused on travel partnership development.",
        date: new Date("2025-05-20"),
        venue: "Chandigarh, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-connect-network-meet-chandigarh/",
    },
    {
        title: "Du Digital Global in SATTE 2025",
        description:
            "Participation and exhibition by DU Digital Global at SATTE 2025 travel event.",
        date: new Date("2025-03-05"),
        venue: "Greater Noida, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-digital-global-in-satte-2025/",
    },
    {
        title:
            "DUDIGITAL Global's Fourth DU CONNECT Network Meet in Ahmedabad",
        description:
            "Inaugural network meet aimed at uniting travel agents and partners.",
        date: new Date("2024-12-10"),
        venue: "Ahmedabad, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-connect-network-meet-ahmedabad/",
    },
    {
        title:
            "DU Digital Shines as Proud Sponsor of Indian Chambers of Commerce AGM and Annual Session in Kolkata 2023",
        description:
            "Sponsorship and participation event at ICC AGM in Kolkata.",
        date: new Date("2023-11-15"),
        venue: "Kolkata, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-digital-shines-as-proud-sponsor-icc-agm-kolkata/",
    },
    {
        title:
            "DU Digital Global's Third DU CONNECT Network Meet in Kolkata",
        description:
            "Networking event aimed at travel agent collaboration.",
        date: new Date("2023-09-20"),
        venue: "Kolkata, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-connect-network-meet-kolkata/",
    },
    {
        title:
            "DU Digital Global's Second DU CONNECT Network Meet in Mumbai",
        description:
            "Second edition network meet for travel partnership growth.",
        date: new Date("2023-08-10"),
        venue: "Mumbai, India",
        sourceUrl:
            "https://dudigitalglobal.com/news-and-media/event/du-connect-network-meet-mumbai/",
    }
];

const seedEvents = async () => {
    try {
        for (const evt of eventsData) {
            await Event.updateOne(
                { title: evt.title },
                { $setOnInsert: evt },
                { upsert: true }
            );
        }
        console.log("✅ Event data seeded successfully (~10 records)");
    } catch (error) {
        console.error("❌ Error seeding events:", error);
    }
};

module.exports = seedEvents;
