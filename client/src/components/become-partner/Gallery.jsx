import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import ImageGalleryModal from "../reusable/ImageGalleryModal";
import { fetchGallery } from "../../redux/slices/gallerySlice";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Gallery = () => {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.gallery);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10">GALLERY</h2>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10">GALLERY</h2>
        <div className="max-w-7xl mx-auto px-6 text-center text-[#FF1033]">
          <p>Error loading gallery: {error}</p>
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) {
    return (
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10">Gallery</h2>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>No gallery images available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-10">Gallery</h2>

      <div className="max-w-7xl mx-auto px-6 relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={3}
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-10 become-partner-swiper"   //  important
        >
          {images.map((img, i) => (
            <SwiperSlide key={img._id || i}>
              <img
                // src={img.imageSrc}
                src={`${import.meta.env.VITE_BACKEND_IMAGES_URL}${img.imageSrc}`}
                alt={img.imageName}
                onClick={() => setActiveIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(i);
                  }
                }}
                tabIndex="0"
                role="button"
                aria-label={`View ${img.imageName}`}
                className="h-[220px] w-full object-cover rounded-lg cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {activeIndex !== null && (
        <ImageGalleryModal
          images={images}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          baseUrl={import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api'}
        />
      )}
    </section>
  );
};

export default Gallery;


















// import { useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import GalleryModal from "./GalleryModal";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const Gallery = ({ images }) => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   return (
//     <section className="py-16 bg-white">
//        <h2 className="text-4xl font-bold text-center mb-10">GALLERY</h2>

//       <div className="max-w-7xl mx-auto px-6 relative">
//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           spaceBetween={24}
//           slidesPerView={3}
//           loop
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false
//           }}
//           navigation
//           pagination={{ clickable: true }}
//           breakpoints={{
//             0: { slidesPerView: 1 },
//             640: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 }
//           }}
//           className="gallery-swiper"
//         >
//           {images.map((img, i) => (
//             <SwiperSlide key={i}>
//               <img
//                 src={img}
//                 alt=""
//                 onClick={() => setActiveIndex(i)}
//                 className="h-[220px] w-full object-cover rounded-lg cursor-pointer"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {activeIndex !== null && (
//         <GalleryModal
//           images={images}
//           startIndex={activeIndex}
//           onClose={() => setActiveIndex(null)}
//         />
//       )}
//     </section>
//   );
// };

// export default Gallery;














// import { useRef, useState } from "react";
// import GalleryModal from "./GalleryModal";

// const Gallery = ({ images }) => {
//     const sliderRef = useRef(null);
//     const [activeIndex, setActiveIndex] = useState(null);

//     const scroll = (dir) => {
//         sliderRef.current.scrollBy({
//             left: dir === "left" ? -350 : 350,
//             behavior: "smooth"
//         });
//     };

//     return (
//         <section className="py-16 bg-white">
//              <h2 className="text-4xl font-bold text-center mb-10">GALLERY</h2>

//             <div className="relative max-w-7xl mx-auto px-6">
//                 {/* Left Arrow */}
//                 <button
//                     onClick={() => scroll("left")}
//                     className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white   rounded-full w-10 h-10"
//                 >
//                     ‹
//                 </button>

//                 {/* Slider */}
//                 <div
//                     ref={sliderRef}
//                     className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
//                 >
//                     {images.map((img, i) => (
//                         <div
//                             key={i}
//                             className="min-w-[320px] cursor-pointer"
//                             onClick={() => setActiveIndex(i)}
//                         >
//                             <img
//                                 src={img}
//                                 alt=""
//                                 className="rounded-lg object-cover h-[220px] w-full"
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Right Arrow */}
//                 <button
//                     onClick={() => scroll("right")}
//                     className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white   rounded-full w-10 h-10"
//                 >
//                     ›
//                 </button>
//             </div>

//             {/* Modal */}
//             {activeIndex !== null && (
//                 <GalleryModal
//                     images={images}
//                     index={activeIndex}
//                     onClose={() => setActiveIndex(null)}
//                 />
//             )}
//         </section>
//     );
// };

// export default Gallery;












// import { useState } from "react";
// import GalleryModal from "./GalleryModal";

// const Gallery = ({ images }) => {
//     const [active, setActive] = useState(null);

//     return (
//         <section className="py-16">
//              <h2 className="text-4xl font-bold text-center mb-10">Gallery</h2>

//             <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
//                 {images.map((img, i) => (
//                     <img
//                         key={i}
//                         src={img}
//                         className="cursor-pointer rounded-lg"
//                         onClick={() => setActive(i)}
//                     />
//                 ))}
//             </div>

//             {active !== null && (
//                 <GalleryModal
//                     images={images}
//                     index={active}
//                     onClose={() => setActive(null)}
//                 />
//             )}
//         </section>
//     );
// };

// export default Gallery;
