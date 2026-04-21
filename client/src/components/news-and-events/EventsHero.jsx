const EventsHero = ({ data }) => (
    <section className="h-[600px] relative flex items-center justify-center">
        <img
            src={data.background}
            alt={data.title || "Events Hero"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
        />
        {/* <div className="absolute inset-0 bg-red-900/40" /> */}
        <h1 className="relative text-4xl  font-bold text-white">
            {data.title}
        </h1>
    </section>
);

export default EventsHero;
