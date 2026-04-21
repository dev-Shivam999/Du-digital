import EventsHero from '../components/news-and-events/EventsHero';
import eventsData from '../data/eventsPage.json';
import EventsGrid from '../components/news-and-events/EventsGrid';
import PageTabs from '../components/news-and-events/PageTabs';
import SEO from '../components/reusable/SEO';

const Events = () => {
    return (
        <div>
            <SEO />
            <EventsHero data={eventsData.hero} />
            <PageTabs />
            <EventsGrid />
        </div>
    );
};

export default Events;