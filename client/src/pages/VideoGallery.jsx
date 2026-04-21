import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/video-gallery/VideoCard";
import { fetchVideos } from "../redux/slices/videoSlice";

const VideoGallery = () => {
    const dispatch = useDispatch();
    const { videos, loading, error } = useSelector((state) => state.video);
    const [visibleCounts, setVisibleCounts] = useState({});

    const handleLoadMore = (category) => {
        setVisibleCounts(prev => ({
            ...prev,
            [category]: (prev[category] || 6) + 6
        }));
    };

    useEffect(() => {
        dispatch(fetchVideos());
    }, [dispatch]);


    // Need to put this fiunctionin UseCalback

    // Group by category
    const groupedVideos = videos.reduce((acc, video) => {
        const category = video.category || "Uncategorized";
        acc[category] = acc[category] || [];
        acc[category].push(video);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="w-full">
                <section className="h-[600px] relative flex items-center justify-center">
                    <img
                        src="/assets/video-gallery/video-gallery-bg.jpg"
                        alt="Video Gallery Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <h1 className="relative z-10 text-white text-4xl font-semibold">
                        Video Gallery
                    </h1>
                </section>
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <p>Loading videos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <section className="h-[600px] relative flex items-center justify-center">
                    <img
                        src="/assets/video-gallery/video-gallery-bg.jpg"
                        alt="Video Gallery Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <h1 className="relative z-10 text-white text-4xl font-semibold">
                        Video Gallery
                    </h1>
                </section>
                <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[#FF1033]">
                    <p>Error loading videos: {error}</p>
                </div>
            </div>
        );
    }

    if (!videos || videos.length === 0) {
        return (
            <div className="w-full">
                <section className="h-[600px] relative flex items-center justify-center">
                    <img
                        src="/assets/video-gallery/video-gallery-bg.jpg"
                        alt="Video Gallery Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <h1 className="relative z-10 text-white text-4xl font-semibold">
                        Video Gallery
                    </h1>
                </section>
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <p>No videos available.</p>
                </div>
            </div>
        );
    }

    const totalVideos = videos.length;

    return (
        <div className="w-full">
            {/* ===== Hero ===== */}
            <section className="h-[600px] relative flex items-center justify-center">
                <img
                    src="/assets/video-gallery/video-gallery-bg.jpg"
                    alt="Video Gallery Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-black/60" />
                <h1 className="relative z-10 text-white text-4xl font-semibold">
                    Video Gallery
                </h1>
            </section>

            {/* ===== CONTENT ===== */}
            <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 space-y-16">
                {Object.entries(groupedVideos).map(([category, items]) => {
                    const currentVisibleCount = visibleCounts[category] || 6;

                    return (
                        <div key={category}>
                            <h2 className="text-2xl font-semibold text-center mb-8">
                                {category}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {items.slice(0, currentVisibleCount).map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))}
                            </div>

                            {/* ===== LOAD MORE FOR CATEGORY ===== */}
                            {items.length > currentVisibleCount && (
                                <div className="text-center">
                                    <button
                                        onClick={() => handleLoadMore(category)}
                                        className="mt-6 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]  "
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VideoGallery;
