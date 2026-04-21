import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../redux/slices/newsSlice';
import { fetchOfficialPartners } from '../redux/slices/partnerSlice';
import data from '../data/governmentEmbassies.json'
import GovernmentEmbHero from '../components/government-embassies/GovernmentEmbHero'
import WhoWeAre from '../components/reusable/WhoWeAre'
import Timeline from "../components/reusable/Timeline";
import NewsHome from '../components/reusable/NewsHome';
import { Link } from 'react-router-dom';
import OurStrengths from '../components/reusable/OurStrengths';
import ConnectWithUs from '../components/reusable/ConnectWithUs';
import OurFootprints from '../components/home/OurFootprints';
import SEO from '../components/reusable/SEO';

const ForGovernmentEmbassies = () => {
    const dispatch = useDispatch();
    const { news } = useSelector((state) => state.news);
    const { officialPartners, loadingOfficialPartners } = useSelector((state) => state.partner);

    // useEffect(() => {
    //     dispatch(fetchNews());
    //     dispatch(fetchOfficialPartners());
    // }, [dispatch]);
    useEffect(() => {
        dispatch(fetchNews());

        if (!officialPartners.length) {
            dispatch(fetchOfficialPartners());
        }
    }, [dispatch, officialPartners.length]);


    const sortedPartners = [...officialPartners].sort(
        (a, b) => Number(a.year) - Number(b.year)
    );

    return (
        <div>
               <SEO />
            <GovernmentEmbHero data={data.hero} />
            <WhoWeAre data={data.whoWeAre} />
            <Timeline data={sortedPartners} />

            {/* NEWS SECTION */}
            <div className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">News and Media</h2>
                </div>
                <NewsHome data={news.slice(0, 3)} />
                <Link to="/news-and-media" className="block text-center">
                    <button className="px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] cursor-pointer">
                        View All News
                    </button>
                </Link>
            </div>

            <OurStrengths data={data.strengths} image={data.hero.backgroundImage} />
            <OurFootprints data={data.footprints} />
            <ConnectWithUs data={data.connect} />

        </div>
    )
}

export default ForGovernmentEmbassies