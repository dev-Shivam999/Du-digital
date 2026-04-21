import data from "../data/capabilities.json";
import {
    FaPassport,
    FaBullhorn,
    FaGlobe,
    FaListUl,
    FaFileAlt,
    FaBalanceScale,
    FaCalendarAlt,
    FaShieldAlt,
    FaHome
} from "react-icons/fa";
import SEO from "../components/reusable/SEO";

const OurCapabilities = () => {
    // ICON MAP (LOCAL)
    const iconMap = {
        passport: FaPassport,
        megaphone: FaBullhorn,
        globe: FaGlobe,
        list: FaListUl,
        document: FaFileAlt,
        balance: FaBalanceScale,
        calendar: FaCalendarAlt,
        shield: FaShieldAlt,
        home: FaHome
    };

    return (
        <section className="bg-gray-50">
            <SEO />
            {/* HERO */}
            <div className="relative sm:h-[800px] min-h-[800px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <img
                    src={data.backgroundImage}
                    alt="Capabilities background"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Heading */}
                <h1 className="relative z-10 text-4xl  font-bold text-white">
                    {data.heading}
                </h1>
            </div>

            {/* GRID */}
            <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items.map((item, i) => {
                        const Icon = iconMap[item.icon];

                        return (
                            <div
                                key={i}
                                className="bg-white rounded-xl p-8 text-center
                                            sm   transition"
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    {Icon && (
                                        <Icon className="text-[#FF1033] text-4xl" />
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold mb-3">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OurCapabilities;
