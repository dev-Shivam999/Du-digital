import React from "react";

const OurFootprints = ({ data }) => {
    return (
        <section className="relative py-24  overflow-hidden bg-white">

            {/* 🔴 Background Pattern */}
            <div
                className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-40"
                style={{
                    backgroundImage: "url(/assets/home/our-footprints/bg-pattern.png)"
                }}
            />

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 text-center">

                {/* Heading */}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Our Footprints
                </h2>

                {/* Divider */}
                {/* <div className="w-16 h-[3px] bg-[#FF1033] mx-auto my-6" /> */}

                {/* Description */}
                <p className="max-w-5xl mx-auto text-gray-600 text-base leading-relaxed">
                    Over our 35 centres operating in 6 countries and with an additional
                    1300 centres available globally with our partner offices, we have the
                    ability to fulfil a wide range of dynamic requirements for our
                    Governmental clients and business partners alike.
                </p>

                {/* ===== STATS ===== */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3">

                    {data.stats.map((item, i) => (
                        <div
                            key={i}
                            className={`
                px-6
                ${i !== data.stats.length - 1 ? "md:border-r border-[#FF1033]" : ""}
                max-md:border-b last:max-md:border-b-0
              `}
                        >
                            {/* Value */}
                            <div className="flex justify-center items-end">
                                <span className="text-5xl font-bold text-[#FF1033]">
                                    {item.value}
                                </span>
                                <span className="text-5xl font-bold text-[#FF1033] ml-1">
                                    {item.suffix}
                                </span>
                            </div>

                            {/* Sub value */}
                            {item.subValue && (
                                <p className="mt-1 text-sm font-semibold text-[#FF1033]">
                                    {item.subValue}
                                </p>
                            )}

                            {/* Label */}
                            <p className="mt-2 text-xl font-medium text-gray-900">
                                {item.label}
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default OurFootprints;














// import React from 'react'

// const OurFootprints = ({ data }) => {
//     return (
//         <div>
//             {/* ===== STATS (FULL WIDTH BELOW) ===== */}
//             <div className="my-20 max-w-4xl mx-auto">
//                 <div className="grid grid-cols-1 md:grid-cols-3 text-center">

//                     {data.stats.map((item, i) => (
//                         <div
//                             key={i}
//                             className={`
//                                     px-6 py-0
//                                     ${i !== data.stats.length - 1 ? "md:border-r-2 border-[#FF1033]" : ""}
//                                     max-md:border-b-2 last:max-md:border-b-0
//                                 `}
//                         >
//                             <div className="flex justify-center items-end">
//                                 <span className="text-3xl md:text-4xl font-semibold text-[#FF1033]">
//                                     {item.value}
//                                 </span>
//                                 <span className="text-2xl md:text-3xl font-semibold text-[#FF1033] ml-1">
//                                     {item.suffix}
//                                 </span>
//                             </div>

//                             {item.subValue && (
//                                 <p className="text-sm font-semibold text-[#FF1033] mt-1">
//                                     {item.subValue}
//                                 </p>
//                             )}

//                             <p className="mt-4 text-xl font-medium text-gray-900">
//                                 {item.label}
//                             </p>
//                         </div>
//                     ))}

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default OurFootprints