import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const ConnectWithUs = ({ data }) => {
    const { heading, backgroundImage, card } = data;

    return (
        <section id="connectwithus" className="relative w-full h-[420px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <img
                src={backgroundImage}
                alt="Connect background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-center px-4">
                {/* Heading */}
                <h2 className="text-white text-3xl md:text-4xl font-semibold mb-10 relative">
                    {heading}
                    <span className="absolute left-1/2 -bottom-3 w-20 h-[3px]  -translate-x-1/2" />
                </h2>

                {/* Card */}
                <div className="bg-white rounded-2xl  xl p-3 md:p-10 max-w-md w-full">
                    <h3 className="text-2xl font-semibold mb-2">
                        {card.name}
                    </h3>

                    <p className="text-gray-700 mb-6">
                        {card.designation}
                    </p>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center gap-4 text-[#FF1033]">
                            <FaEnvelope className="text-xl" />
                            <a
                                href={`mailto:${card.email}`}
                                className="font-medium hover:underline"
                            >
                                {card.email}
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-4 text-[#FF1033]">
                            <FaPhoneAlt className="text-xl" />
                            <a
                                href={`tel:${card.phone}`}
                                className="font-medium hover:underline"
                            >
                                {card.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConnectWithUs;
