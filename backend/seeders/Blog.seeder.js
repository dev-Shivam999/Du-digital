
const Blog = require("../dist/models/Blog.model.js").default || require("../dist/models/Blog.model.js");

const blogs = [
    {
        title: "UK Visitor Visa – Complete Guide for 2025",
        content: `
<b>UK Visitor Visa – Complete Guide for 2025</b><br><br>

Applying for a UK Visitor Visa can be a smooth process if you understand the
requirements and follow the correct steps. Every year, thousands of applicants
face rejection due to incomplete documents or incorrect information.
<b>DU Digital Global</b> ensures that your application is accurate and complete.<br><br>

<b>What is a UK Visitor Visa?</b><br><br>

A UK Visitor Visa allows individuals to visit the United Kingdom for
<b>tourism, family visits, business meetings, or medical treatment</b>.
Employment is strictly prohibited under this visa category.<br><br>

<b>Documents Required</b><br><br>
• Valid Passport<br>
• Application Form<br>
• Financial Proof<br>
• Travel Itinerary<br>
• Invitation or Sponsorship Letter (if applicable)<br><br>

<b>Why Choose DU Digital Global?</b><br><br>

<b>DU Digital Global</b> provides professional visa guidance, document verification,
and end-to-end support to improve your visa approval chances.
    `,
        featuredImage:
            "https://dudigitalglobal.com/wp-content/uploads/2025/01/uk-visitor-visa.jpg",
        author: { name: "DU Digital Global" },
        category: "Visa",
        tags: "UK Visa, Visitor Visa, Travel"
    },

    {
        title: "Sponsorship Letter for UK Visa – How to Write",
        content: `
<b>Sponsorship Letter for UK Visa – How to Write</b><br><br>

A sponsorship letter is a supporting document written by a UK resident
who agrees to support the visitor during their stay.
This letter adds credibility to your visa application.<br><br>

<b>What Should the Letter Include?</b><br><br>
• Sponsor’s full name and address<br>
• Relationship with the applicant<br>
• Duration of stay<br>
• Financial responsibility details<br><br>

<b>Expert Tip</b><br><br>

A professionally drafted sponsorship letter by
<b>DU Digital Global</b> significantly improves approval chances.
    `,
        featuredImage:
            "https://dudigitalglobal.com/wp-content/uploads/2025/01/sponsorship-letter-uk.jpg",
        author: { name: "DU Digital Global" },
        category: "Visa Guide",
        tags: "Sponsorship Letter, UK Visa, Visa Documents"
    },

    {
        title: "Company Formation in UAE – Step-by-Step Guide",
        content: `
<b>Company Formation in UAE – Step-by-Step Guide</b><br><br>

The UAE is one of the most preferred destinations for global entrepreneurs.
It offers <b>tax benefits, 100% ownership, and global market access</b>.<br><br>

<b>Types of Companies in UAE</b><br><br>
• Mainland Company<br>
• Free Zone Company<br>
• Offshore Company<br><br>

<b>Why DU Digital Global?</b><br><br>

<b>DU Digital Global</b> offers complete business setup services including
licensing, bank account opening, and compliance support.
    `,
        featuredImage:
            "https://dudigitalglobal.com/wp-content/uploads/2025/01/company-formation-uae.jpg",
        author: { name: "DU Digital Global" },
        category: "Business",
        tags: "UAE Business, Company Formation, Dubai"
    },

    {
        title: "Why Choose DU Digital Global for Visa Services",
        content: `
<b>Why Choose DU Digital Global for Visa Services</b><br><br>

With a strong international presence, <b>DU Digital Global</b>
offers reliable visa and consular services worldwide.<br><br>

<b>Our Strengths</b><br><br>
• Global office network<br>
• Experienced visa professionals<br>
• Transparent processes<br>
• Fast turnaround time<br><br>

Your visa journey becomes smooth and stress-free with us.
    `,
        featuredImage:
            "https://dudigitalglobal.com/wp-content/uploads/2025/01/du-digital-global-services.jpg",
        author: { name: "DU Digital Global" },
        category: "Company",
        tags: "Visa Services, DU Digital Global, Immigration"
    },

    {
        title: "Latest Travel & Visa Updates for International Travelers",
        content: `
<b>Latest Travel & Visa Updates for International Travelers</b><br><br>

Staying updated with travel and visa regulations is crucial.
Rules may change frequently depending on destination and season.<br><br>

<b>Important Updates</b><br><br>
• Visa policy changes<br>
• Flight route updates<br>
• Embassy guidelines<br><br>

<b>Stay Informed with DU Digital Global</b><br><br>

Our experts keep you updated with the latest travel advisories
to ensure a hassle-free travel experience.
    `,
        featuredImage:
            "https://dudigitalglobal.com/wp-content/uploads/2025/01/travel-updates.jpg",
        author: { name: "DU Digital Global" },
        category: "Travel Updates",
        tags: "Travel News, Visa Updates, Flights"
    }
];

const seedBlogs = async () => {
    try {
        for (const blog of blogs) {
            await Blog.updateOne(
                { title: blog.title },
                { $setOnInsert: blog },
                { upsert: true }
            );
        }
        console.log("✅ 5 blogs seeded successfully with large formatted content");
    } catch (error) {
        console.error("❌ Error seeding blogs:", error);
    }
};

module.exports = seedBlogs;
