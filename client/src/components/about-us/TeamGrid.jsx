import LazyImage from "../reusable/LazyImage";

const TeamGrid = ({ title, subtitle, data }) => {
    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <section className="py-20 bg-[#F9F9F9]">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="mb-14">
                    <span className="inline-block mb-3 px-4 py-1 text-sm font-medium rounded-full border border-gray-300">
                        EXPERTS
                    </span>

                    <h2 className="text-4xl  font-bold mb-4">{title}</h2>

                    {subtitle && (
                        <p className="max-w-2xl text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((member, i) => (
                        <div
                            key={member._id || i}
                            tabIndex="0"
                            className="group relative h-[420px] rounded-2xl overflow-hidden bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            {/* IMAGE */}
                            <LazyImage
                                src={`${import.meta.env.VITE_API_URL}${member.profileImage || member.image}`}
                                alt={member.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                fill
                            />

                            {/* DARK GRADIENT */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            {/* NAME & DESIGNATION (ON IMAGE) */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                                <h4 className="text-lg font-semibold">
                                    {member.name.toUpperCase()}
                                </h4>
                                <p className="text-sm text-white/80">
                                    {member.designation}
                                </p>
                            </div>

                            {/* HOVER DESCRIPTION */}
                            {member.description && (
                                <div className="absolute inset-0 z-20 bg-red-900/80 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                                    <div className="absolute top-0 w-full max-h-[100%] overflow-y-auto p-5 text-sm text-white no-scrollbar">
                                        <div className="py-2 mb-5 text-white z-10">
                                            <h4 className="text-lg font-semibold">
                                                {member.name}
                                            </h4>
                                            <p className="text-sm text-white/80">
                                                {member.designation}
                                            </p>
                                        </div>
                                        <ul className="space-y-1">
                                            {member.description
                                                .split("\n")
                                                .map((point, idx) => (
                                                    <li key={idx} className="my-3">• {point}</li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamGrid;











// const TeamGrid = ({ title, subtitle, data }) => {
//     if (!data || data.length === 0) return null;

//     return (
//         <section className="py-20 bg-[#F9F9F9]">
//             <div className="max-w-6xl mx-auto px-6">

//                 {/* HEADER */}
//                 <div className="mb-14">
//                     <span className="inline-block mb-3 px-4 py-1 text-sm font-medium rounded-full border border-gray-300">
//                         EXPERTS
//                     </span>

//                      <h2 className="text-4xl  font-bold mb-4">{title}</h2>

//                     {subtitle && (
//                         <p className="max-w-2xl text-gray-600">
//                             {subtitle}
//                         </p>
//                     )}
//                 </div>

//                 {/* GRID */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {data.map((member, i) => {
//                         const isFeatured = i === 0;

//                         return (
//                             <div
//                                 key={member._id || i}
//                                 className={`group relative rounded-2xl overflow-hidden transition ${isFeatured
//                                     ? "bg-[#EDEDED]"
//                                     : "bg-[#EDEDED]"
//                                     }`}
//                             >
//                                 {/* IMAGE */}
//                                 <div className="relative">
//                                     <img
//                                         src={
//                                             member.profileImage ||
//                                             member.image
//                                         }
//                                         alt={member.name}
//                                         className="w-full h-auto object-contain"
//                                     />

//                                     {/* HOVER DESCRIPTION */}
//                                     {member.description && (
//                                         <div className="absolute inset-0 bg-black/70 opacity-0 translate-y-full group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-end">
//                                             {/* SCROLL CONTAINER */}
//                                             <div className="w-full max-h-[100%] overflow-y-auto p-4 text-sm text-white no-scrollbar">
//                                                 <ul className="space-y-1">
//                                                     {member.description.split("\n").map((point, idx) => (
//                                                         <li key={idx}>• {point}</li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* CONTENT */}
//                                 <div className="p-5 bg-transparent">
//                                     <h4 className="text-lg font-semibold">
//                                         {member.name}
//                                     </h4>

//                                     <p
//                                         className={`text-sm ${isFeatured
//                                             ? "text-gray-600"
//                                             : "text-gray-600"
//                                             }`}
//                                     >
//                                         {member.designation}
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default TeamGrid;









// const TeamGrid = ({ title, data }) => {
//     if (!data || data.length === 0) return null;

//     return (
//         <section className="py-16 bg-gray-50">
//              <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>

//             <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
//                 {data.map((member, i) => (
//                     <div
//                         key={member._id || i}
//                         className="group relative bg-gradient-to-b from-[#F9E9E9] to-[#F9E9E9]/50 rounded-lg overflow-hidden     transition"
//                     >
//                         {/* RED TOP BAR */}
//                         {/* <div className="h-1 bg-[#FF1033]"></div> */}

//                         {/* IMAGE */}
//                         <div className="relative">
//                             <img
//                                 src={
//                                     member.profileImage ||
//                                     member.image ||
//                                     "https://dudigitalglobal.com/wp-content/uploads/2024/11/Aditya-Sanghi-1.png"
//                                 }
//                                 alt={member.name}
//                                 className="w-full h-[280px] object-cover transition duration-300 group-hover:scale-105"
//                             />

//                             {/* SLIDE-UP OVERLAY */}
//                             <div
//                                 className="absolute inset-0 bg-[#FFFFFF] translate-y-full group-hover:translate-y-10 z-0 transition-all duration-500 ease-out flex flex-col
//                 "
//                             >
//                                 <div className="p-4 text-black text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
//                                     <ul className="list-disc pl-5 space-y-2">
//                                         {member.description
//                                             ?.split("\n")
//                                             .map((point, idx) => (
//                                                 <li key={idx}>{point}</li>
//                                             ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* NAME & DESIGNATION */}
//                         <div className="p-4 text-center bg-white border-t-4 border-[#FF1033] w-[80%] mx-auto relative z-10">
//                             <h4 className="font-semibold text-gray-900">
//                                 {member.name}
//                             </h4>
//                             <p className="text-sm text-gray-500">
//                                 {member.designation}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default TeamGrid;








// const TeamGrid = ({ title, data }) => {
//     if (!data || data.length === 0) {
//         return null;
//     }

//     return (
//         <section className="py-16 bg-gray-50">
//              <h2 className="text-4xl font-bold text-center mb-10">{title}</h2>
//             <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
//                 {data.map((member, i) => (
//                     <div key={member._id || i} className="text-center bg-white p-4 rounded  ">
//                         <img
//                             src={member.profileImage || member.image}
//                             alt={member.name}
//                             className="mx-auto rounded mb-3 w-full h-auto object-cover"
//                         />
//                         <h4 className="font-semibold">{member.name}</h4>
//                         <p className="text-sm text-gray-500">{member.designation}</p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default TeamGrid;
