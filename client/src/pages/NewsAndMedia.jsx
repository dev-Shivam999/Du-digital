import NewsCoverage from "../components/news-and-events/NewsCoverage";
import NewsAndMediaHero from "../components/news-and-events/NewsHero";
import PageTabs from "../components/news-and-events/PageTabs";
import newsData from '../data/newsPage.json';

const NewsAndMedia = () => {
    return (
        <div>
            <NewsAndMediaHero data={newsData.hero} />
            <PageTabs />
            <NewsCoverage />
        </div>
    );
};

export default NewsAndMedia;
