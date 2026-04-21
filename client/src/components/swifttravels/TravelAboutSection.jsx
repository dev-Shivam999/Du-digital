import {
    IndianRupee,
    ThumbsUp,
    Train,
    Headphones
} from "lucide-react";

const iconMap = {
    rupee: IndianRupee,
    "thumbs-up": ThumbsUp,
    train: Train,
    headset: Headphones,
};

const AboutSwifttravelSection = ({ data }) => {
    if (!data) return null;

    const {
        badge,
        title,
        description,
        features = [],
    } = data;

    return (
        <section className="bg-white">
            {/* TOP CONTENT */}
            <div className="max-w-5xl mx-auto px-6 pt-20 text-center">
              

                <h2 className="text-4xl md:text-4xl mb-6 font-bold text-gray-900">
                    {title}
                </h2>



                <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>

            {/* FEATURES GRID */}
            <div className="bg-black mt-16">
                <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8">
                    {features.map((item) => {
                        const Icon = iconMap[item.icon];

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl p-8   relative overflow-hidden"
                            >
                                {/* LEFT RED BORDER */}
                                <div className="absolute left-0 top-0 h-full w-2 bg-[#FF1033]" />

                                {/* ICON */}
                                {Icon && (
                                    <Icon className="w-12 h-12 text-[#FF1033] mb-4" />
                                )}

                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed" style={{ textWrap: "balance" }}>
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

export default AboutSwifttravelSection;
