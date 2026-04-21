import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSalesExperts } from "../../redux/slices/salesSlice";
import { LoadingState, ErrorState } from "../reusable";

const ContactExperts = ({ data }) => {
    const dispatch = useDispatch();
    const { salesExperts, loading, error } = useSelector((state) => state.sales);

    useEffect(() => {
        dispatch(fetchSalesExperts());
    }, [dispatch]);

    // Show loading state
    if (loading) {
        return <LoadingState message="Loading sales experts..." />;
    }

    // Show error state
    if (error) {
        return (
            <ErrorState
                error={error}
                title="Failed to load sales experts"
                onRetry={() => dispatch(fetchSalesExperts())}
            />
        );
    }

    return (
        <section className="bg-black py-20">
            <div className="max-w-6xl mx-auto px-6">

                {/* TITLE LEFT / CTA RIGHT */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
                    <h2 className="text-4xl  font-bold text-white max-w-md">
                        {data.title}
                    </h2>

                    <Link to={data.ctaLink} className="mt-6 md:mt-0 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300 px-8 py-3 font-bold text-lg rounded-full">
                        {data.ctaText}
                    </Link>
                </div>

                {/* CONTACT CARDS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {salesExperts && salesExperts.length > 0 ? (
                        salesExperts.map((expert) => (
                            <div
                                key={expert._id}
                                className="bg-white border border-gray-200 rounded-2xl p-8"
                            >
                                {/* Region */}
                                <p className="text-sm font-medium text-gray-500 mb-2">
                                    {expert.region || "N/A"}
                                </p>

                                {/* Name */}
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {expert.name}
                                </h3>

                                {/* Designation */}
                                <p className="text-sm text-gray-500 mt-1">
                                    {expert.designation}
                                </p>

                                {/* Phone */}
                                <p className="mt-4 text-[#FF1033] font-medium">
                                    {expert.phone}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-white">
                            <p>No sales experts available at the moment.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default ContactExperts;









// const ContactExperts = ({ data }) => {
//     return (
//         <section className="bg-black py-20">
//             <div className="max-w-6xl mx-auto px-6">

//                 {/* TITLE LEFT / CTA RIGHT */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
//                      <h2 className="text-4xl  font-bold text-white max-w-md">
//                         {data.title}
//                     </h2>

//                     <button className="mt-6 md:mt-0 bg-[#FF1033] hover:bg-[#511313] transition px-8 py-3 font-semibold text-white rounded">
//                         {data.ctaText}
//                     </button>
//                 </div>

//                 {/* CONTACT CARDS */}
//                 <div className="grid md:grid-cols-2 gap-8">
//                     {data.cards
//                         .filter(card => card.type === "phone")
//                         .map((card, index) => (
//                             <div
//                                 key={index}
//                                 className="bg-white border border-gray-200 rounded-2xl p-8"
//                             >
//                                 {/* Card Title */}
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-6">
//                                     Regional Contacts
//                                 </h3>

//                                 {/* Regions */}
//                                 {card.regions.map((item, i) => (
//                                     <div key={i} className="mb-6 last:mb-0">
//                                         <p className="text-sm font-medium text-gray-500">
//                                             {item.region}
//                                         </p>

//                                         <p className="mt-1 text-gray-900 font-medium">
//                                             {item.name}
//                                         </p>

//                                         <p className="text-sm text-gray-500">
//                                             {item.designation}
//                                         </p>

//                                         <p className="mt-2 text-[#FF1033] font-medium">
//                                             {item.phone}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         ))}
//                 </div>

//             </div>
//         </section>
//     );
// };

// export default ContactExperts;










// import { Link } from "react-router-dom";

// const ContactExperts = ({ data }) => {
//     return (
//         <section className="bg-black py-20">
//             <div className="max-w-6xl mx-auto px-6">

//                 {/* TOP ROW: TITLE LEFT / CTA RIGHT */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
//                      <h2 className="text-4xl  font-bold text-white max-w-md">
//                         {data.title}
//                     </h2>

//                     <Link to="/contact-us" className="mt-6 md:mt-0 bg-[#FF1033] hover:bg-[#511313] transition px-8 py-3 font-semibold text-white">
//                         {data.ctaText}
//                     </Link>
//                 </div>

//                 {/* CONTACT CARDS */}
//                 <div className="grid md:grid-cols-2 gap-8">
//                     {data.cards
//                         .filter(card => card.type === "phone")
//                         .map((card, index) => (
//                             <div key={index} className="bg-white p-6">
//                                 {card.regions.map((item, i) => (
//                                     <div key={i} className="mb-6 last:mb-0">
//                                         <p className="font-semibold text-gray-900">
//                                             {item.region}
//                                         </p>

//                                         <p className="text-[#FF1033] font-medium mt-1">
//                                             {item.name} ({item.designation})
//                                         </p>

//                                         <p className="text-[#FF1033]">
//                                             {item.phone}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                         ))}
//                 </div>

//             </div>
//         </section>
//     );
// };

// export default ContactExperts;











// const ContactExperts = ({ data }) => {
//     return (
//         <section className="bg-black py-20">
//             <div className="max-w-6xl mx-auto px-6">
//                 <div className="grid md:grid-cols-2 gap-16 items-start">

//                     {/* LEFT CONTENT */}
//                     <div className="text-white">
//                          <h2 className="text-4xl  font-bold mb-6">
//                             {data.title}
//                         </h2>

//                         <p className="text-gray-400 max-w-md mb-8">
//                             Speak directly with our regional experts for tailored guidance,
//                             faster responses, and personalized support for your business
//                             needs.
//                         </p>

//                         <button className="bg-[#FF1033] hover:bg-[#511313] transition px-8 py-3 font-semibold">
//                             {data.ctaText}
//                         </button>
//                     </div>

//                     {/* RIGHT CONTACT CARDS */}
//                     <div className="grid sm:grid-cols-2 gap-6">
//                         {data.cards
//                             .filter(card => card.type === "phone")
//                             .map((card, index) => (
//                                 <div
//                                     key={index}
//                                     className="bg-white p-6"
//                                 >
//                                     {card.regions.map((item, i) => (
//                                         <div key={i} className="mb-6 last:mb-0">
//                                             <p className="font-semibold text-gray-900">
//                                                 {item.region}
//                                             </p>

//                                             <p className="text-[#FF1033] font-medium mt-1">
//                                                 {item.name} ({item.designation})
//                                             </p>

//                                             <p className="text-[#FF1033]">
//                                                 {item.phone}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ))}
//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// };

// export default ContactExperts;














// import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

// const ContactExperts = ({ data }) => {
//     return (
//         <section className="bg-black text-white py-20">
//             <div className="max-w-6xl mx-auto px-4 text-center">
//                 {/* Title */}
//                  <h2 className="text-4xl  font-bold mb-8">
//                     {data.title}
//                 </h2>

//                 {/* CTA */}
//                 <button className="bg-[#FF1033] hover:bg-[#511313] transition px-8 py-3 font-semibold mb-16">
//                     {data.ctaText}
//                 </button>

//                 {/* Cards */}
//                 <div className="grid md:grid-cols-3 gap-8 text-left">
//                     {data.cards.map((card, index) => (
//                         <div
//                             key={index}
//                             className="relative bg-white text-black p-4  "
//                         >
//                             {/* Icon */}
//                             <div className="absolute -top-6 right-6 bg-[#FF1033] text-white p-4 rounded-full">
//                                 {card.type === "phone" ? (
//                                     <FaPhoneAlt />
//                                 ) : (
//                                     <FaMapMarkerAlt />
//                                 )}
//                             </div>

//                             <h3 className="text-xl font-semibold mb-4">
//                                 {card.title}
//                             </h3>

//                             {/* Phone Cards */}
//                             {card.type === "phone" &&
//                                 card.regions.map((item, i) => (
//                                     <div key={i} className="mb-6">
//                                         <p className="text-[#FF1033] font-semibold">
//                                             {item.region}
//                                         </p>
//                                         <p className="text-[#FF1033]">
//                                             {item.name} ({item.designation})  {item.phone}
//                                         </p>
//                                         {/* <p className="text-[#FF1033]">
//                                             {item.phone}
//                                         </p> */}
//                                     </div>
//                                 ))}

//                             {/* Location Card */}
//                             {card.type === "location" && (
//                                 <div>
//                                     <p className="text-[#FF1033] font-semibold">
//                                         {card.addressTitle}:
//                                     </p>
//                                     <p className="mt-2">
//                                         {card.address}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default ContactExperts;
