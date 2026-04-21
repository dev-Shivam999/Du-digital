import { useState, useEffect, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// CSS Imports
import "swiper/css";
import "swiper/css/navigation";

const TimelineSlider = ({ data = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    // Refs for custom navigation buttons
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // 1. DATA PROCESSING: Duplicate data to ensure smooth looping
    const processedData = useMemo(() => {
        if (!data.length) return [];
        let result = [...data];

        // We need at least 15 items for a smooth loop with slidesPerView={5}
        while (result.length < 15) {
            result = [...result, ...data];
        }
        return result;
    }, [data]);

    // Only loop if we actually have data
    const shouldLoop = processedData.length > 0;

    // Get the active item based on real index (handles loop correctly)
    const activeItem = useMemo(() => {
        if (!processedData.length) return null;
        return processedData[activeIndex] || processedData[0];
    }, [processedData, activeIndex]);

    if (!data.length) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">

                {/* --- TOP SECTION: TIMELINE & ARROWS --- */}
                <div className="relative mb-12 px-8">

                    {/* The Gray Horizontal Line */}
                    <div className="absolute top-[32px] left-0 right-0 h-[2px] bg-gray-200 z-0 mx-12" />

                    {/* Custom Previous Arrow */}
                    <button
                        ref={prevRef}
                        className="absolute left-0 top-[12px] z-20 text-[#FF1033] hover:scale-110 transition-transform disabled:opacity-30"
                    >
                        <ChevronLeft size={44} strokeWidth={2.5} />
                    </button>

                    {/* Custom Next Arrow */}
                    <button
                        ref={nextRef}
                        className="absolute right-0 top-[12px] z-20 text-[#FF1033] hover:scale-110 transition-transform disabled:opacity-30"
                    >
                        <ChevronRight size={44} strokeWidth={2.5} />
                    </button>

                    {/* Timeline Swiper - Only shows dots and years */}
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        onSlideChange={(swiper) => {
                            // Update active index when slide changes
                            setActiveIndex(swiper.realIndex);
                        }}
                        loop={shouldLoop}
                        centeredSlides={true}
                        slidesPerView={5}
                        spaceBetween={0}
                        slideToClickedSlide={true}
                        className="timeline-swiper pt-2 pb-4"
                        breakpoints={{
                            0: { slidesPerView: 3 },
                            640: { slidesPerView: 5 },
                        }}
                    >
                        {processedData.map((item, index) => (
                            <SwiperSlide key={`${item._id || index}-top`}>
                                {({ isActive }) => (
                                    <div className="flex flex-col mt-5 items-center cursor-pointer relative z-10 group">
                                        {/* DOT */}
                                        <div
                                            className={`w-5 h-5 rounded-full border-[3px] transition-all duration-300 ease-out
                                            ${isActive
                                                    ? "bg-[#FF1033] border-[#FF1033] scale-125    red-200"
                                                    : "bg-white border-gray-300 scale-90 group-hover:border-gray-400"
                                                }`}
                                        />

                                        {/* YEAR TEXT */}
                                        <span
                                            className={`text-lg font-bold transition-colors duration-300
                                            ${isActive ? "text-black" : "text-gray-300"}`}
                                        >
                                            {item.year}
                                        </span>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* --- BOTTOM SECTION: CONTENT (Only Active Item) --- */}
                {activeItem && (
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex flex-col items-center px-4">

                            {/* Big Year Heading */}
                            <h2 className="text-4xl font-extrabold text-[#FF1033] mb-6 tracking-tight">
                                {activeItem.year}
                            </h2>

                            {/* Description with Line Clamp */}
                            <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed line-clamp-2 text-ellipsis overflow-hidden h-[3.5rem]">
                                {activeItem.description}
                            </p>

                            {/* Logo Image */}
                            {activeItem.logo && (
                                <div className="h-24 flex items-center justify-center">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_IMAGES_URL}${activeItem.logo}`}
                                        alt={`${activeItem.year} logo`}
                                        className="h-full w-auto object-contain hover:scale-105 transition-transform"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default TimelineSlider;