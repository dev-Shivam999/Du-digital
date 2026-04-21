import homeData from "../data/homeData.json";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventsSlice';
import { fetchNews } from '../redux/slices/newsSlice';
import { fetchBlogs } from '../redux/slices/BlogsSlice';
import EventsGrid from '../components/news-and-events/EventsGrid';
import NewsHome from '../components/reusable/NewsHome';
import { Blog } from '../components/BlogsComponents/Blog';
import HomeSlider from "../components/home/HomeSlider";
import VisaServices from "../components/home/VisaServices";
import HomeAboutSection from "../components/home/HomeAboutSection";
import OurFootprints from "../components/home/OurFootprints";
import Testimonials from "../components/home/Testimonials";
import IsoCertificates from "../components/home/IsoCertificates";
import { Link } from "react-router-dom";
import OurBusinesses from "../components/home/OurBusinesses";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import WhyUsSection from "../components/reusable/WhyUsSection";
import SEO from "../components/reusable/SEO";

const Home = () => {
    const dispatch = useDispatch();
    const { events } = useSelector((state) => state.events);
    const { news } = useSelector((state) => state.news);
    const { Blogs: blogs } = useSelector((state) => state.blog);

    // Refs for lazy loading
    const [blogsRef, blogsVisible] = useIntersectionObserver({ triggerOnce: true, rootMargin: '500px' });
    const [newsRef, newsVisible] = useIntersectionObserver({ triggerOnce: true, rootMargin: '500px' });
    const [eventsRef, eventsVisible] = useIntersectionObserver({ triggerOnce: true, rootMargin: '500px' });

    // Fetch Blogs when section is visible
    useEffect(() => {
        if (blogsVisible && blogs.length === 0) {
            dispatch(fetchBlogs({ page: 1, limit: 3 }));
        }
    }, [blogsVisible, dispatch, blogs.length]);

    // Fetch News when section is visible
    useEffect(() => {
        if (newsVisible && news.length === 0) {
            dispatch(fetchNews({ limit: 3 }));
        }
    }, [newsVisible, dispatch, news.length]);

    // Fetch Events when section is visible
    useEffect(() => {
        if (eventsVisible && events.length === 0) {
            dispatch(fetchEvents({ limit: 6 }));
        }
    }, [eventsVisible, dispatch, events.length]);
    return (
        <div className="relative">
            <SEO />

            {/* HERO SLIDER */}
            <HomeSlider data={homeData.slider} />

            {/* VISA SERVICES (OVERLAP) */}
            <div className="-mt-62 relative z-20">
                <VisaServices data={homeData.visaServiceSection} />
            </div>

            <OurBusinesses data={homeData.ourBusinessesSection} />

            <HomeAboutSection data={homeData.aboutSection} />



            <OurFootprints data={homeData.ourFootprintsSection} />
            <Testimonials data={homeData.testimonials} />
            <IsoCertificates data={homeData.certificationsSection} />
            <WhyUsSection data={homeData.whyUsSection} />

            {/* BLOGS SECTION */}
            <div ref={blogsRef} className="py-10 bg-gray-50  max-w-7xl mx-auto min-h-[500px]">
                <div className="max-w-[90%] mx-auto px-6  flex justify-between  items-center  mb-1 text-start">
                    <h2 className="text-4xl font-bold text-gray-900"> Blogs</h2>
                    <Link to="/blogs" className="block text-center pt-4" aria-label="View All Blogs">
                        <span className="inline-block px-8  rounded-full  text-md py-2 transition-all duration-300 border-1 border-[#FF1033] text-[#FF1033]  cursor-pointer">
                            Browse All Blogs
                        </span>
                    </Link>

                </div>
                {blogs.length > 0 && (
                    <Blog data={blogs.slice(0, 3)} className="lg:grid-cols-3" />
                )}
                {/* <Link to="/blogs" className="block text-center pt-2" aria-label="View All Blogs">
                    <span className="inline-block px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] cursor-pointer">
                        View All Blogs
                    </span>
                </Link> */}
            </div>

            {/* NEWS SECTION */}
            <div ref={newsRef} className="py-10 bg-white min-h-[500px]">
                <div className="max-w-7xl mx-auto px-6 md:px-20 mb-2 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">News Coverage</h2>
                </div>
                {news.length > 0 && (
                    <NewsHome data={news.slice(0, 3)} />
                )}
                <Link to="/news-and-media" className="block text-center pt-4" aria-label="View All News">
                    <span className="inline-block px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] cursor-pointer">
                        View All News
                    </span>
                </Link>
            </div>



            {/* EVENTS SECTION */}
            <div ref={eventsRef} className="py-10 bg-gray-50 min-h-[500px]">
                <div className="max-w-7xl mx-auto px-6 md:px-20 mb-2 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Latest Updates & Events</h2>
                </div>
                {events.length > 0 && (
                    <EventsGrid data={events.slice(0, 6)} />
                )}
                <Link to="/events" className="block text-center pt-4" aria-label="View All Events">
                    <span className="inline-block px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] cursor-pointer">
                        View All Events
                    </span>
                </Link>
            </div>

        </div >
    );
};

export default Home;
