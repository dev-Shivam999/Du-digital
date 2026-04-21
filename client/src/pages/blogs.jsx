import { Blog } from "../components/BlogsComponents/blog2";
import CareersHero from "../components/careers/CareersHero";
import data from "../data/blogPage.json";

const Blogs = () => {
  return (
    <>
      <CareersHero data={data.hero} />
      <Blog />
    </>
  );
};

export default Blogs;
