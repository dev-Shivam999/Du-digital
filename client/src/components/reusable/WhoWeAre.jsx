const WhoWeAre = ({ data }) => {
    return (
        <section className="relative py-20 bg-white overflow-hidden">
            {/* Background Faded Text */}
            {/* <h2 className="absolute top-10 inset-x-0 flex justify-center items-center
          text-[120px] md:text-[120px] font-extrabold
          text-gray-100 pointer-events-none select-none">
                {data.heading}
            </h2> */}

            <div className="relative max-w-7xl mx-auto px-6 md:px-20">
                {/* Top Label */}
                <p className="text-center text-[#FF1033] font-semibold tracking-widest mb-2">
                    {/* {data.title} */}
                </p>

                {/* Main Heading */}
                <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    {data.heading}
                </h3>

                {/* Red Divider */}
                {/* <div className="w-16 h-1 bg-[#FF1033] mx-auto mb-12"></div> */}

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 text-gray-700 text-justify leading-relaxed">
                    {Array.isArray(data?.content) && data.content.map((p, i) => (
                        <p key={i} className="text-center">{p}</p>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;
