import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const HomeSlider = ({ data }) => {
    const { slides, autoplay, interval } = data;
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!autoplay) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, interval || 4000);

        return () => clearInterval(timer);
    }, [autoplay, interval, slides.length]);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (

        <section className="relative  w-full min-h-[600px] sm:h-[800px]  overflow-hidden">

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >

                    {/* IMAGE (Right → Left) */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                        initial={{ x: 200 }}
                        animate={{ x: 0 }}
                        exit={{ x: -200 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* CONTENT (Bottom → Up) */}
                    <motion.div
                        className="relative z-20 max-w-7xl mx-auto px-6 md:px-20 h-full flex items-center"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="max-w-2xl text-white">
                            {/* Only the first slide gets h1 — it's the page's primary heading.
                                Subsequent slides use p to avoid multiple H1s on navigation. */}
                            <p className="text-4xl font-semibold leading-tight">
                                {slides[current].title}
                            </p>

                            <p className="mt-4 text-base md:text-lg text-gray-200" style={{ textWrap: "balance" }}>
                                {slides[current].description}
                            </p>

                            <a
                                href={slides[current].buttonLink}
                                className="inline-block mt-6 bg-white text-[#FF1033] px-5 py-3 rounded-md font-medium border border-white hover:bg-transparent hover:text-white transition"
                            >
                                {slides[current].buttonText}
                            </a>
                        </div>
                    </motion.div>

                </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/3 z-30 bg-black/50 text-white text-5xl px-3 pb-2 rounded-full"
                aria-label="Previous slide"
            >
                ‹
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white text-5xl px-3 pb-2 rounded-full"
                aria-label="Next slide"
            >
                ›
            </button>
        </section>
    );
};

export default HomeSlider;








// import { useEffect, useState } from "react";
// import { motion } from "motion/react"

// const HomeSlider = ({ data }) => {
//     const { slides, autoplay, interval } = data;
//     const [current, setCurrent] = useState(0);

//     // Autoplay
//     useEffect(() => {
//         if (!autoplay) return;
//         const timer = setInterval(() => {
//             setCurrent((prev) => (prev + 1) % slides.length);
//         }, interval || 4000);

//         return () => clearInterval(timer);
//     }, [autoplay, interval, slides.length]);

//     const prevSlide = () => {
//         setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//     };

//     const nextSlide = () => {
//         setCurrent((prev) => (prev + 1) % slides.length);
//     };

//     return (
//         <section className="relative w-full h-[70vh] overflow-hidden">
//             {slides.map((slide, index) => (
//                 <div
//                     key={index}
//                     className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
//                         }`}
//                 >
//                     {/* Background Image */}
//                     <div
//                         className="absolute inset-0 bg-cover bg-center"
//                         style={{ backgroundImage: `url(${slide.image})` }}
//                     />

//                     {/* Overlay */}
//                     <div className="absolute inset-0 bg-black/50" />

//                     {/* Content */}
//                     <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-20 md:px-20 h-full flex items-center"
//                         initial={{ opacity: 0, y: 100 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 2 }}
//                     >
//                         <div className="max-w-2xl text-white">
//                             <h1 className="text-2xl  font-semibold leading-tight">
//                                 {slide.title}
//                             </h1>
//                             <p className="mt-4 text-base md:text-lg text-gray-200">
//                                 {slide.description}
//                             </p>
//                             <a
//                                 href={slide.buttonLink}
//                                 className="inline-block mt-6 bg-white text-[#FF1033] px-4 py-2 rounded-md font-medium border border-white hover:bg-transparent hover:text-white hover:border-white transition"
//                             >
//                                 {slide.buttonText}
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             ))}

//             {/* Arrows */}
//             <button
//                 onClick={prevSlide}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white text-6xl px-2.5 rounded-full"
//             >
//                 ‹
//             </button>
//             <button
//                 onClick={nextSlide}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white text-6xl px-2.5 rounded-full"
//             >
//                 ›
//             </button>
//         </section>
//     );
// };

// export default HomeSlider;
