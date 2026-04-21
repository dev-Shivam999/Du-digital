const AboutHero = ({ data }) => (
    <section className="sm:h-[800px] min-h-[800px] relative flex items-center">
        <img
            src={data.backgroundImage}
            alt={data.title || "About Us Hero"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent" /> */}
        <div className="relative z-10 max-w-7xl mr-auto px-8 md:px-20 text-white">
            <h1 className="text-4xl md:text-5xl font-bold">{data.title}</h1>
            <p className="mt-4 max-w-xl">{data.subtitle}</p>
        </div>
    </section>
);

export default AboutHero;
