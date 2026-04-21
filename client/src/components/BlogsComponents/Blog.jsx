import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/slices/BlogsSlice";
import { Link, useSearchParams } from "react-router-dom";
import LazyImage from "../reusable/LazyImage";
import { ArrowUpRight } from "lucide-react";

export const Blog = ({ data: propData, className }) => {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!propData) {
      dispatch(fetchBlogs(page));
    }
  }, [dispatch, page, propData]);


  const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';
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
  const { Blogs: reduxData, loading, error, totalPages } = useSelector((state) => state.blog);

  // Use propData if available, otherwise use reduxData
  const data = propData || reduxData;

  // Button color variations
  const BUTTON_COLORS = [
    { bg: 'bg-[#FF1033]', hover: 'hover:bg-[#511313]', hoverText: 'hover:text-[#FF1033]' },
    { bg: 'bg-blue-600', hover: 'hover:bg-blue-900', hoverText: 'hover:text-blue-600' },
    { bg: 'bg-green-600', hover: 'hover:bg-green-900', hoverText: 'hover:text-green-600' },
    { bg: 'bg-purple-600', hover: 'hover:bg-purple-900', hoverText: 'hover:text-purple-600' },
    { bg: 'bg-orange-600', hover: 'hover:bg-orange-900', hoverText: 'hover:text-orange-600' },
    { bg: 'bg-pink-600', hover: 'hover:bg-pink-900', hoverText: 'hover:text-pink-600' },
  ];

  const getButtonColor = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
    return BUTTON_COLORS[hash % BUTTON_COLORS.length];
  };

  return (
    <div className=" mx-auto px-6 md:px-20 py-12">
      {loading && !propData && <div className="text-center">Loading...</div>}
      {error && !propData && <div className="text-center text-[#FF1033]">Error: {error}</div>}

      {/* Blog Grid - matching EventsGrid structure */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${className || 'lg:grid-cols-3'} gap-8`}>
        {data?.map((blog) => (
          <div
            key={blog._id}
            className="relative rounded-2xl overflow-hidden  none group"
          >
            {/* IMAGE */}
            <div className="h-[450px] relative">
              <LazyImage
                src={getImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full h-full object-cover"
                fill
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
            </div>

            {/* TOP RIGHT ARROW BUTTON */}
            <Link
              to={`/blog/${blog._id}`}
              aria-label="View blog details"
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white flex items-center justify-center  none hover:scale-105 transition z-10"
            >
              <ArrowUpRight size={24} className="text-[#FF1033]" />
            </Link>

            {/* CONTENT */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-0">
              {/* Category Badge */}
              {/* <span className="bg-[#FF1033] text-white text-xs px-3 py-1 rounded-full w-max mb-3 font-medium">
                {blog.category || "Tenant Verification"}
              </span> */}

              <Link
                to={`/blog/${blog._id}`}
                className={`bg-[#FF1033] text-[#FFFDF5] ${getButtonColor(blog._id).hover} ${getButtonColor(blog._id).hoverText} px-6 py-2 mb-4 rounded-full w-max font-bold transition-all duration-300 cursor-pointer`}
              >
                View More
              </Link>

              <h3 className="font-semibold text-lg leading-snug mb-0 line-clamp-2">
                {blog.title}
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
