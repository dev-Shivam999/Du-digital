// const NewsAndMediaHero = ({ data }) => (
//     <section
//         className="h-[420px] flex items-center justify-center bg-cover bg-center relative"
//         style={{ backgroundImage: `url(${data.background})` }}
//     >
//         <div className="absolute inset-0 bg-red-900/40" />
//         <h1 className="relative text-4xl  font-bold text-white">
//             {data.title}
//         </h1>
//     </section>
// );

// export default NewsAndMediaHero;




import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NewsAndMediaHero = ({ data }) => {
    const { title, slider } = data;
    const { slides, autoplay, interval } = slider;
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!autoplay) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, interval || 3000);

        return () => clearInterval(timer);
    }, [autoplay, interval, slides.length]);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <section className="relative w-full h-[600px] overflow-hidden">

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >

                    {/* IMAGE (Right → Left) */}
                    {/* IMAGE (Right → Left) */}
                    <motion.img
                        src={slides[current].image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ x: 200 }}
                        animate={{ x: 0 }}
                        exit={{ x: -200 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* CONTENT (Bottom → Up) */}
                    <motion.div
                        className="relative z-20 max-w-7xl mx-auto px-6 md:px-20 h-full flex items-center">

                        <h1 className="relative text-4xl  mx-auto font-bold text-white">
                            {title}
                        </h1>


                    </motion.div>

                </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white text-5xl px-3 rounded-full"
            >
                ‹
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white text-5xl px-3 rounded-full"
            >
                ›
            </button>
        </section>
    );
};

export default NewsAndMediaHero;








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
//                     <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-20 h-full flex items-center"
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

