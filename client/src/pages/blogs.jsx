import { Blog } from "../components/BlogsComponents/blog2";
import CareersHero from "../components/careers/CareersHero";
import SEO from "../components/reusable/SEO";
import data from "../data/blogPage.json";

const Blogs = () => {
  return (
    <>
      <SEO />
      <CareersHero data={data.hero} />
      <Blog />
    </>
  );
};

export default Blogs;
