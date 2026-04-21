const OurFootprints = ({ data }) => {
    return (
        <section className="py-20 bg-[#F7F8F9]">
            <div className="max-w-6xl mx-auto px-6">
                {/* Title */}
                <h2 className="text-4xl  md:text-4xl font-bold text-center mb-8">
                    Our Footprints
                </h2>

                {/* Description */}
                <div className="max-w-5xl mx-auto text-gray-700 text-justify space-y-4 mb-14">
                    {data.description.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    {data.stats.map((item, i) => (
                        <div key={i} className="flex flex-col items-center max-md:pb-5 max-md:border-b-2 md:border-r-2 max-md:last:border-b-transparent  md:last:border-r-transparent">
                            <div className="flex items-end">
                                <span className="text-5xl font-bold text-[#FF1033]">
                                    {item.value}
                                </span>
                                <span className="text-3xl font-bold text-[#FF1033] ml-1">
                                    {item.suffix}
                                </span>
                            </div>

                            {item.subValue && (
                                <p className="text-lg font-semibold text-[#FF1033] mt-1">
                                    {item.subValue}
                                </p>
                            )}

                            <p className="mt-3 text-lg font-medium text-gray-800">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
                {/* <div className="flex justify-center gap-10 gap-x-20">
                    {data.stats.map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                        <div className="flex items-end">
                            <span className="text-5xl font-bold text-[#FF1033]">
                                {item.value}
                            </span>
                            <span className="text-3xl font-bold text-[#FF1033] ml-1">
                                {item.suffix}
                            </span>
                        </div>

                        {item.subValue && (
                            <p className="text-sm text-gray-500 mt-1">
                                {item.subValue}
                            </p>
                        )}

                        <p className="mt-3 text-lg font-medium text-gray-800">
                            {item.label}
                        </p>
                    </div>
                    ))}
                </div> */}
            </div>
        </section>
    );
};

export default OurFootprints;






// const OurFootprints = ({ data }) => {
//     return (
//         <section className="py-16 text-center">
//              <h2 className="text-4xl font-bold mb-6">Our Footprints</h2>
//             <p className="max-w-3xl mx-auto text-gray-600 mb-10">
//                 {data.description}
//             </p>

//             <div className="flex justify-center gap-10">
//                 {data.stats.map((item, i) => (
//                     <div key={i}>
//                         <p className="text-3xl font-bold text-[#FF1033]">{item.value}</p>
//                         <p className="text-gray-600">{item.label}</p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default OurFootprints;
