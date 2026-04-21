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

const GalleryModal = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [showShare, setShowShare] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const currentImage = images[current];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
    >
      {/* TOP BAR */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-white z-50">
        {/* Counter */}
        <div className="text-sm font-medium">
          {current + 1} / {images.length}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 relative">
          <button onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
            <Maximize size={20} />
          </button>

          <button onClick={() => setZoom(z => Math.min(z + 0.25, 2))} aria-label="Zoom In">
            <ZoomIn size={20} />
          </button>

          <button onClick={() => setZoom(z => Math.max(z - 0.25, 1))} aria-label="Zoom Out">
            <ZoomOut size={20} />
          </button>

          {/* Share Dropdown */}
          <div className="relative">
            <button onClick={() => setShowShare(!showShare)} aria-label="Share">
              <Share2 size={20} />
            </button>

            {showShare && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded  w-44 text-sm">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentImage.imageSrc);
                    setShowShare(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Copy Image Link
                </button>

                <a
                  href={currentImage.imageSrc}
                  download={currentImage.imageName}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Download Image
                </a>
              </div>
            )}
          </div>

          <button onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div className="w-full max-w-6xl px-6">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop
          initialSlide={startIndex}
          onSlideChange={(swiper) => {
            setCurrent(swiper.realIndex);
            setZoom(1);
          }}
        >
          {images.map((img, i) => (
            <SwiperSlide key={img._id || i}>
              <div className="flex flex-col items-center gap-3">
                <img
                  // src={img.imageSrc}
                  // src={`${import.meta.env.VITE_BACKEND_URL}${img.imageSrc}`}
                  src={`${import.meta.env.VITE_BACKEND_IMAGES_URL}${img.imageSrc}`}
                  alt={img.imageName}
                  style={{ transform: `scale(${zoom})` }}
                  className="max-h-[80vh] transition-transform duration-300 rounded-lg"
                />

                {/* Image Name */}
                <p className="text-white text-sm opacity-80">
                  {img.imageName}
                </p>
              </div>
            </SwiperSlide>

          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GalleryModal;








// import { useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import {
//   X,
//   ZoomIn,
//   ZoomOut,
//   Share2,
//   Download,
//   Maximize
// } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const GalleryModal = ({ images, startIndex, onClose }) => {
//   const [current, setCurrent] = useState(startIndex);
//   const [zoom, setZoom] = useState(1);
//   const [showShare, setShowShare] = useState(false);
//   const containerRef = useRef(null);

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       containerRef.current.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const currentImage = images[current];

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
//     >
//       {/* TOP BAR */}
//       <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-white z-50">
//         {/* Counter */}
//         <div className="text-sm font-medium">
//           {current + 1} / {images.length}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-4 relative">
//           <button onClick={toggleFullscreen}>
//             <Maximize size={20} />
//           </button>

//           <button onClick={() => setZoom(zoom < 2 ? zoom + 0.25 : zoom)}>
//             <ZoomIn size={20} />
//           </button>

//           <button onClick={() => setZoom(zoom > 1 ? zoom - 0.25 : zoom)}>
//             <ZoomOut size={20} />
//           </button>

//           {/* Share Dropdown */}
//           <div className="relative">
//             <button onClick={() => setShowShare(!showShare)}>
//               <Share2 size={20} />
//             </button>

//             {showShare && (
//               <div className="absolute right-0 mt-2 bg-white text-black rounded   w-40 text-sm">
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(currentImage);
//                     setShowShare(false);
//                   }}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                 >
//                   Copy Image Link
//                 </button>

//                 <a
//                   href={currentImage}
//                   download
//                   className="block px-4 py-2 hover:bg-gray-100"
//                 >
//                   Download Image
//                 </a>
//               </div>
//             )}
//           </div>

//           <button onClick={onClose}>
//             <X size={22} />
//           </button>
//         </div>
//       </div>

//       {/* SLIDER */}
//       <div className="w-full max-w-6xl px-6">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           loop
//           initialSlide={startIndex}
//           onSlideChange={(swiper) => {
//             setCurrent(swiper.realIndex);
//             setZoom(1);
//           }}
//         >
//           {images.map((img, i) => (
//             <SwiperSlide key={i}>
//               <div className="flex justify-center">
//                 <img
//                   src={img}
//                   alt=""
//                   style={{
//                     transform: `scale(${zoom})`
//                   }}
//                   className="max-h-[85vh] transition-transform duration-300 rounded-lg"
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default GalleryModal;










// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const GalleryModal = ({ images, startIndex, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
//       {/* Close */}
//       <button
//         onClick={onClose}
//         className="absolute top-6 right-6 text-white text-3xl z-50"
//       >
//         ✕
//       </button>

//       <div className="w-full max-w-6xl px-6">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           initialSlide={startIndex}
//           navigation
//           pagination={{ clickable: true }}
//           loop
//         >
//           {images.map((img, i) => (
//             <SwiperSlide key={i}>
//               <img
//                 src={img}
//                 alt=""
//                 className="max-h-[85vh] mx-auto rounded-lg"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default GalleryModal;








// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const GalleryModal = ({ images, startIndex, onClose }) => {
//     return (
//         <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
//             {/* Close */}
//             <button
//                 onClick={onClose}
//                 className="absolute top-6 right-6 text-white text-3xl z-50"
//             >
//                 ✕
//             </button>

//             <div className="w-full max-w-6xl px-6">
//                 <Swiper
//                     modules={[Navigation, Pagination]}
//                     initialSlide={startIndex}
//                     navigation
//                     pagination={{ clickable: true }}
//                     loop
//                     className="gallery-modal-swiper"
//                 >
//                     {images.map((img, i) => (
//                         <SwiperSlide key={i}>
//                             <img
//                                 src={img}
//                                 alt=""
//                                 className="max-h-[85vh] mx-auto rounded-lg"
//                             />
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             </div>
//         </div>
//     );
// };

// export default GalleryModal;












// import { useState } from "react";

// const GalleryModal = ({ images, index, onClose }) => {
//     const [current, setCurrent] = useState(index);

//     const prev = () =>
//         setCurrent((current - 1 + images.length) % images.length);

//     const next = () =>
//         setCurrent((current + 1) % images.length);

//     return (
//         <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
//             {/* Close */}
//             <button
//                 onClick={onClose}
//                 className="absolute top-6 right-6 text-white text-3xl"
//             >
//                 ✕
//             </button>

//             {/* Counter */}
//             <div className="absolute top-6 left-6 text-white text-sm">
//                 {current + 1} / {images.length}
//             </div>

//             {/* Left */}
//             <button
//                 onClick={prev}
//                 className="absolute left-6 text-white text-4xl"
//             >
//                 ‹
//             </button>

//             {/* Image */}
//             <img
//                 src={images[current]}
//                 className="max-h-[85vh] max-w-[90vw] rounded-lg"
//             />

//             {/* Right */}
//             <button
//                 onClick={next}
//                 className="absolute right-6 text-white text-4xl"
//             >
//                 ›
//             </button>
//         </div>
//     );
// };

// export default GalleryModal;











// import { useState } from "react";

// const GalleryModal = ({ images, index, onClose }) => {
//     const [current, setCurrent] = useState(index);

//     return (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//             <button
//                 className="absolute top-6 right-6 text-white text-2xl"
//                 onClick={onClose}
//             >
//                 ✕
//             </button>

//             <button
//                 className="absolute left-6 text-white text-3xl"
//                 onClick={() => setCurrent((current - 1 + images.length) % images.length)}
//             >
//                 ‹
//             </button>

//             <img
//                 src={images[current]}
//                 className="max-h-[80vh] rounded-lg"
//             />

//             <button
//                 className="absolute right-6 text-white text-3xl"
//                 onClick={() => setCurrent((current + 1) % images.length)}
//             >
//                 ›
//             </button>
//         </div>
//     );
// };

// export default GalleryModal;
