import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
    X,
    ZoomIn,
    ZoomOut,
    Share2,
    Maximize
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * Reusable Image Gallery Modal Component
 * 
 * @param {Array} images - Array of image objects or strings
 *   - If objects: { src: string, name?: string, alt?: string }
 *   - If strings: direct image URLs
 * @param {number} startIndex - Initial slide index (default: 0)
 * @param {function} onClose - Callback when modal closes
 * @param {string} baseUrl - Optional base URL to prepend to image sources (default: '')
 */
const ImageGalleryModal = ({
    images = [],
    startIndex = 0,
    onClose,
    baseUrl = ''
}) => {
    const [current, setCurrent] = useState(startIndex);
    const [zoom, setZoom] = useState(1);
    const [showShare, setShowShare] = useState(false);
    const containerRef = useRef(null);

    // Normalize images to consistent format
    const normalizedImages = images.map((img, index) => {
        if (typeof img === 'string') {
            return {
                src: img,
                name: `Image ${index + 1}`,
                alt: `Image ${index + 1}`
            };
        }
        return {
            src: img.src || img.imageSrc || img.fileUrl || '',
            name: img.name || img.imageName || img.alt || `Image ${index + 1}`,
            alt: img.alt || img.imageName || img.name || `Image ${index + 1}`
        };
    });

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const currentImage = normalizedImages[current];
    const currentImageUrl = baseUrl + currentImage.src;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        >
            {/* TOP BAR */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-white z-50">
                {/* Counter */}
                <div className="text-sm font-medium">
                    {current + 1} / {normalizedImages.length}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={toggleFullscreen}
                        className="hover:opacity-70 transition"
                        aria-label="Toggle fullscreen"
                    >
                        <Maximize size={20} />
                    </button>

                    <button
                        onClick={() => setZoom(z => Math.min(z + 0.25, 2))}
                        className="hover:opacity-70 transition"
                        aria-label="Zoom in"
                    >
                        <ZoomIn size={20} />
                    </button>

                    <button
                        onClick={() => setZoom(z => Math.max(z - 0.25, 1))}
                        className="hover:opacity-70 transition"
                        aria-label="Zoom out"
                    >
                        <ZoomOut size={20} />
                    </button>

                    {/* Share Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowShare(!showShare)}
                            className="hover:opacity-70 transition"
                            aria-label="Share options"
                        >
                            <Share2 size={20} />
                        </button>

                        {showShare && (
                            <div className="absolute right-0 mt-2 bg-white text-black rounded   w-44 text-sm">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(currentImageUrl);
                                        setShowShare(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Copy Image Link
                                </button>

                                <a
                                    href={currentImageUrl}
                                    download={currentImage.name}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Download Image
                                </a>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="hover:opacity-70 transition"
                        aria-label="Close gallery"
                    >
                        <X size={22} />
                    </button>
                </div>
            </div>

            {/* SLIDER */}
            <div className="w-full h-full flex items-center justify-center px-4 md:px-10 py-12">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    loop={normalizedImages.length > 1}
                    initialSlide={startIndex}
                    onSlideChange={(swiper) => {
                        setCurrent(swiper.realIndex);
                        setZoom(1);
                    }}
                    className="w-full h-full flex items-center"
                >
                    {normalizedImages.map((img, i) => (
                        <SwiperSlide key={i} className="flex items-center justify-center">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                <img
                                    src={baseUrl + img.src}
                                    alt={img.alt}
                                    style={{ transform: `scale(${zoom})` }}
                                    className="max-h-[85vh] max-w-full w-auto object-contain transition-transform duration-300 rounded"
                                />

                                {/* Image Name */}
                                {img.name && (
                                    <p className="text-white text-sm opacity-80">
                                        {img.name}
                                    </p>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ImageGalleryModal;
