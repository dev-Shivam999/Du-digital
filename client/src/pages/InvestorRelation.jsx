import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvestorCategoryBySlug } from "../redux/slices/investorSlice";
// import investorData from "../data/investorRelation.json";

const InvestorRelation = () => {
    const { slug } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const { category, reports, loading, error } = useSelector(
        (state) => state.investor
    );

    const activeSlug = slug || (location.pathname === "/investor-relation" ? "investor-relations" : null);

    useEffect(() => {
        if (activeSlug) {
            dispatch(fetchInvestorCategoryBySlug(activeSlug));
        }
    }, [activeSlug, dispatch]);

    if (activeSlug && loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1033]" />
            </div>
        );
    }

    if (activeSlug && error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-[#FF1033] text-lg">{error}</p>
            </div>
        );
    }

    const displayData =
        activeSlug && category
            ? {
                  hero: {
                      title: category.name || "Investor Relation",
                      backgroundImage:
                          category.sildeImage ||
                          "/assets/contact/contact-hero.jpg",
                        
                  },
                  reports: reports || [],
              }
            : null;

    if (!displayData) return null;

    return (
        <div className="w-full">
            {/* ===== HERO ===== */}
            <section className="relative h-[600px]  flex items-center justify-center overflow-hidden">
                <img
                    src={displayData.hero.backgroundImage}
                    alt="Investor Relation"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-black/60" />
                <h1 className="relative z-10 text-white text-4xl  font-semibold">
                    {displayData.hero.title}
                </h1>
            </section>

            {/* ===== REPORTS ===== */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
                    {displayData.reports && displayData.reports.length > 0 ? (
                        displayData.reports.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="
                                    group
                                    bg-white border border-gray-200
                                    rounded-xl p-8
                                    flex flex-col justify-between
                                    transition-all duration-300
                                    hover:bg-[#6B0F0F]
                                    hover:border-[#6B0F0F]
                                "
                            >
                                {/* CONTENT */}
                                <div>
                                    <h3
                                        className="
                                            text-lg font-regular  mb-4 leading-snug
                                            text-gray-900
                                            group-hover:text-white
                                        "
                                    >
                                        {item.title}
                                    </h3>
                                    {item.email && (
                                        <p
                                            className="
                                                text-sm text-gray-600
                                                group-hover:text-gray-200
                                            "
                                        >
                                            {item.email}
                                        </p>
                                    )}
                                    {item.description && (
                                        <p
                                            className="
                                                text-sm text-gray-600
                                                group-hover:text-gray-200
                                            "
                                        >
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {/* CTA */}
                                <a
                                    href={`${import.meta.env.VITE_API_URL}${item.fileUrl}`}
                                    target="_blank"
                                    className="
                                        mt-8 inline-flex items-center justify-center
                                        px-6 py-3 rounded-md font-normal
                                        border-2 border-[#FF3B1F]
                                        text-[#FF3B1F]
                                        transition-all duration-300
                                        group-hover:bg-[#FF3B1F]
                                        group-hover:text-white
                                        group-hover:border-[#FF3B1F]
                                    "
                                >
                                    {item.buttonText || "Download Report"}
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-600">
                            No reports available.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default InvestorRelation;













// import { useEffect } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchInvestorCategoryBySlug } from "../redux/slices/investorSlice";
// import investorData from "../data/investorRelation.json";

// const InvestorRelation = () => {
//     const { slug } = useParams();
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const { category, reports, loading, error } = useSelector(state => state.investor);
    
//     // Check if we're on the main investor-relation page
//     const isMainPage = location.pathname === '/investor-relation';

//     // Fetch category data when slug changes
//     useEffect(() => {
//         if (slug) {
//             dispatch(fetchInvestorCategoryBySlug(slug));
//         }
//     }, [slug, dispatch]);

//     // Show loading state only when fetching a slug
//     if (slug && loading) {
//         return (
//             <div className="w-full min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1033] mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Show error state only when there's an error fetching a slug
//     if (slug && error) {
//         return (
//             <div className="w-full min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-[#FF1033] text-lg mb-4">Error: {error}</p>
//                     <p className="text-gray-600">Failed to load category data</p>
//                 </div>
//             </div>
//         );
//     }

//     // Use API data if slug exists and data is loaded, otherwise use static data
//     const displayData = slug && category ? {
//         hero: {
//             title: category.name || "Investor Relation",
//             backgroundImage: category.sildeImage || "/assets/contact/contact-hero.jpg"
//         },
//         reports: reports || []
//     } : investorData;

//     return (
//         <div className="w-full">
//             {/* ===== Hero ===== */}
//             <section
//                 className="h-[320px] bg-cover bg-center relative flex items-center justify-center"
//                 style={{ backgroundImage: `url(${displayData.hero.backgroundImage})` }}
//             >
//                 <div className="absolute inset-0 bg-black/60" />
//                 <h1 className="relative z-10 text-white text-4xl font-semibold">
//                     {displayData.hero.title}
//                 </h1>
//             </section>

//             {/* ===== Reports Section ===== */}
//             {displayData.reports && displayData.reports.length > 0 ? (
//                 <section className="py-20 bg-gray-50">
//                     <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
//                         {displayData.reports.map((item, index) => (
//                             isMainPage ? (
//                                 // Card Type 1: For /investor-relation page
//                                 <div
//                                     key={item._id || index}
//                                     className="bg-white rounded-xl   p-8 flex flex-col justify-between   transition"
//                                 >
//                                     <div>
//                                         <h3 className="text-lg font-semibold mb-4 leading-snug">
//                                             {item.title}
//                                         </h3>
//                                         {item.description && (
//                                             <p className="text-gray-700 mb-8">
//                                                 {item.description}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <a
//                                         href={item.fileUrl || item.file}
//                                         download
//                                         className="inline-block bg-[#FF1033] hover:bg-[#511313] text-white font-medium px-6 py-3 rounded-md text-center transition mt-4"
//                                     >
//                                         {item.buttonText || "Download Report"}
//                                     </a>
//                                 </div>
//                             ) : (
//                                 // Card Type 2: For slug pages (e.g., /postal-ballot)
//                                 <div
//                                     key={item._id || index}
//                                     className="bg-[#E4F2EF] rounded-xl   p-8 flex flex-col   transition"
//                                 >
//                                     <div className="mb-6">
//                                         <h3 className="text-lg font-semibold mb-3 leading-tight text-gray-900">
//                                             {item.title}
//                                         </h3>
//                                         {/* {item.financialYear && (
//                                             <div className="flex items-center gap-4 mb-3">
//                                                 <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
//                                                     FY {item.financialYear}
//                                                 </span>
//                                                 {item.uploadedDate && (
//                                                     <span className="text-sm text-gray-500">
//                                                         {new Date(item.uploadedDate).toLocaleDateString('en-US', { 
//                                                             year: 'numeric', 
//                                                             month: 'short', 
//                                                             day: 'numeric' 
//                                                         })}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         )} */}
//                                     </div>

//                                     <a
//                                         href={item.fileUrl || item.file}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="inline-flex items-center justify-center gap-4 bg-[#FF1033] hover:bg-[#511313] text-white font-semibold px-6 py-3 rounded-md transition mt-auto"
//                                     >
//                                         <span>{item.buttonText || "Download Report"}</span>
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                                         </svg>
//                                     </a>
//                                 </div>
//                             )
//                         ))}
//                     </div>
//                 </section>
//             ) : (
//                 <section className="py-20 bg-gray-50">
//                     <div className="max-w-6xl mx-auto px-4 text-center">
//                         <p className="text-gray-600 text-lg">No reports available for this category.</p>
//                     </div>
//                 </section>
//             )}
//         </div>
//     );
// };

// export default InvestorRelation;
