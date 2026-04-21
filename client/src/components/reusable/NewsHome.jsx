import LazyImage from "./LazyImage";

const NewsHome = ({ data }) => {
    const BackendImagesURL =
        import.meta.env.VITE_BACKEND_IMAGES_URL || "http://localhost:5000/api";

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 pt-0">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-3">
                    See what all the talk is about!
                </h2>
                <p className="text-gray-600">
                    Transformative Client experience from all around the globe
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.slice(0, 3).map((item, index) => (
                    <a
                        key={item._id}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className={` ${index == 1 && "-mt-3"} relative bg-white rounded-[32px] overflow-hidden  none transition`}
                    >
                        {/* Image (Tall) */}
                        <div className="relative h-[420px]">
                            <LazyImage
                                src={`${BackendImagesURL}${item.imageUrl}`}
                                alt={item.title}
                                className="w-full h-full object-contain"
                                fill
                            />

                            {/* Strong white fade */}
                            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white via-white/90 to-transparent" />
                        </div>

                        {/* ABSOLUTE Content */}
                        <div className="absolute inset-x-0 -bottom-4 px-6 pb-4 bg-gradient-to-t from-white via-white/90 to-transparent">
                            {/* Quote */}
                            <div className="text-4xl text-gray-900 mb-0 leading-none">
                                “
                            </div>

                            {/* Text */}
                            <p className="text-gray-900 text-md leading-relaxed mb-6 line-clamp-2 ">
                                {item.title}
                            </p>

                            {/* Author */}
                            {/* <p className="text-sm text-gray-500 text-right">
                                — {item.author || "Client"},{" "}
                                {item.company || "Verified User"}
                            </p> */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold tracking-wider text-[#FF1033] uppercase">
                                    News
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-sm text-gray-500">
                                        {new Date(item.datePublished).toLocaleDateString("en-IN", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default NewsHome;










// import { Quote } from 'lucide-react';
// import LazyImage from './LazyImage';

// const NewsHome = ({ data }) => {
//     const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

//     // Gradient colors for each card
//     const gradients = [
//         'bg-gradient-to-t from-blue-200/50 via-blue-100/30 to-transparent',
//         'bg-gradient-to-t from-pink-200/50 via-pink-100/30 to-transparent',
//         'bg-gradient-to-t from-orange-200/50 via-orange-100/30 to-transparent'
//     ];

//     return (
//         <div className="max-w-7xl mx-auto px-6 py-16">
//             {/* Section Header */}
//             <div className="text-center mb-12">
//                 <h2 className="text-5xl font-bold mb-4">
//                     See what all the talk is about!
//                 </h2>
//                 <p className="text-base text-gray-600">
//                     Transformative Client experience from all around the globe
//                 </p>
//             </div>

//             {/* Testimonial Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {data.slice(0, 3).map((item, index) => (
//                     <a
//                         key={item._id}
//                         href={item.link}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="bg-white rounded-2xl overflow-hidden   transition-  duration-300 block"
//                     >
//                         {/* Image with Gradient Overlay */}
//                         <div className="relative h-64 overflow-hidden">
//                             <LazyImage
//                                 src={`${BackendImagesURL}${item.imageUrl}`}
//                                 alt={item.title}
//                                 className="w-full h-full object-cover"
//                             />
//                             <div className={`absolute inset-0 ${gradients[index % 3]}`} />
//                         </div>

//                         {/* Content */}
//                         <div className="p-8">
//                             {/* Quote Icon */}
//                             <Quote className="w-8 h-8 text-gray-400 mb-4" />

//                             {/* Testimonial Text */}
//                             <p className="text-base text-gray-800 leading-relaxed mb-4">
//                                 {item.title}
//                             </p>

//                             {/* Attribution */}
//                             <p className="text-sm text-gray-500">
//                                 — {item.author || "Client"}, {item.company || "Verified User"}
//                             </p>
//                         </div>
//                     </a>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default NewsHome;
