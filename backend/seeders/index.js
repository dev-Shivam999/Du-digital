const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import Seeders
const seedGallery = require("./Gallery.seeder");
const seedInvestorCategories = require("./InvestorCategories.seeder");
const seedInvestorReports = require("./InvestorReports.seeder");
const seedNews = require("./News.seeder");
const seedOfficeLocations = require("./OfficeLocation.seeder");
const seedSalesExperts = require("./SalesExperts.seeder");
const seedEvents = require("./event.seeder");
const seedVideos = require("./video.seeder");
const seedBlogs = require("./Blog.seeder");
const TeamMember = require("./TeamMember.seeder");
const seedUsers = require("./User.seeder");

const seedAll = async () => {
    try {
        console.log("🌱 Starting Database Seed...");

        // Connect to DB
        const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dudigital";
        await mongoose.connect(dbUri);
        console.log(`✅ Connected to MongoDB: ${dbUri}`);

        // Run Seeders Sequentially
        console.log("\n--- Seeding Video ---");
        await seedVideos();

        console.log("\n--- Seeding Blogs ---");
        await seedBlogs();

        console.log("\n--- Seeding Events ---");
        await seedEvents();

        console.log("\n--- Seeding News ---");
        await seedNews();

        console.log("\n--- Seeding Gallery ---");
        await seedGallery();

        console.log("\n--- Seeding Investor Categories ---");
        await seedInvestorCategories();

        console.log("\n--- Seeding Investor Reports ---");
        await seedInvestorReports();

        console.log("\n--- Seeding Office Locations ---");
        await seedOfficeLocations();

        console.log("\n--- Seeding Sales Experts ---");
        await seedSalesExperts();
        console.log("\n--- Seeding Team Member ---");
        await TeamMember();

        console.log("\n--- Seeding Users ---");
        await seedUsers();

        console.log("\n✅ All seeders executed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Database disconnected");
    }
};

seedAll();
