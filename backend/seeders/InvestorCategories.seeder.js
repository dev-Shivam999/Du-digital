
const mongoose = require("mongoose");
const InvestorCategory = require("../dist/models/investorRelation.model.js").default || require("../dist/models/investorRelation.model.js");

const categories = [
    { name: "Postal Ballot", slug: "postal-ballot" },
    { name: "Financial Statement", slug: "financial-statement" },
    { name: "Annual Returns", slug: "annual-returns" },
    {
        name: "Reconciliation of Share Capital Audit Report",
        slug: "reconciliation-of-share-capital-audit-report"
    },
    { name: "Annual Reports", slug: "annual-reports" },
    { name: "Shareholding Pattern", slug: "shareholding-pattern" },
    { name: "DP Certificate", slug: "dp-certificate" },
    {
        name: "Statement of Utilization of Fund",
        slug: "statement-of-utilization-of-fund"
    },
    {
        name: "Reg 40 (9) PCS Compliance Certificate",
        slug: "reg-40-9-pcs-compliance-certificate"
    },
    {
        name: "Reg 7 (3) RTA Compliance Certificate",
        slug: "reg-7-3-rta-compliance-certificate"
    },
    {
        name: "Statements of Investor Complaints",
        slug: "statements-of-investor-complaints"
    },
    { name: "NSE Filings", slug: "nse-filings" },
    {
        name: "Policies of the Companies",
        slug: "policies-of-the-companies"
    },
    { name: "Miscellaneous", slug: "miscellaneous" },
    { name: "Subsidiary Financials", slug: "subsidiary-financials" },
    {
        name: "Integrated Filing – Financial",
        slug: "integrated-filing-financial"
    },
    {
        name: "Integrated Filing – Governance",
        slug: "integrated-filing-governance"
    }
];

const seedInvestorCategories = async () => {
    
        try {
            // Connected to MongoDB (handled by index.js)

            for (const category of categories) {
                await InvestorCategory.updateOne(
                    { slug: category.slug },
                    { $setOnInsert: category },
                    { upsert: true }
                );
            }

            console.log("✅ Investor categories seeded successfully");
        } catch (error) {
            console.error("❌ Error seeding investor categories:", error);
        }
}

    module.exports = seedInvestorCategories;
