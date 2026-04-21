const User = require("../dist/models/User.model.js").default || require("../dist/models/User.model.js");

const users = [
    {
        name: "Admin User",
        email: "admin@dudigital.com",
        password: "adminpassword123", // Will be hashed by pre-save hook
        role: "admin",
        permissions: [],// Admin has all permissions by default
        receivePartnerNotifications: true
    },
    {
        name: "HR Manager",
        email: "hr@dudigital.com",
        password: "hrpassword123",
        role: "hr",
        permissions: ["manage_careers", "view_employees"]
    }
];

const seedUsers = async () => {
    try {
        for (const user of users) {
            // Check if user exists
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                const newUser = new User(user);
                await newUser.save();
                console.log(`✅ Created user: ${user.email}`);
            } else {
                console.log(`ℹ️ User already exists: ${user.email}`);
            }
        }
        console.log("✅ Users seeded successfully");
    } catch (error) {
        console.error("❌ Error seeding users:", error);
    }
};

module.exports = seedUsers;
