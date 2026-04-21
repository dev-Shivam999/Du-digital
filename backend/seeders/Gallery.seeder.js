
const Gallery = require("../dist/models/Gallery.model.js").default || require("../dist/models/Gallery.model.js");

const data = [
    "https://dudigitalglobal.com/wp-content/uploads/2024/12/Photo-2.jpeg",
    "https://dudigitalglobal.com/wp-content/uploads/2024/12/Photo-2.jpeg",
    "https://dudigitalglobal.com/wp-content/uploads/2024/12/Photo-3.jpeg",
    "https://dudigitalglobal.com/wp-content/uploads/2024/12/Untitled-du.png",
    "https://dudigitalglobal.com/wp-content/uploads/2024/12/Untitled-du-1.png",
    "https://dudigitalglobal.com/wp-content/uploads/2024/12/Photo-7-scaled-1.jpg"
]

const GallerySeeder = async () => {
    try {
        // Use Promise.all for better async handling in map
        await Promise.all(data.map(async (i) => (await Gallery.create({ FileUser: i }))));
        console.log("Gallery seeded successfully");
    } catch (error) {
        console.error("Error seeding gallery:", error);
    }
}



module.exports = GallerySeeder;