import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, MoveRight } from "lucide-react";
import { groupByYear } from "../../utils/groupByYear";
import { fetchNews } from '../../redux/slices/newsSlice';

const NewsCoverage = ({ data: propData }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { news: reduxData, totalPages, loading, error, currentPage, yearCounts } = useSelector((state) => state.news);
    const data = propData || reduxData;

    const grouped = groupByYear(data || []);
    const years = Object.keys(grouped).sort((a, b) => b - a);
    const [openYear, setOpenYear] = useState(years[0]);
    const [visibleCounts, setVisibleCounts] = useState({});

    useEffect(() => {
        // Skip fetch if SSR already preloaded the data
        if (!propData && !loading && reduxData.length === 0) {
            dispatch(fetchNews({ page: 1 }));
        }
    }, [dispatch, propData]);

    const handleLoadMore = (year) => {
        const currentYearLocalCount = grouped[year]?.length || 0;
        const totalYearGlobalCount = yearCounts?.[year] || 0;

        // If we still have hidden items locally for this year, just show more of them
        const nextVisibleCount = (visibleCounts[year] || 6) + 6;
        setVisibleCounts(prev => ({
            ...prev,
            [year]: nextVisibleCount
        }));

        // If we have shown all local items but the backend says there are more for this year, fetch next page
        if (!propData && nextVisibleCount >= currentYearLocalCount && currentYearLocalCount < totalYearGlobalCount && currentPage < totalPages) {
            dispatch(fetchNews({ page: currentPage + 1, append: true }));
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 md:px-12">
            {loading && data.length === 0 && (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-[#FF1033] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {error && data.length === 0 && (
                <div className="text-center text-[#FF1033] py-20 bg-red-50 rounded-2xl border border-red-100 italic">
                    Error loading news: {error}
                </div>
            )}

            {years.map((year) => {
                const yearVisibleCount = visibleCounts[year] || 6;
                const itemsToShow = (grouped[year] || []).slice(0, yearVisibleCount);

                // Smart check for "Load More":
                // 1. Either we have more items locally hidden (grouped[year].length > visible)
                // 2. Or the backend total for this year is greater than what we have locally
                const hasMoreInYear =
                    (grouped[year]?.length || 0) > yearVisibleCount ||
                    (!propData && (grouped[year]?.length || 0) < (yearCounts?.[year] || 0));

                return (
                    <div key={year} className="border-b border-gray-100 last:border-0">
                        {/* YEAR HEADER */}
                        <button
                            onClick={() => setOpenYear(openYear === year ? null : year)}
                            className="w-full flex justify-between items-center py-6 text-xl font-bold transition-all group"
                        >
                            <span className={`transition-colors duration-300 ${openYear === year ? "text-[#FF1033]" : "text-gray-900 group-hover:text-[#FF1033]"}`}>
                                {year}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openYear === year ? "bg-[#FF1033] text-white rotate-180" : "bg-gray-50 text-gray-400"}`}>
                                <ChevronDown size={20} />
                            </div>
                        </button>

                        {/* NEWS LIST */}
                        {openYear === year && (
                            <div className="space-y-8 pb-10 animate-fadeIn">
                                <div className="grid grid-cols-1 gap-8">
                                    {itemsToShow.map((item) => (
                                        <a
                                            key={item._id}
                                            href={item.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex flex-col md:flex-row gap-8 group relative"
                                        >
                                            <div className="md:w-[320px] aspect-16/10 overflow-hidden rounded-2xl shadow-sm">
                                                <img
                                                    src={`${import.meta.env.VITE_BACKEND_IMAGES_URL}${item.imageUrl}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-center py-2">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 bg-red-50 text-[#FF1033] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        {item.source || "News Coverage"}
                                                    </span>
                                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        {new Date(item.datePublished).toLocaleDateString("en-IN", {
                                                            month: "long",
                                                            year: "numeric",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                </div>

                                                <h4 className="text-xl md:text-2xl font-bold leading-tight text-gray-900 group-hover:text-[#FF1033] transition-colors duration-300 mb-4 line-clamp-3">
                                                    {item.title}
                                                </h4>

                                                <div className="flex items-center gap-2 text-[#FF1033] font-bold text-sm tracking-wide">
                                                    READ ARTICLE
                                                    <MoveRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                {hasMoreInYear && (
                                    <div className="flex justify-center pt-8">
                                        <button
                                            onClick={() => handleLoadMore(year)}
                                            disabled={loading}
                                            className="px-12 py-4 border-2 border-[#FF1033] text-[#FF1033] rounded-full font-bold hover:bg-[#FF1033] hover:text-white transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-transparent hover:shadow-red-200"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    <span>LOADING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    LOAD MORE
                                                    <span className="text-xs opacity-70">({year})</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default NewsCoverage;
