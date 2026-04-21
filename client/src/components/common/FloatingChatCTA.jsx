import { useState } from "react";

const FloatingChatCTA = () => {
    const [showTopText, setShowTopText] = useState(true);
    const [showBottomText, setShowBottomText] = useState(true);

    return (
        <div className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-4">
            {/* ===== Top CTA ===== */}
            <div className="flex items-center gap-3">
                {showTopText && (
                    <div className="relative bg-white max-md:hidden px-6 py-3 rounded-full  text-sm font-semibold pr-10">
                        Hey, Let’s Chat
                        <button
                            onClick={() => setShowTopText(false)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <a
                    href="https://wa.me/917289000071?text=Hello,%20I%20need%20assistance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-105 transition"
                >
                    <img
                        src="/assets/cta/whatsapp-cta.png"
                        alt="WhatsApp"
                        className="w-7 h-7"
                    />
                </a>
            </div>

            {/* ===== Bottom CTA ===== */}
            {/* <div className="flex items-center gap-3">
                {showBottomText && (
                    <div className="relative bg-[#FF1F3D] max-md:hidden text-white px-8 py-4 rounded-full font-semibold   pr-10">
                        Chat with us!
                        <button
                            onClick={() => setShowBottomText(false)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <a
                    href="/contact"
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center  md hover:scale-105 transition"
                >
                    <img
                        src="/assets/cta/du-chat-cta.png"
                        alt="DU"
                        className="w-7 h-7"
                    />
                </a>
            </div> */}
        </div>
    );
};

export default FloatingChatCTA;













// import { FaWhatsapp } from "react-icons/fa";

// const FloatingChatCTA = () => {
//     return (
//         <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
//             {/* Top CTA */}
//             <div className="flex items-center gap-3">
//                 <div className="bg-white px-6 py-3 rounded-full  md text-sm font-semibold">
//                     Hey, Let’s Chat
//                 </div>

//                 <a
//                     href="https://wa.me/917289000071?text=Hello,%20I%20need%20assistance."
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center   hover:scale-105 transition"
//                 >
//                     <FaWhatsapp className="text-white text-2xl" />
//                 </a>
//             </div>

//             {/* Bottom CTA */}
//             <div className="flex items-center gap-3">
//                 <a
//                     href="/contact"
//                     className="bg-[#FF1F3D] text-white px-8 py-4 rounded-full font-semibold   hover:bg-[#FF1033] transition"
//                 >
//                     Chat with us!
//                 </a>

//                 <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center  md">
//                     <span className="text-[#D1001F] font-bold text-xl">
//                         D<span className="inline-block -translate-y-1">↑</span>
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FloatingChatCTA;
