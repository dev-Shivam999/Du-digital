const GovernmentEmbHero = ({ data }) => (
    <section className="sm:h-[800px] min-h-[800px] relative flex items-center">
        <img
            src={data.backgroundImage}
            alt={data.title || "Government Embassy Hero"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent" /> */}
        <div className="relative z-10 max-w-4xl mr-auto px-8 md:px-20 text-white">
            <h1 className="text-4xl  font-bold" style={{ textWrap: "balance" }}>{data.title}</h1>
            <p className="mt-4 max-w-xl">{data.subtitle}</p>
            <a href={data.button.link} className="mt-8 inline-flex items-center px-6 py-2.5 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] cursor-pointer">
                {data.button.text}
            </a>
        </div>
    </section>
);

export default GovernmentEmbHero;
