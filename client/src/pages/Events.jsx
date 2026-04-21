import EventsHero from '../components/news-and-events/EventsHero';
import eventsData from '../data/eventsPage.json';
import EventsGrid from '../components/news-and-events/EventsGrid';
import PageTabs from '../components/news-and-events/PageTabs';

const Events = () => {
    return (
        <div>
            <EventsHero data={eventsData.hero} />
            <PageTabs />
            <EventsGrid />
        </div>
    );
};

export default Events;