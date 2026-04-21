import { motion, AnimatePresence } from "framer-motion";

const JobDescriptionModal = ({ job, onApply, onClose }) => {
    if (!job) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/40"
                    onClick={onClose}
                />

                {/* Modal sliding from right */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[60%] lg:w-[70%] bg-white  overflow-y-auto no-scrollbar"
                >
                    {/* Header */}
                    <div className="px-10 py-6 flex justify-between items-center border-b sticky top-0 bg-white z-10">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900">
                                {job.title}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {job.location} · {job.jobType}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-2xl text-gray-500 hover:text-black transition"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-w-7xl mx-auto px-10 py-10 space-y-8">
                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed">
                            {job.description}
                        </p>

                        {/* Responsibilities */}
                        {job.responsibilities?.length > 0 && (
                            <div>
                                <h2 className="text-4xl font-semibold mb-3">
                                    Key Responsibilities
                                </h2>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    {job.responsibilities.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Qualifications */}
                        {job.qualifications?.length > 0 && (
                            <div>
                                <h2 className="text-4xl font-semibold mb-3">
                                    Qualifications
                                </h2>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    {job.qualifications.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Apply */}
                        <div className="pt-4">
                            <button
                                onClick={() => onApply(job)}
                                className="bg-[#FF1033] text-[#FFFDF5] px-8 py-3 rounded-full font-bold hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobDescriptionModal;




// const JobDescriptionModal = ({ job, onClose }) => {
//     if (!job) return null;

//     return (
//         <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
//             {/* Header */}
//             <div className="bg-white border-0 px-10 py-6 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-3xl font-semibold text-gray-900">
//                         {job.title}
//                     </h1>
//                     <p className="text-gray-600 mt-1">
//                         Location: {job.location}
//                     </p>
//                 </div>

//                 <button
//                     onClick={onClose}
//                     className="text-2xl text-gray-500 hover:text-black"
//                 >
//                     ✕
//                 </button>
//             </div>

//             {/* Content */}
//             <div className="max-w-7xl mx-auto px-10 py-10 space-y-8">

//                 {/* Summary */}
//                 <p className="text-lg font-semibold text-gray-800">
//                     {job.description.summary}
//                 </p>

//                 {/* Job Summary */}
//                 {job.description.jobSummary && (
//                     <div>
//                         <h2 className="text-xl font-semibold mb-3">
//                             Job Summary
//                         </h2>
//                         <p className="text-gray-700 leading-relaxed">
//                             {job.description.jobSummary}
//                         </p>
//                     </div>
//                 )}

//                 {/* Responsibilities */}
//                 {job.description.responsibilities?.length > 0 && (
//                     <div>
//                         <h2 className="text-xl font-bold mb-3">
//                             Key Responsibilities
//                         </h2>
//                         <ul className="list-disc pl-6 space-y-2 text-gray-700">
//                             {job.description.responsibilities.map((item, i) => (
//                                 <li key={i}>{item}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 {/* Apply Button */}
//                 {/* <div className="pt-6">
//                     <button className="bg-[#FF1033] hover:bg-[#511313] text-white px-8 py-3 rounded-lg font-semibold">
//                         Apply Now
//                     </button>
//                 </div> */}
//             </div>
//         </div>
//     );
// };

// export default JobDescriptionModal;
