import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfficialPartners } from "../../redux/slices/partnerSlice";
import { ArrowRight } from "lucide-react";
import LazyImage from "../reusable/LazyImage";
import { Link } from "react-router-dom";

const OurBusinesses = ({ data }) => {
    const dispatch = useDispatch();
    const { officialPartners } = useSelector((state) => state.partner);
    const backendApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        dispatch(fetchOfficialPartners());
    }, [dispatch]);

    const partnersToDisplay = officialPartners && officialPartners.length > 0 ? officialPartners : data.countries;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-20">

                {/* ===== HEADER ===== */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl  font-bold text-gray-900">
                        {data.title}
                    </h2>
                    {/* <div className="w-16 h-[3px] bg-[#FF1033] mx-auto my-4" /> */}
                    <p className="text-gray-600 font-medium">
                        {data.subtitle}
                    </p>
                </div>

                {/* ===== FLAGS ===== */}
                <div className="flex flex-wrap justify-evenly gap-5 mb-12">
                    {partnersToDisplay.map((country, i) => (
                        <div key={i} className="flex flex-col items-center gap-6">
                            <img
                                src={country.logo ? (country.logo.startsWith('http') ? country.logo : `${backendApiUrl}${country.logo}`) : country.flag}
                                alt={country.country || country.name}
                                className={`w-[128px] h-[128px] rounded-sm object-contain ${country.name === 'South Korea' ? 'border-[1px] h-[100px]' : ''}`}
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {country.country || country.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mb-20">
                    <Link
                        to={data.cta.link}
                        className="inline-block bg-[#FF1033] text-[#FFFDF5] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300 cursor-pointer"
                    >
                        {data.cta.text}
                    </Link>
                </div>

                {/* ===== BUSINESS CARDS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {data.cards.map((card, i) => (
                        <Link
                            key={i}
                            to={card.link}
                            className="group bg-white rounded-2xl  transition overflow-hidden"
                        >
                            {/* Image */}
                            <div className="h-44 overflow-hidden">
                                <LazyImage
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    {card.description}
                                </p>

                                <ArrowRight
                                    size={25}
                                    className="text-[#FF1033] group-hover:translate-x-1 transition ml-auto"
                                />
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default OurBusinesses;
