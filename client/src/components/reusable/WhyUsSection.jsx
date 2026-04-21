import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

const WhyUsSection = ({ data, button = false, buttonLink = "", buttonName = "" }) => {
    return (
        <section
            className="relative py-24 bg-cover bg-center text-white"
        // style={{ backgroundImage: `url(${data.backgroundImage})` }}
        >
            <img src={data.backgroundImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80" />
            {/* relative max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2  items-center */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-20 flex flex-col lg:flex-row gap-x-8 items-center">

                {/* LEFT CONTENT */}
                <div className="w-full lg:w-[70%]">
                    <h2 className="text-4xl md:text-4xl font-semibold leading-tight mb-6">
                        {data.title}
                    </h2>

                    {/* <div className="w-12 h-[2px] bg-[#FF1033] mb-6" /> */}

                    <p className="text-gray-300 text-base leading-relaxed max-w-xl mb-8">
                        {data.description}
                    </p>

                    {/* <a
                        href={data.cta.link}
                        className="inline-block bg-[#FF1033] text-white px-6 py-3 rounded-md font-medium hover:bg-[#511313] transition"
                    >
                        {data.cta.text}
                    </a> */}
                    {button && (
                        <Link
                            to={buttonLink}
                            className="inline-block font-medium px-6 py-3 rounded-full text-white font-semibold  bg-[#FF1033] hover:bg-[#511313] transition"
                        >
                            {buttonName}
                        </Link>
                    )}
                </div>

                {/* RIGHT FEATURES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                    {data.features.map((item, index) => {
                        const Icon = Icons[item.icon] || Icons.HelpCircle;

                        return (
                            <div key={index} className="flex items-start gap-4">

                                {/* ICON */}
                                <div className="flex-shrink-0 bg-[#FF1033] p-3 rounded-md">
                                    <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                                </div>

                                {/* TEXT */}
                                <div>
                                    <h4 className="text-2xl font-medium mb-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-300 text-base leading-relaxed" style={{ textWrap: "balance" }}>
                                        {item.text}
                                    </p>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default WhyUsSection;
