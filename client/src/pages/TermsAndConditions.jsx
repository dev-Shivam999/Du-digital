import data from "../data/TermsConditions.json";

const TermsAndConditions = () => {
    const { hero, content } = data;
    return (
        <>
            {/* HERO */}
            <section
                className="h-[800px] flex items-center justify-center relative overflow-hidden"
            // style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            >
                <img
                    src={hero.backgroundImage}
                    alt="Terms and Conditions"
                    className="absolute inset-0 w-full h-full object-center object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <h1 className="relative z-10 text-white text-4xl  font-semibold p-2 text-center">
                    {hero.title}
                </h1>
            </section>

            {/* CONTENT */}
            <section className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-6 space-y-10 text-gray-700 leading-relaxed text-base">

                    {content.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-3">
                                {section.heading}
                            </h3>

                            {/* Single text */}
                            {section.text && (
                                <p className="text-gray-600">{section.text}</p>
                            )}

                            {/* Multiple paragraphs */}
                            {section.paragraphs && (
                                <div className="space-y-4">
                                    {section.paragraphs.map((para, i) => (
                                        <p key={i} className="text-gray-600">{para}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </section>
        </>
    );
};

export default TermsAndConditions;
