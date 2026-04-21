import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AboutHero from "../components/about-us/AboutHero";
import OurFootprints from "../components/reusable/OurFootprints";
import OurStrengths from "../components/reusable/OurStrengths";
import TeamGrid from "../components/about-us/TeamGrid";
import Timeline from "../components/reusable/Timeline";
import VisionMission from "../components/about-us/VisionMission";
import WhoWeAre from "../components/reusable/WhoWeAre";
import { fetchTeamMembers } from "../redux/slices/teamSlice";
import { fetchOfficialPartners } from "../redux/slices/partnerSlice";
import SEO from "../components/reusable/SEO";
import data from "../data/aboutPage.json";


const AboutUs = () => {
  const dispatch = useDispatch();
  const { teamMembersByCategory, loading, error } = useSelector((state) => state.team);
  const { officialPartners, loadingOfficialPartners } = useSelector((state) => state.partner);




  // useEffect(() => {
  //   dispatch(fetchTeamMembers());
  //   dispatch(fetchOfficialPartners());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTeamMembers());

    if (!officialPartners.length) {
      dispatch(fetchOfficialPartners());
    }
  }, [dispatch, officialPartners.length]);



  // Define the order in which categories should be displayed
  const categoryOrder = ["Board of Directors", "Management", "Leadership"];

  // Function to get display title for category
  const getCategoryTitle = (category) => {
    const titleMap = {
      "Management": "Management Team",
      "Board of Directors": "Board of Directors",
      "Leadership": "Leadership"
    };
    return titleMap[category] || category;
  };

  //Sort partners
  const sortedPartners = [...officialPartners].sort(
    (a, b) => Number(a.year) - Number(b.year)
  );

  // Sort categories based on the defined order
  const sortedCategories = Object.keys(teamMembersByCategory || {}).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    // If both are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only a is in the order array, it comes first
    if (indexA !== -1) return -1;
    // If only b is in the order array, it comes first
    if (indexB !== -1) return 1;
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });


  return (
    <>
      <SEO />
      <AboutHero data={data.hero} />
      <WhoWeAre data={data.whoWeAre} />
      <Timeline data={sortedPartners} />
      {loading && <div className="text-center py-8">Loading team members...</div>}
      {error && <div className="text-center py-8 text-[#FF1033]">Error loading team members: {error}</div>}
      {!loading && !error && (
        <>
          {sortedCategories.map((category) => (
            teamMembersByCategory[category] && teamMembersByCategory[category].length > 0 && (
              <TeamGrid
                key={category}
                title={getCategoryTitle(category)}
                data={teamMembersByCategory[category]}
              />
            )
          ))}
        </>
      )}
      <VisionMission data={data.visionMission} />
      <OurStrengths data={data.strengths} image={data.hero.backgroundImage} />
      {/* <OurFootprints aboutSection={data.aboutSection} data={data.footprints} /> */}
    </>
  );
};

export default AboutUs;
