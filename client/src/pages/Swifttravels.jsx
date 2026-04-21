import CardData from "../components/swifttravels/CardData";
import AboutSwifttravelSection from "../components/swifttravels/TravelAboutSection";
import data from "../data/swifttravels.json";
import SEO from "../components/reusable/SEO";
export const Swifttravels = () => {
  return (
    <>
      <SEO />
      <section className="relative w-full h-[550px] overflow-hidden">
        {/* IMAGE (Right → Left) */}
        <img
          src={data.hero.image}
          alt={data.hero.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* CONTENT (Bottom → Up) */}
        <div
          className="relative z-20 max-w-7xl mx-auto px-6 md:px-20 h-full flex items-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}>
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
              {data.hero.title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-gray-200">
              {data.hero.description}
            </p>
          </div>
        </div>
      </section>
      <div className="flex justify-center  items-center  flex-col">
        <h2 class="text-4xl  my-6 pt-10 mb-4 font-bold">Travel Packages</h2>
      </div>

      <CardData />


      <AboutSwifttravelSection data={data.aboutSwifttravelSection} />
    </>
  );
};
