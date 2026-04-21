import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupedOffices } from "../../redux/slices/officeSlice";
import { MapPin, X, Globe } from "lucide-react";

const Offices = () => {
    const dispatch = useDispatch();
    const { international, india, loading, error } = useSelector((state) => state.office);
    const [mapPreviewUrl, setMapPreviewUrl] = useState(null);

    useEffect(() => {
        dispatch(fetchGroupedOffices());
    }, [dispatch]);

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 text-center">
                <p className="text-gray-600">Loading offices...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-gray-50 text-center">
                <p className="text-[#FF1033]">Error: {error}</p>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-14">
                  
                    <h2 className="text-4xl font-bold text-[#333333]">
                        India Offices
                    </h2>
                    <div className="w-28 h-1 mx-auto mt-4 rounded-full" />
                </div>

                {/* Offices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {india.map((office) => (
                        <div
                            key={office._id}
                            className="bg-white rounded-xl flex flex-col justify-between  border border-gray-200  transition p-6"
                        >
                            <div>
                                {/* Office Name */}
                                <h3 className="text-lg font-semibold text-[#333333] mb-3">
                                    {office.officeName}
                                </h3>

                                {/* Address */}
                                <div className="text-sm text-[#333333] leading-relaxed space-y-1 mb-4">
                                    <p>{office.address.line1}</p>
                                    {office.address.line2 && <p>{office.address.line2}</p>}
                                    {(office.address.city || office.address.state) && (
                                        <p>
                                            {office.address.city}
                                            {office.address.state && `, ${office.address.state}`}
                                            {office.address.pincode && ` - ${office.address.pincode}`}
                                        </p>
                                    )}
                                </div>

                                {/* Contact */}
                                <div className="text-sm text-gray-600 space-y-1 mb-4">
                                    {office.contact.email && (
                                        <p>
                                            Email:{" "}
                                            <a
                                                href={`mailto:${office.contact.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {office.contact.email}
                                            </a>
                                        </p>
                                    )}
                                    {office.contact.phone && (
                                        <p>
                                            Phone:{" "}
                                            <a
                                                href={`tel:${office.contact.phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {office.contact.phone}
                                            </a>
                                        </p>
                                    )}
                                </div>

                            </div>
                            {/* View on Maps */}
                            <button
                                onClick={() => setMapPreviewUrl(office.googleMapLink)}
                                className="inline-flex items-center pt-2 gap-2 text-sm font-medium text-[#FF1033] hover:text-red-700 bg-transparent  border-none cursor-pointer"
                            >
                                <MapPin size={16} />
                                View on Maps
                            </button>
                        </div>
                    ))}
                </div>
                <div className="text-center my-14">
                  
                    <h2 className="text-4xl font-bold text-[#333333]">
                        Global Offices
                    </h2>
                    <div className="w-28 h-1 mx-auto mt-4 rounded-full" />
                </div>

                {/* Offices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {international.map((office) => (
                        <div
                            key={office._id}
                            className="bg-white rounded-xl flex flex-col justify-between border border-gray-200  transition p-6"
                        >
                            <div>
                                {/* Office Name */}
                                <h3 className="text-lg font-semibold text-[#333333] mb-3">
                                    {office.officeName}
                                </h3>

                                {/* Address */}
                                <div className="text-sm text-[#333333] leading-relaxed space-y-1 mb-4">
                                    <p>{office.address.line1}</p>
                                    {office.address.line2 && <p>{office.address.line2}</p>}
                                    {(office.address.city || office.address.state) && (
                                        <p>
                                            {office.address.city}
                                            {office.address.state && `, ${office.address.state}`}
                                            {office.address.pincode && ` - ${office.address.pincode}`}
                                        </p>
                                    )}
                                </div>

                                {/* Contact */}
                                <div className="text-sm text-gray-600 space-y-1 mb-4">
                                    {office.contact.email && (
                                        <p>
                                            Email:{" "}
                                            <a
                                                href={`mailto:${office.contact.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {office.contact.email}
                                            </a>
                                        </p>
                                    )}
                                    {office.contact.phone && (
                                        <p>
                                            Phone:{" "}
                                            <a
                                                href={`tel:${office.contact.phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {office.contact.phone}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* View on Maps */}
                            <button
                                onClick={() => setMapPreviewUrl(office.googleMapLink)}
                                className="inline-flex pt-2  items-center gap-2 text-sm font-medium text-[#FF1033] hover:text-red-700 bg-transparent border-none cursor-pointer"
                            >
                                <MapPin size={16} />
                                View on Maps
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {india.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500">
                            No offices available at the moment.
                        </p>
                    </div>
                )}

                {/* Google Maps Preview Modal */}
                {mapPreviewUrl && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl  w-full max-w-4xl h-[80vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Google Maps Preview</h2>
                                <button
                                    onClick={() => setMapPreviewUrl(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={20} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Modal Body - iframe */}
                            <div className="flex-1 overflow-hidden">
                                <iframe
                                    src={mapPreviewUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Maps Preview"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                                <button
                                    onClick={() => setMapPreviewUrl(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => window.open(mapPreviewUrl, "_blank")}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-white bg-[#DA3745] hover:bg-[#c12d3a] rounded-lg font-medium transition"
                                >
                                    <Globe size={16} />
                                    Open in New Tab
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Offices;












// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchGroupedOffices } from '../../redux/slices/officeSlice';
// import { MapPin } from 'lucide-react';

// const Offices = () => {
//     const dispatch = useDispatch();
//     const { india, loading, error } = useSelector((state) => state.office);

//     useEffect(() => {
//         dispatch(fetchGroupedOffices());
//     }, [dispatch]);

//     if (loading) {
//         return (
//             <section className="py-16 bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-6 text-center">
//                     <p className="text-gray-600">Loading offices...</p>
//                 </div>
//             </section>
//         );
//     }

//     if (error) {
//         return (
//             <section className="py-16 bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-6 text-center">
//                     <p className="text-[#FF1033]">Error: {error}</p>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section className="py-16 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-6">
//                 {/* Header */}
//                 <div className="text-center mb-12">
//                      <h2 className="text-4xl  font-bold text-gray-900 mb-2">
//                         India Offices
//                     </h2>
//                     <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
//                 </div>

//                 {/* Offices Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {india.map((office) => (
//                         <div
//                             key={office._id}
//                             className="bg-white rounded-lg  md   transition-  duration-300 p-6"
//                         >
//                             {/* Office Name */}
//                             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                                 {office.officeName}
//                             </h3>

//                             {/* Address */}
//                             <div className="space-y-2 mb-4">
//                                 <p className="text-gray-700 text-sm leading-relaxed">
//                                     {office.address.line1}
//                                 </p>
//                                 {office.address.line2 && (
//                                     <p className="text-gray-700 text-sm leading-relaxed">
//                                         {office.address.line2}
//                                     </p>
//                                 )}
//                                 {office.address.city && (
//                                     <p className="text-gray-700 text-sm">
//                                         {office.address.city}
//                                         {office.address.state && `, ${office.address.state}`}
//                                         {office.address.pincode && ` - ${office.address.pincode}`}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Contact Info */}
//                             {(office.contact.email || office.contact.phone) && (
//                                 <div className="space-y-1 mb-4 text-sm">
//                                     {office.contact.email && (
//                                         <p className="text-gray-600">
//                                             Email: <a href={`mailto:${office.contact.email}`} className="text-blue-600 hover:underline">
//                                                 {office.contact.email}
//                                             </a>
//                                         </p>
//                                     )}
//                                     {office.contact.phone && (
//                                         <p className="text-gray-600">
//                                             Phone: <a href={`tel:${office.contact.phone}`} className="text-blue-600 hover:underline">
//                                                 {office.contact.phone}
//                                             </a>
//                                         </p>
//                                     )}
//                                 </div>
//                             )}

//                             {/* View on Maps Button */}
//                             <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition">
//                                 <MapPin size={16} />
//                                 <span>View on Maps</span>
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 {/* No Offices Message */}
//                 {india.length === 0 && !loading && (
//                     <div className="text-center py-12">
//                         <p className="text-gray-500">No offices available at the moment.</p>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default Offices;