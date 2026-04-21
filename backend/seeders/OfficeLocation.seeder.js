
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

// Handle default exports from compiled TypeScript
const loadModel = (modelPath) => {
    const model = require(modelPath);
    return model.default || model;
};

const OfficeLocation = loadModel("../dist/models/OfficeLocation.model.js");
const OfficeType = loadModel("../dist/models/OfficeType.model.js");

const indiaData = [
    {
        "city": "Chennai, India",
        "address": [
            "3rd Floor, Alsa Mall, T-11/12, Egmore",
            "Red Cross Road, Chennai, Tamil Nadu – 600008"
        ]
    },
    {
        "city": "Guwahati, India",
        "address": [
            "Exotica Greens, 4th Floor",
            "RG Baruah Road, Guwahati, Assam",
            "P.S – Geetanagar",
            "P.O – Japorigog Post Office",
            "Kamrup (Metro), Assam – 781005"
        ]
    },
    {
        "city": "Kolkata, India",
        "address": [
            "1st Floor, Plot No. 15 (Infinium Digi Space)",
            "CP Block, Sector 5, Salt Lake",
            "Kolkata – 700091"
        ],
        "email": "info@bdvisa.com",
        "phone": "+91-7289000071"
    },
    {
        "city": "Mumbai, India",
        "address": [
            "Unit no. 404-B, 4th Floor, Prathamesh Tower – B Wing",
            "C.S. No. 107 – Lower Parel Division",
            "Raghuvanshi Mill, 11, 12 Senapati Bapat Marg",
            "Lower Parel, Mumbai – 400013"
        ]
    },
    {
        "city": "Silchar, India",
        "address": [
            "Goldighi Municipality Mall",
            "Shop No 105, 106 & 107, Near Premtola Point",
            "Central Road, PO – Silchar, PS – Silchar Sadar",
            "District – Cachar, Assam – 788001"
        ]
    },
    {
        "city": "Siliguri, India",
        "address": [
            "Sonali Bank White House 304/3",
            "Sevoke Road, P.S: Siliguri – 734001"
        ]
    },
    {
        "city": "Bongaigaon, India",
        "address": [
            "Third Floor, Arham Towers",
            "Bongaigaon Town Part-V (Ward No. 6)",
            "Municipal Holding No. 81",
            "Bongaigaon Revenue Circle",
            "P.O. P.S & Sub-Registry Office – Bongaigaon",
            "Assam – 781005"
        ]
    },
    // New India Office
    {
        "city": "New Delhi, India",
        "address": [
            "C-4, Commercial Complex",
            "Safdarjung Development Area",
            "New Delhi - 110016"
        ],
        "phone": "+91-7289000071",
        "email": "info@dudigitalglobal.com"
    }
];

const globalData = [
    {
        "city": "Chittagong, Bangladesh",
        "address": [
            "DUDigital Technologies Limited",
            "Mostafa Center, 1102/A",
            "Agrabad C/A, Chattogram"
        ]
    },
    {
        "city": "Kathmandu, Nepal",
        "address": [
            "DUDigital Pvt Ltd.",
            "Shop no. 233 & 234, 1st Floor",
            "Chhaya Centre, Thamel, Kathmandu"
        ]
    },
    {
        "city": "Nugegoda, Sri Lanka",
        "address": [
            "DUDigital Global (Lanka) (Pvt) Ltd.",
            "No. 8, 1/2, Old Kesbewa Road",
            "Delkanda, Nugegoda – 10250"
        ]
    },
    {
        "city": "Dhaka, Bangladesh",
        "address": [
            "DUDigital Technologies Limited",
            "PBL Tower (13th Floor)",
            "17, Gulshan North C/A, Gulshan-2",
            "Dhaka – 1212"
        ]
    },
    {
        "city": "Sharjah, UAE",
        "address": [
            "Sharjah Media City (Shams)",
            "P.O. Box: 515000",
            "Sharjah, UAE"
        ]
    },
    // Updated/New Global Offices
    {
        "city": "Bangkok, Thailand",
        "address": [
            "Unit No. 36/28, 10th Floor",
            "P.S. Tower, Sukhumvit 21 (Asoke) Road",
            "North Klongtoey Sub-district",
            "Wattana District, Bangkok"
        ],
        "phone": "+6624606805",
        "email": "icac.bangkok@dudigitalglobal.com"
    },
    {
        "city": "Seoul, South Korea",
        "address": [
            "4th Floor, 76-42, Namhan Building",
            "Hannam-Dong, Yongsan-Gu",
            "Seoul, South Korea - 04401"
        ],
        "phone": "+82-220235847",
        "email": "icac.seoul@dudigitalglobal.com"
    },
    {
        "city": "Dubai, UAE",
        "address": [
            "Office #4001, 40th Floor",
            "Aspin Commercials Tower",
            "Sheikh Zayed Road, Dubai, UAE"
        ],
        "phone": "+971-585955766",
        "email": "info@dudigitalglobal.com"
    }
];

const seedOfficeData = async () => {
    try {
        // Connected to MongoDB (handled by index.js)

        // 1. Seed Office Types
        console.log("Seeding Office Types...");

        const indiaType = await OfficeType.findOneAndUpdate(
            { code: "INDIA" },
            {
                name: "Domestic (India)",
                code: "INDIA",
                description: "Office locations within India",
                isActive: true
            },
            { upsert: true, new: true }
        );

        const globalType = await OfficeType.findOneAndUpdate(
            { code: "GLOBAL" },
            {
                name: "International (Global)",
                code: "GLOBAL",
                description: "Office locations outside India",
                isActive: true
            },
            { upsert: true, new: true }
        );

        console.log("Office Types seeded");

        // 2. Clear existing locations
        await OfficeLocation.deleteMany({});
        console.log("Cleared existing Office Locations");

        // 3. Prepare and Insert Locations
        const parseAddress = (item) => {
            const cityName = item.city.split(',')[0].trim();
            const countryName = item.city.split(',').pop().trim();

            const fullAddressString = Array.isArray(item.address) ? item.address.join(" ") : item.address;

            // Loose regex for pincode
            const pincodeMatch = fullAddressString.match(/\b\d{5,6}\b/);
            const pincode = pincodeMatch ? pincodeMatch[0] : "";

            return {
                officeName: `${cityName} Office`,
                address: {
                    line1: Array.isArray(item.address) ? item.address[0] : item.address,
                    line2: Array.isArray(item.address) ? item.address.slice(1).join(", ") : "",
                    city: cityName,
                    state: "",
                    country: countryName,
                    pincode: pincode
                },
                contact: {
                    phone: item.phone || "",
                    email: item.email || ""
                },
                isActive: true
            };
        };

        const indiaLocations = indiaData.map(item => ({
            ...parseAddress(item),
            officeTypeId: indiaType._id
        }));

        const globalLocations = globalData.map(item => ({
            ...parseAddress(item),
            officeTypeId: globalType._id
        }));

        await OfficeLocation.insertMany([...indiaLocations, ...globalLocations]);
        console.log(`Seeded ${indiaLocations.length} India locations and ${globalLocations.length} Global locations.`);

        console.log("✅ Office seeding completed successfully");
    } catch (error) {
        console.error("❌ Error seeding offices:", error);
    }
};

module.exports = seedOfficeData;