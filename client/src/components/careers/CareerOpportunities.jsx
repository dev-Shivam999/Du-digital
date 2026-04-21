import { MapPin } from "lucide-react";

const CareerOpportunities = ({ jobs, onApply, onView }) => {
    return (
        <section className="py-20 bg-[#F6F5F2] px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="md:text-4xl text-3xl font-semibold mb-2">Open Positions</h2>
                    <p className="text-gray-500 mb-12">
                        Browse our current openings and see how you can contribute
                        to our expanding mission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.isArray(jobs) && jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-2xl p-6  transition flex flex-col justify-between"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                                    {job.title.charAt(0)}
                                </div>

                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                    {job.jobType}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-medium mb-1">
                                {job.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-2">
                                {job.department} · {job.experience}
                            </p>

                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {job.description}
                            </p>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                {job.location}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    onClick={() => onView(job)}
                                    className="text-sm font-medium text-gray-700 hover:underline"
                                >
                                    View Details
                                </button>

                                <button
                                    onClick={() => onApply(job)}
                                    className="ml-auto text-sm font-bold bg-[#FF1033] text-[#FFFDF5] px-5 py-2 rounded-full hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CareerOpportunities;









// import { MapPin } from "lucide-react";

// const CareerOpportunities = ({ jobs, onApply, onView }) => {
//     return (
//         <section className="py-20 bg-[#F6F5F2] px-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                  <h2 className="text-4xl  font-medium mb-2">Open positions</h2>
//                 <p className="text-gray-500 mb-12">
//                     Browse our current openings and see how you can contribute
//                     to our expanding mission.
//                 </p>

//                 {/* Jobs Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {jobs.map((job) => (
//                         <div
//                             key={job.id}
//                             className="bg-white rounded-2xl p-6  sm   transition"
//                         >
//                             {/* Top */}
//                             <div className="flex justify-between items-start mb-6">
//                                 <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
//                                     {job.title.charAt(0)}
//                                 </div>

//                                 <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
//                                     Full Time
//                                 </span>
//                             </div>

//                             {/* Title */}
//                             <h3 className="text-lg font-medium mb-2">
//                                 {job.title}
//                             </h3>

//                             {/* Short Summary */}
//                             <p className="text-sm text-gray-600 mb-2">
//                                 {job.description.summary}
//                             </p>

//                             {/* Job Summary */}
//                             <p className="text-sm text-gray-500 line-clamp-3 mb-2">
//                                 {job.description.jobSummary}
//                             </p>

//                             {/* Meta */}
//                             <div className="flex items-center gap-2 text-sm text-gray-500">
//                                 <MapPin size={14} />
//                                 {job.location}
//                             </div>

//                             {/* Actions */}
//                             <div className="mt-2 flex items-center gap-3">
//                                 <button
//                                     onClick={() => onView(job)}
//                                     className="text-sm font-medium text-gray-700 hover:underline"
//                                 >
//                                     View Details
//                                 </button>

//                                 <button
//                                     onClick={() => onApply(job)}
//                                     className="ml-auto text-sm font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800"
//                                 >
//                                     Apply
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CareerOpportunities;











// const CareerOpportunities = ({ jobs, onApply, onView }) => (
//     <section className="py-20 px-6">
//         <h2 className="text-2xl font-bold text-center text-[#FF1033] mb-12">
//             Open Positions
//         </h2>

//         <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {jobs.map(job => (
//                 <div
//                     key={job.id}
//                     className="bg-white rounded-lg  md border-t-4 border-[#FF1033] p-6"
//                 >
//                     <h3 className="text-lg font-semibold text-[#FF1033]">
//                         {job.title}
//                     </h3>
//                     <p className="text-sm text-gray-500 my-6">
//                         Location: {job.location}
//                     </p>

//                     <div className="h-0.5 bg-[#FF1033] mb-6"> </div>

//                     <div className="flex gap-4">
//                         <button
//                             onClick={() => onApply(job)}
//                             className="px-4 py-2 bg-[#FF1033] text-white rounded hover:bg-[#511313]"
//                         >
//                             Apply Now
//                         </button>
//                         <button
//                             onClick={() => onView(job)}
//                             className="px-4 py-2 border-0 rounded  2xl hover:bg-gray-100"
//                         >
//                             Job Description
//                         </button>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     </section>
// );

// export default CareerOpportunities;
