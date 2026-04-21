import SEO from "../components/reusable/SEO";
import data from "../data/magazine.json";

const Magazine = () => {
    return (
        <section className="bg-white">
               <SEO />
            {/* HERO */}
            <div className="relative h-[800px] flex items-center justify-center overflow-hidden">
                <img
                    src={data.hero.backgroundImage}
                    alt="TnH Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                {/* <div className="absolute inset-0 bg-black/60" /> */}
                <h1 className="relative z-10 text-white text-4xl lg:text-5xl font-semibold">
                    {data.hero.title}
                </h1>
            </div>

            {/* ABOUT */}
            <div className="max-w-7xl mx-auto px-6 md:px-20 py-24">
                {/* FULL WIDTH LOGO + HEADING */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <img
                            src={data.about.logoImage}
                            alt="TnH Logo"
                            className="h-14 md:h-32"
                        />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold">
                        {data.about.heading}
                    </h2>
                </div>

                {/* CONTENT GRID */}
                <div className="grid md:grid-cols-2 gap-20 items-start">
                    {/* LEFT TEXT */}
                    <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-4">
                        <span className="block text-[#FF1033] font-medium">
                            {data.about.label}
                        </span>

                        {data.about.description
                            .split("\n\n")
                            .map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                    </div>

                    {/* RIGHT COVER */}
                    <div className="flex justify-center">
                        <div>
                            <img
                                src={data.about.coverImage}
                                alt="Magazine Cover"
                                className="rounded-lg  xl object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* EVENTS */}
            <div className="max-w-7xl mx-auto px-6 md:px-20 pb-28">
                <div className="grid md:grid-cols-2 gap-20 items-start">
                    {/* IMAGE */}
                    <div>
                        <img
                            src={data.events.image}
                            alt="TnH Events"
                            className="rounded-lg  md object-cover"
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-4">
                        <span className="block text-[#FF1033] font-medium">
                            {data.events.label}
                        </span>

                        {data.events.description
                            .split("\n\n")
                            .map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}

                        <a
                            href={data.events.ctaLink}
                            className="inline-block text-[#FF1033] font-medium underline"
                        >
                            {data.events.ctaText}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Magazine;








// import data from "../data/magazine.json";

// const Magazine = () => {
//     return (
//         <section className="bg-white">
//             {/* HERO */}
//             <div className="relative h-[320px] flex items-center justify-center overflow-hidden">
//                 <img
//                     src={data.hero.backgroundImage}
//                     alt="TnH Hero"
//                     className="absolute inset-0 w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/60" />
//                 <h1 className="relative z-10 text-white text-4xl  font-semibold">
//                     {data.hero.title}
//                 </h1>
//             </div>

//             {/* ABOUT */}
//             <div className="max-w-7xl mx-auto px-6 md:px-20 py-20">
//                 <div className="grid md:grid-cols-2 gap-16 items-start">
//                     {/* LEFT */}
//                     <div>
//                         <div className="flex justify-center mb-6">
//                             {/* <div className="border-2 border-black px-6 py-2 font-bold text-xl">
//                                 {data.about.logoText}
//                             </div> */}
//                             <img src={data.about.logoImage} alt="TnH Logo" />
//                         </div>

//                         <h2 className="text-2xl font-semibold text-center mb-10">
//                             {data.about.heading}
//                         </h2>

//                         <div className="text-sm text-gray-700 leading-relaxed space-y-4">
//                             <span className="inline-block text-[#FF1033] font-medium mb-2">
//                                 {data.about.label}
//                             </span>

//                             {data.about.description.split("\n\n").map((para, i) => (
//                                 <p key={i}>{para}</p>
//                             ))}
//                         </div>
//                     </div>

//                     {/* RIGHT */}
//                     <div className="flex justify-center">
//                         <img
//                             src={data.about.coverImage}
//                             alt="Magazine Cover"
//                             className="max-w-sm  xl"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* EVENTS */}
//             <div className="max-w-7xl mx-auto px-6 md:px-20 pb-24">
//                 <div className="grid md:grid-cols-2 gap-16 items-start">
//                     {/* IMAGE */}
//                     <div>
//                         <img
//                             src={data.events.image}
//                             alt="TnH Events"
//                             className="rounded-lg  md"
//                         />
//                     </div>

//                     {/* CONTENT */}
//                     <div className="text-sm text-gray-700 leading-relaxed space-y-4">
//                         <span className="inline-block text-[#FF1033] font-medium mb-2">
//                             {data.events.label}
//                         </span>

//                         {data.events.description.split("\n\n").map((para, i) => (
//                             <p key={i}>{para}</p>
//                         ))}

//                         <a
//                             href={data.events.ctaLink}
//                             className="inline-block text-[#FF1033] font-medium underline"
//                         >
//                             {data.events.ctaText}
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Magazine;
