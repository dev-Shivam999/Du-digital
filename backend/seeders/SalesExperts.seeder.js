const User = require("../dist/models/User.model.js").default || require("../dist/models/User.model.js");
const OfficeLocation = require("../dist/models/OfficeLocation.model.js").default || require("../dist/models/OfficeLocation.model.js");

const salesExperts = [
    {
        name: "Rahul Sharma",
        email: "rahul.sharma@dudigital.com",
        password: "password123",
        role: "sales",
        designation: "Senior Sales Manager",
        region: "North India",
        phone: "+91 98765 43210",
        officeLocationMatch: "Delhi"
    },
    {
        name: "Priya Patel",
        email: "priya.patel@dudigital.com",
        password: "password123",
        role: "sales",
        designation: "Regional Sales Head",
        region: "West India",
        phone: "+91 98989 89898",
        officeLocationMatch: "Mumbai"
    },
    {
        name: "Anita Desai",
        email: "anita.desai@dudigital.com",
        password: "password123",
        role: "sales",
        designation: "Business Development Executive",
        region: "South India",
        phone: "+91 99887 76655",
        officeLocationMatch: "Bangalore"
    },
    {
        name: "Amit Verma",
        email: "amit.verma@dudigital.com",
        password: "password123",
        role: "sales",
        designation: "Sales Executive",
        region: "East India",
        phone: "+91 91234 56789",
        officeLocationMatch: "Kolkata"
    },
    {
        name: "John Smith",
        email: "john.smith@dudigital.com",
        password: "password123",
        role: "sales",
        designation: "Global Sales Director",
        region: "International",
        phone: "+1 555 123 4567",
        officeLocationMatch: "Dubai"
    }
];

const seedSalesExperts = async () => {
    try {
        // Clear existing sales experts (users with role sales)
        await User.deleteMany({ role: "sales" });
        console.log("Cleared existing Sales Experts (Users)");

        // Get Office Locations to map
        const locations = await OfficeLocation.find({});

        for (const expert of salesExperts) {
            // Find matching office location
            const office = locations.find(loc =>
                (loc.address && loc.address.city && loc.address.city.includes(expert.officeLocationMatch)) ||
                (loc.address && loc.address.line1 && loc.address.line1.includes(expert.officeLocationMatch)) ||
                (loc.officeName && loc.officeName.includes(expert.officeLocationMatch))
            );

            if (office) {
                expert.officeLocationId = office._id;
            } else {
                console.warn(`⚠️ Warning: Office location matching '${expert.officeLocationMatch}' not found for ${expert.name}. Expert will have no office assigned.`);
            }

            // Remove temporary matching field
            delete expert.officeLocationMatch;

            const newExpert = new User(expert);
            await newExpert.save();
            console.log(`Saved expert: ${expert.name}`);
        }

        console.log("✅ Sales Experts (Users) seeded successfully");
    } catch (error) {
        console.error("❌ Error seeding sales experts:", error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`- ${key}: ${error.errors[key].message}`);
            });
        }
    }
};

module.exports = seedSalesExperts;
