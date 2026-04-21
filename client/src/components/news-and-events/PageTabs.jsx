import { NavLink } from "react-router-dom";

const PageTabs = () => {
    const base =
        "md:px-10 px-6 md:py-3 py-2 rounded-full font-semibold transition  ";

    return (
        <div className="flex justify-center gap-6 my-12 md:my-16">
            <NavLink
                to="/news-and-media"
                className={({ isActive }) =>
                    `${base} ${isActive
                        ? "bg-[#FF1033] text-[#FFFDF5]"
                        : "bg-white text-black"
                    }`
                }
            >
                NEWS COVERAGE
            </NavLink>

            <NavLink
                to="/events"
                className={({ isActive }) =>
                    `${base} ${isActive
                        ? "bg-[#FF1033] text-[#FFFDF5]"
                        : "bg-white text-black"
                    }`
                }
            >
                EVENTS
            </NavLink>
        </div>
    );
};

export default PageTabs;
