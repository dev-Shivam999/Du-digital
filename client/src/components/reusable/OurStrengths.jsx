import {
    FaCogs,
    FaUserCheck,
    FaGem,
    FaGlobe,
    FaMoneyBillWave,
    FaHandshake
} from "react-icons/fa";

const iconMap = {
    process: FaCogs,
    customer: FaUserCheck,
    value: FaGem,
    network: FaGlobe,
    cost: FaMoneyBillWave,
    trust: FaHandshake
};

const OurStrengths = ({ data, image }) => {
    return (
        <section className="py-24 pt-0 bg-[#F9F9F9]">
            <div className="max-w-7xl mx-auto px-6 md:px-20 relative">

                {/* Heading */}
                <h2 className="text-4xl  font-bold mb-14">
                    {data.heading}
                </h2>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT FEATURE CARD */}
                    <div className="lg:row-span-2 h-[96%] relative bg-[#FFF4CC] text-gray-900 rounded-2xl px-8 pt-8 pb-6 flex flex-col justify-between">

                        <div>
                            <h3 className="text-2xl font-semibold leading-snug mb-4">
                                The future of visa services is globally connected
                            </h3>

                            <p className="text-gray-900/80 text-sm leading-relaxed">
                                We build modern, secure, and scalable visa
                                processing infrastructure to support governments,
                                embassies, and applicants worldwide.
                            </p>
                        </div>
                        <img src={image} className="max-lg:hidden w-[100%] m-0 h-[66%] absolute bottom-0 left-0 right-0  object-cover rounded-2xl" alt="" />

                        {/* <button className="mt-8 inline-flex items-center gap-2 text-lg font-bold bg-[#FF1033] text-[#FFFDF5] px-6 py-3 rounded-full w-max hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300">
                            Explore Services →
                        </button> */}
                    </div>

                    {/* RIGHT GRID */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                        {data.items.map((item, i) => {
                            const Icon = iconMap[item.icon];

                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-6 border border-gray-200   transition"
                                >
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-lg bg-[#FF1033]/10 flex items-center justify-center mb-4">
                                        <Icon className="text-[#FF1033] text-lg" />
                                    </div>

                                    {/* Title */}
                                    <h4 className="font-semibold text-lg mb-2">
                                        {item.title}
                                    </h4>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OurStrengths;







// import {
//     FaCogs,
//     FaUserCheck,
//     FaGem,
//     FaGlobe,
//     FaMoneyBillWave,
//     FaHandshake
// } from "react-icons/fa";

// const iconMap = {
//     process: FaCogs,
//     customer: FaUserCheck,
//     value: FaGem,
//     network: FaGlobe,
//     cost: FaMoneyBillWave,
//     trust: FaHandshake
// };

// const OurStrengths = ({ data }) => {
//     return (
//         <section className="py-20 bg-black text-white">
//             <div className="max-w-7xl mx-auto px-6">
//                 {/* Heading */}
//                  <h2 className="text-4xl  font-bold text-center mb-14">
//                     {data.heading}
//                 </h2>

//                 {/* Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {data.items.map((item, i) => {
//                         const Icon = iconMap[item.icon];

//                         return (
//                             <div
//                                 key={i}
//                                 className="
//                   bg-white text-gray-800
//                   rounded-xl p-8
//                   border-l-4 border-[#FF1033]
//
//                   transition
//                 "
//                             >
//                                 {/* Icon */}
//                                 <Icon className="text-[#FF1033] text-4xl mb-4" />

//                                 {/* Title */}
//                                 <h4 className="text-xl font-bold mb-4 leading-snug">
//                                     {item.title}
//                                 </h4>

//                                 {/* Description */}
//                                 <p className="text-gray-600 leading-relaxed text-sm">
//                                     {item.description}
//                                 </p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default OurStrengths;















// const OurStrengths = ({ data }) => (
//     <section className="py-16 bg-black text-white">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
//             {data.map((item, i) => (
//                 <div key={i} className="bg-gray-900 p-6 rounded border border-[#FF1033]">
//                     <h4 className="font-semibold mb-2">{item.title}</h4>
//                     <p className="text-gray-300">{item.description}</p>
//                 </div>
//             ))}
//         </div>
//     </section>
// );

// export default OurStrengths;
