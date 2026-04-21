import NewsCoverage from "../components/news-and-events/NewsCoverage";
import NewsAndMediaHero from "../components/news-and-events/NewsHero";
import PageTabs from "../components/news-and-events/PageTabs";
import newsData from '../data/newsPage.json';
import SEO from "../components/reusable/SEO";

const NewsAndMedia = () => {
    return (
        <div>
            <SEO />
            <NewsAndMediaHero data={newsData.hero} />
            <PageTabs />
            <NewsCoverage />
        </div>
    );
};

export default NewsAndMedia;
