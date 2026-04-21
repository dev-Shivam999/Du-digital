import data from "../data/becomePartner.json";
import HeroSection from "../components/become-partner/HeroSection";
import WhyDuGlobal from "../components/become-partner/WhyDuGlobal";
import PartnerFAQ from "../components/become-partner/PartnerFAQ";
// import OurFootprints from "../components/become-partner/OurFootprints";
import Gallery from "../components/become-partner/Gallery";
import ContactExperts from "../components/become-partner/ContactExperts";
import SEO from "../components/reusable/SEO";

const BecomePartner = () => {
    return (
        <>
            <SEO />
            <HeroSection data={data.partnerHero} />
            <WhyDuGlobal data={data.whyUs} />
            <PartnerFAQ data={data.faq} />
            {/* <OurFootprints data={data.footprints} /> */}
            <Gallery />
            <ContactExperts data={data.contactExpertsSection} />
        </>
    );
};

export default BecomePartner;
