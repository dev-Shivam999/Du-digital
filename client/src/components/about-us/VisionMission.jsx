const VisionMission = ({ data }) => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-3 md:px-10">

                {/* OUTER CARD */}
                <div className="rounded-2xl p-3 md:p-10">

                    {/* HEADING */}
                    <h2 className="text-4xl font-bold text-center mb-10">
                        {data.heading}
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-start">

                        {/* LEFT : STORY / IMAGE */}
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src={data.image}
                                alt="Our Story"
                                className="w-full h-[260px] md:h-[360px] object-cover"
                            />

                            {/* OVERLAY */}
                            {/* <div className="absolute inset-0 bg-black/50" /> */}

                            {/* TEXT */}
                            <div className="absolute bottom-0 left-0 p-6 text-white max-w-md">
                                <h4 className="text-lg font-semibold mb-2">
                                    Our Story
                                </h4>
                                <p className="text-sm leading-relaxed text-white/90">
                                    <span className="whitespace-nowrap">DU GLOBAL </span>Limited, founded in 2015, has grown into a
                                    trusted global partner delivering innovative,
                                    technology-driven solutions across borders.
                                </p>
                            </div>

                            {/* PLAY ICON (OPTIONAL) */}
                            {/* <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full w-14 h-14 flex items-center justify-center   cursor-pointer">
                                <svg
                                    width="20"
                                    height="20"
                                    fill="#000"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div> */}
                        </div>

                        {/* RIGHT : MISSION + VISION */}
                        <div className="space-y-3">

                            {/* MISSION */}
                            <div className=" rounded-xl pt-18 pb-3 bg-[#b7edb7] px-6 border border-gray-200">
                                <h4 className="text-lg font-semibold  text-black mb-2">
                                    Mission
                                </h4>
                                <p className="leading-relaxed">
                                    {data.mission}
                                </p>
                            </div>

                            {/* VISION */}
                            <div className="bg-[#00ab63] pt-18 text-white pb-3 rounded-xl px-6">
                                <h4 className="text-lg font-semibold mb-2">
                                    Vision
                                </h4>
                                <p className=" leading-relaxed">
                                    {data.vision}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;












// import { FaBinoculars, FaBullseye } from "react-icons/fa";

// const VisionMission = ({ data }) => {
//     return (
//         <section className="relative md:px-10 py-20 bg-white overflow-hidden">
//             {/* Faded Background Text */}
//             <h2
//                 className="absolute inset-x-0 top-8 text-center
//         text-[90px] md:text-[120px] font-extrabold
//         text-gray-100 uppercase
//         pointer-events-none select-none text-nowrap px-0"
//             >
//                 Vision & Mission
//             </h2>

//             <div className="relative max-w-7xl mx-auto px-6">
//                 {/* Heading */}
//                 <div className="text-center mb-14">
//                     <h3 className="text-4xl font-bold text-gray-900">
//                         {data.heading}
//                     </h3>
//                     <div className="w-16 h-1 bg-[#FF1033] mx-auto mt-3"></div>
//                 </div>

//                 {/* Cards */}
//                 <div className="grid md:grid-cols-2 gap-10">
//                     {/* Vision */}
//                     <div className="bg-white rounded-xl   p-8">
//                         <FaBinoculars className="text-4xl text-gray-800 mb-6" />

//                         <h4 className="text-2xl font-bold mb-4">Vision</h4>
//                         <p className="text-gray-600 leading-relaxed">
//                             {data.vision}
//                         </p>
//                     </div>

//                     {/* Mission */}
//                     <div className="bg-white rounded-xl   p-8">
//                         <FaBullseye className="text-4xl text-[#FF1033] mb-6" />

//                         <h4 className="text-2xl font-bold mb-4">Mission</h4>
//                         <p className="text-gray-600 leading-relaxed">
//                             {data.mission}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default VisionMission;








// import React from 'react';

// const VisionMission = ({ data }) => (
//     <section className="py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">

//         {/* Background Faded Text */}
//         <h2 className="absolute top-10 inset-x-0 flex justify-center items-center
//           text-[120px] md:text-[120px] font-extrabold
//           text-gray-100 pointer-events-none select-none">
//             {data.heading}
//         </h2>

//         {/* Top Label */}
//         <p className="text-center text-[#FF1033] font-semibold tracking-widest mb-2">
//             {data.heading}
//         </p>
//         <div className="bg-white p-6   rounded">
//             <h3 className="font-bold mb-2">Vision</h3>
//             <p>{data.vision}</p>
//         </div>
//         <div className="bg-white p-6   rounded">
//             <h3 className="font-bold mb-2">Mission</h3>
//             <p>{data.mission}</p>
//         </div>
//     </section>
// );

// export default VisionMission;


