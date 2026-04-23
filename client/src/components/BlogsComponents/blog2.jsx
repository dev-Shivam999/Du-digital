import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/BlogsSlice";
import { Link, useSearchParams } from "react-router-dom";

const COLORS = [
    "bg-yellow-400",
    "bg-green-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-pink-500",
];

// Stable color based on blog id
const getColorFromId = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash += id.charCodeAt(i);
    }
    return COLORS[hash % COLORS.length];
};
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';
const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Handle /api/ paths - use BackendURL directly
    if (imagePath.startsWith('/api/')) {
        return `${BackendURL}${imagePath}`;
    }
    // Handle /uploads/ paths
    if (imagePath.startsWith('/uploads/')) {
        return `${BackendURL}/api${imagePath}`;
    }
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export const Blog = ({ data: propData, className }) => {
    const dispatch = useDispatch();
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


    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        if (!propData) {
            // Skip fetch if SSR already preloaded the data
            if (!reduxData || reduxData.length === 0) {
                dispatch(fetchBlogs(page));
            }
        }
    }, [dispatch, page, propData]);

    const { Blogs: reduxData, loading, error, totalPages } = useSelector((state) => state.blog);

    // Use propData if available, otherwise use reduxData
    const data = propData || reduxData;

    return (
        <div className="w-full my-5 container mx-auto mt-10">
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${className || 'md:grid-cols-4'} gap-6 justify-items-center`}>
                {loading ? <div>Loading...</div> : error && <div>error</div>}
                {data.length === 0 ? (
                    <div>No Blog Found</div>
                ) : (
                    data.map((blog) => {
                        const color = getColorFromId(blog._id);

                        return (
                            <div
                                key={blog._id}
                                className="w-full max-w-sm h-[380px] rounded-2xl overflow-hidden  bg-white flex flex-col">
                                {/* Image */}
                                <img
                                    src={getImageUrl(blog.featuredImage)}
                                    alt={blog.title}
                                    className="h-40 w-full object-cover"
                                />

                                {/* Content */}
                                <div className="p-4 space-y-2 grow">
                                    <h3 className="text-lg font-semibold leading-snug line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 my-2 line-clamp-3">
                                        {blog.tags}
                                    </p>
                                </div>

                                {/* Button */}
                                <Link
                                    to={`/blog/${blog._id}`}
                                    className={`w-full py-3 px-5 font-bold ${getButtonColor(blog._id).bg} ${getButtonColor(blog._id).hover} transition-all duration-300 text-start`}>
                                    Read More
                                </Link>
                            </div>
                        );
                    })
                )}
            </div>
            {
                !propData && totalPages > 1 && <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link
                            to={`?page=${page}`}
                            className={`px-4 py-2 text-start rounded-md ${searchParams.get("page") == page
                                ? "bg-[#FF1033] text-[#FFFDF5]"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {page}
                        </Link>
                    ))}


                </div>
            }
        </div>
    );
};