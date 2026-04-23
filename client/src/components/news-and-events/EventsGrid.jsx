import { ArrowUpRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchEvents } from '../../redux/slices/eventsSlice';
import LazyImage from '../reusable/LazyImage';

const EventsGrid = ({ data: propData }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const { events: reduxData, totalPages, loading, error } = useSelector((state) => state.events);
    const data = propData || reduxData;

    // console.log("propData", propData)
    // console.log("reduxData", reduxData)


    useEffect(() => {
        // Skip fetch if SSR already preloaded the data
        if (!propData && (!reduxData || reduxData.length === 0)) {
            dispatch(fetchEvents({ page }));
        }
    }, [dispatch, page, propData]);

    const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

    // Button color variations
    const BUTTON_COLORS = [
        // { bg: 'bg-blue-600', hover: 'hover:bg-blue-900', hoverText: 'hover:text-blue-600' },
        { bg: 'bg-[#3DADFF]', hover: 'hover:bg-[#3DADFFAA]', hoverText: 'hover:text-[#3DADFF]' },
        { bg: 'bg-[#00AB63]', hover: 'hover:bg-[#00AB63AA]', hoverText: 'hover:text-[#00AB63]' },
        { bg: 'bg-[#CDF4D3]', hover: 'hover:bg-[#CDF4D3AA]', hoverText: 'hover:text-[#CDF4D3]' },
        { bg: 'bg-[#FF1033]', hover: 'hover:bg-[#511313AA]', hoverText: 'hover:text-[#FF1033]' },
        { bg: 'bg-[#FFD071]', hover: 'hover:bg-[#FFD071AA]', hoverText: 'hover:text-[#FFD071]' },
    ];

    const getButtonColor = (id) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash += id.charCodeAt(i);
        }
        return BUTTON_COLORS[hash % BUTTON_COLORS.length];
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
            {loading && !propData && <div className="text-center">Loading...</div>}
            {error && !propData && <div className="text-center text-[#FF1033]">Error: {error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.map((event) => (
                    <div
                        key={event._id}
                        className="relative rounded-2xl overflow-hidden  none group"
                    // onClick={() => navigate(`/events/${event._id}`)}
                    >
                        {/* IMAGE */}
                        <div className="h-[420px] relative">
                            {event.imageUrl ? (
                                <LazyImage
                                    src={`${BackendImagesURL}${event.imageUrl}`}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    fill
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300" />
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
                        </div>

                        {/* TOP RIGHT ARROW BUTTON */}
                        {/* <button
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white flex items-center justify-center  md hover:scale-105 transition"
                    >
                        <span className="text-xl font-bold text-[#FF1033]">↗</span>
                    </button> */}

                        <Link to={`/events/${event._id}`} aria-label="View event details" className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white flex items-center justify-center  md hover:scale-105 transition z-10">
                            <ArrowUpRight size={24} className="text-[#FF1033] " />
                        </Link>

                        {/* CONTENT */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-0">
                            {/* Category Badge */}
                            {/* <span className="bg-[#FF1033] text-white text-xs px-3 py-1 rounded-full w-max mb-3 font-medium">
                                {event.category}
                            </span> */}

                            <Link to={`/events/${event._id}`} className={`${getButtonColor(event._id).bg} text-[#FFFDF5] px-6 py-2 mb-4 rounded-full w-max font-bold ${getButtonColor(event._id).hover} ${getButtonColor(event._id).hoverText} transition-all duration-300 cursor-pointer`}>
                                View More
                            </Link>

                            <h3 className="font-semibold text-lg leading-snug mb-0 line-clamp-2">
                                {event.title}
                            </h3>
                        </div>
                    </div>


                ))}
            </div>

            {/* Pagination Controls */}
            {!propData && totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            to={`?page=${p}`}
                            className={`px-4 py-2 rounded-md transition-colors duration-300 ${page === p
                                ? "bg-[#FF1033] text-[#FFFDF5]"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsGrid;




// {/* <div
//     key={event._id}
//     className="relative h-[460px] rounded-[32px] overflow-hidden group  xl cursor-pointer"
// >
//     {/* IMAGE */}
//     {event.imageUrl ? (
//         <img
//             src={`${BackendImagesURL}${event.imageUrl}`}
//             alt={event.title}
//             className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//     ) : (
//         <div className="absolute inset-0 bg-gray-300" />
//     )}

//     {/* GRADIENT OVERLAY */}
//     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//     {/* TOP LEFT BADGE */}
//     <span
//         className={`absolute top-5 left-5 px-4 py-1.5 text-sm font-semibold text-white rounded-full ${getCategoryColor(
//             event.category
//         )}`}
//     >
//         {event.category}
//     </span>

//     {/* TOP RIGHT ARROW BUTTON */}
//     <button
//         onClick={() => navigate(`/events/${event._id}`)}
//         className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white flex items-center justify-center  md hover:scale-105 transition"
//     >
//         <span className="text-xl font-bold text-[#FF1033]">↗</span>
//     </button>

//     {/* BOTTOM CONTENT */}
//     <div className="absolute bottom-0 p-6 text-white">
//         <h3 className="text-2xl font-bold leading-snug max-w-[90%]">
//             {event.title}
//         </h3>
//     </div>
// </div> */}
