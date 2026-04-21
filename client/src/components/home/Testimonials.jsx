import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LazyImage from "../reusable/LazyImage";


const Testimonials = ({ data }) => {
    const [index, setIndex] = useState(0);

    const total = data.testimonials.length;

    const prev = () => {
        setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    };

    const next = () => {
        setIndex((prev) => (prev + 1) % total);
    };

    return (
        <section className="bg-[#FFF1D9] py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto  text-center">

                {/* Heading */}
                <div className="px-6 md:px-20">
                    <p className="text-sm font-semibold tracking-widest text-gray-700">
                        TESTIMONIALS
                    </p>

                    <h2 className="mt-3 text-4xl  font-semibold text-gray-900">
                        {data.title}
                    </h2>

                    <p className="mt-4 max-w-2xl mx-auto text-gray-700 leading-relaxed">
                        {data.subtitle.split("\n").map((line, index) => (
                            <div key={index}>
                                {line}
                                {index < data.subtitle.split("\n").length - 1 && <br />}
                            </div>
                        ))}
                    </p>

                    <div className="mt-8">
                        <Link to={data.buttonLink} className="bg-[#FF1033] flex w-max mx-auto gap-2 items-center text-[#FFFDF5] px-6 py-3 rounded-full font-bold text-lg hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300">
                            {data.buttonText} <img width={20} height={20} src="/google.webp" alt="" />
                        </Link>
                    </div>
                </div>


                <div className="relative w-full"   >
                    {/* Slider */}
                    <div className="relative mt-20 px-6 md:px-20 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {[0, 1].map((offset) => {
                                    const item = data.testimonials[(index + offset) % total];

                                    return (
                                        <div
                                            key={offset}
                                            className={`${offset === 1 ? "" : ""
                                                } bg-[#FFFCF6] rounded-2xl p-8 text-left flex flex-col justify-between`}
                                        >
                                            <p className="text-gray-700 leading-relaxed">
                                                {item.message}
                                            </p>

                                            <div className="flex items-center gap-4 mt-8">
                                                {/* <div className="w-12 h-12 rounded-full bg-black" /> */}
                                                <LazyImage src={item.image} alt={item.name} className="w-15 h-15 rounded-full bg-black" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {item.designation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-5 w-full absolute top-[50%] translate-y-[-50%]">
                        <button
                            onClick={prev}
                            className="text-[#FF1033] hover:scale-110 transition  hover:bg-[#FF1033] hover:text-white rounded-full p-2 hover:cursor-pointer"
                            aria-label="Previous testimonial"
                        >
                            {/* <MoveLeft  size={28}/> */}
                            {/* <ChevronLeftCircle size={28} /> */}
                            <ArrowLeft size={32} />
                        </button>
                        <button
                            onClick={next}
                            className="text-[#FF1033] hover:scale-110 transition  hover:bg-[#FF1033] hover:text-white rounded-full p-2 hover:cursor-pointer"
                            aria-label="Next testimonial"
                        >
                            <ArrowRight size={32} />
                            {/* <MoveRight size={28} /> */}
                            {/* <ChevronRightCircle size={28} /> */}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Testimonials;

