
const InvestorCategory = require("../dist/models/investorRelation.model.js").default || require("../dist/models/investorRelation.model.js");
const InvestorReport = require("../dist/models/InvestorReport.model.js").default || require("../dist/models/InvestorReport.model.js");

const reportsData = [
    {
        slug: "postal-ballot",
        reports: [
            {
                title: "Proceedings of Postal Ballot – 08 March 2025",
                fileUrl:
                    "https://dudigitalglobal.com/postal-ballot/#proceedings-of-postal-ballot-08-march-2025",
                financialYear: "2025"
            },
            {
                title: "Voting Results Scrutiniser Report – 7 March 2025",
                fileUrl:
                    "https://dudigitalglobal.com/postal-ballot/#voting-results-scrutiniser-report-7-march-2025",
                financialYear: "2025"
            }
        ]
    },
    {
        slug: "financial-statement",
        reports: [
            {
                title: "Financial Results for Half Year ended September 30, 2025",
                fileUrl: "https://dudigitalglobal.com/financial-statement/#half-year-2025",
                financialYear: "2025"
            },
            {
                title: "Financial Statement for the year ended 31st March, 2025",
                fileUrl: "https://dudigitalglobal.com/financial-statement/#fy-2024-25",
                financialYear: "2024-25"
            }
        ]
    },
    {
        slug: "annual-returns",
        reports: [
            {
                title: "Annual Return 2023-24",
                fileUrl: "https://dudigitalglobal.com/annual-returns/#annual-return-2023-24",
                financialYear: "2023-24"
            },
            {
                title: "Annual Return 2022-23",
                fileUrl: "https://dudigitalglobal.com/annual-returns/#annual-return-2022-23",
                financialYear: "2022-23"
            }
        ]
    },
    {
        slug: "reconciliation-of-share-capital-audit-report",
        reports: [
            {
                title: "Reg. 74 (5) Certificate June 2025",
                fileUrl:
                    "https://dudigitalglobal.com/reconciliation-of-share-capital-audit-report/#certificate-june-2025",
                financialYear: "2025"
            }
        ]
    },
    {
        slug: "annual-reports",
        reports: [
            {
                title: "Corrigendum to Annual Report 2025 (PDF)",
                fileUrl:
                    "https://dudigitalglobal.com/wp-content/uploads/2025/10/Corrigendum-to-Annual-Report-2025.pdf",
                financialYear: "2024-25"
            }
        ]
    },
    {
        slug: "shareholding-pattern",
        reports: [
            {
                title: "Shareholding Pattern Report March 2025",
                fileUrl:
                    "https://dudigitalglobal.com/shareholding-pattern/#report-march-2025",
                financialYear: "2025"
            }
        ]
    },
    {
        slug: "dp-certificate",
        reports: [
            {
                title: "DP Certificate Placeholder",
                fileUrl: "https://dudigitalglobal.com/dp-certificate/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "statement-of-utilization-of-fund",
        reports: [
            {
                title: "Statement of Utilization of Fund Placeholder",
                fileUrl: "https://dudigitalglobal.com/statement-of-utilization-of-fund/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "reg-40-9-pcs-compliance-certificate",
        reports: [
            {
                title: "Reg. 40 (9) Certificate March 2024",
                fileUrl:
                    "https://dudigitalglobal.com/reg-40-9-pcs-compliance-certificate/#certificate-march-2024",
                financialYear: "2024"
            }
        ]
    },
    {
        slug: "reg-7-3-rta-compliance-certificate",
        reports: [
            {
                title: "Reg 7 (3) RTA Compliance Placeholder",
                fileUrl:
                    "https://dudigitalglobal.com/reg-7-3-rta-compliance-certificate/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "statements-of-investor-complaints",
        reports: [
            {
                title: "Statements of Investor Complaints Placeholder",
                fileUrl:
                    "https://dudigitalglobal.com/statements-of-investor-complaints/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "nse-filings",
        reports: [
            {
                title: "NSE Filings Placeholder",
                fileUrl: "https://dudigitalglobal.com/nse-filings/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "policies-of-the-companies",
        reports: [
            {
                title: "Policies of the Companies Placeholder",
                fileUrl: "https://dudigitalglobal.com/policies-of-the-companies/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "miscellaneous",
        reports: [
            {
                title: "Miscellaneous Reports Placeholder",
                fileUrl: "https://dudigitalglobal.com/miscellaneous/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "subsidiary-financials",
        reports: [
            {
                title: "Subsidiary Financials Placeholder",
                fileUrl: "https://dudigitalglobal.com/subsidiary-financials/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "integrated-filing-financial",
        reports: [
            {
                title: "Integrated Filing – Financial Placeholder",
                fileUrl:
                    "https://dudigitalglobal.com/integrated-filing-financial/",
                financialYear: ""
            }
        ]
    },
    {
        slug: "integrated-filing-governance",
        reports: [
            {
                title: "Integrated Filing – Governance Placeholder",
                fileUrl:
                    "https://dudigitalglobal.com/integrated-filing-governance/",
                financialYear: ""
            }
        ]
    }
];

const seedInvestorReports = async () => {
    try {
        for (const data of reportsData) {
            const category = await InvestorCategory.findOne({ slug: data.slug });
            if (!category) {
                console.warn(`Category not found: ${data.slug}`);
                continue;
            }

            for (const rpt of data.reports) {
                await InvestorReport.updateOne(
                    { title: rpt.title, categoryId: category._id },
                    {
                        $setOnInsert: {
                            categoryId: category._id,
                            title: rpt.title,
                            fileUrl: rpt.fileUrl,
                            financialYear: rpt.financialYear
                        }
                    },
                    { upsert: true }
                );
            }
        }
        console.log("✅ Investor reports seeded with real URLs where available");
    } catch (err) {
        console.error("❌ Error seeding investor reports:", err);
    }
};

module.exports = seedInvestorReports;
