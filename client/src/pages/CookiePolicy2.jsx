import data from "../data/ePolicy2.json";

const Policy2 = () => {
    return (
        <section className="bg-white">
            {/* HERO */}
            <div className="relative h-[800px] flex items-center justify-center overflow-hidden">
                <img
                    src={data.hero.backgroundImage}
                    alt="Cookie Policy"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* <div className="absolute inset-0 bg-black/60" /> */}
                <h1 className="relative z-10 text-white text-4xl  font-semibold">
                    {data.hero.title}
                </h1>
            </div>

            {/* CONTENT */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="space-y-10 text-sm md:text-base text-gray-700 leading-relaxed">
                    {data.content.map((section, i) => (
                        <div key={i}>
                            <h2 className="font-semibold text-black mb-3">
                                {section.heading}
                            </h2>

                            {section.text && <p>{section.text}</p>}

                            {section.list && (
                                <ul className="list-disc pl-5 mt-3 space-y-4">
                                    {section.list.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            {section.footer && (
                                <p className="mt-4">{section.footer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Policy2;
