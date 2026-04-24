
import { useState, useRef, useEffect } from "react";
import siteData from "../../data/navigationData.json";
import { ChevronDown, Phone } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const { navbar } = siteData;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [hideDropdowns, setHideDropdowns] = useState(false);
  const navRef = useRef(null);

  const location = useLocation();

  // Hide dropdowns when pathname changes, then allow them to show again on next mouse interaction
  useEffect(() => {
    setHideDropdowns(true);
  }, [location.pathname]);

  // Reset hideDropdowns when mouse leaves the nav area
  const handleNavMouseLeave = () => {
    if (hideDropdowns) {
      setHideDropdowns(false);
    }
  };



  const isNavActive = (item) => {
    // direct match
    if (item.link && location.pathname === item.link) return true;

    // dropdown children match
    if (item.children) {
      return item.children.some((child) => {
        if (child.link && location.pathname === child.link) return true;

        // level 2
        if (child.children) {
          return child.children.some(
            (sub) => sub.link === location.pathname
          );
        }

        return false;
      });
    }

    return false;
  };


  return (
    <header className="bg-white relative z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to={navbar.logo.link} className="flex items-center gap-2">
          <img src={navbar.logo.src} alt={navbar.logo.alt} className="h-20" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-4" aria-label="Main navigation" ref={navRef} onMouseLeave={handleNavMouseLeave}>
          {navbar.items.map((item, i) => (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHideDropdowns(false)}
            >
              {/* Top Level */}
              <Link
                to={item.link || "#"}
                className={`font-semibold text-[15px] flex items-center gap-1 border-b-2 pb-1 transition-colors ${isNavActive(item)
                  ? "text-[#FF1033] border-none"
                  : "text-gray-800 border-transparent hover:text-[#FF1033] hover:border-[#FF1033]"
                  }`}
              >
                {item.label}
                {/* {item.children && <ChevronDown size={20} color="black" />} */}
              </Link>

              {/* Mega Menu - NOT rendered when hideDropdowns is true */}
              {item.children && !hideDropdowns && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2
               flex opacity-0 invisible group-hover:opacity-100
               group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200"
                >
                  {/* LEFT PANEL */}
                  <div className=" text-wrap bg-white rounded-xl w-max" >
                    {item.children.map((child, index) => (
                      <div key={index} className="group/item relative">
                        {child.link ? (
                          <Link
                            to={child.link}
                            className={`px-6 py-3 flex justify-between items-center cursor-pointer
                       hover:bg-gray-100 hover:text-[#FF1033] ${location.pathname === child.link ? "bg-gray-100 text-[#FF1033]" : ""
                              }`}
                          >
                            {child.label}
                            {child.children && <ChevronDown size={20} color="black" className="-rotate-90" />}
                          </Link>
                        ) : (
                          <div
                            className={`px-6 py-3 flex justify-between items-center cursor-pointer
                       hover:bg-gray-100 hover:text-[#FF1033] ${child.children?.some((sub) => sub.link === location.pathname) ? "bg-gray-100 text-[#FF1033]" : ""
                              }`}
                          >
                            {child.label}
                            {child.children && <ChevronDown size={20} color="black" className="-rotate-90" />}
                          </div>
                        )}

                        {/* RIGHT PANEL – ONLY APPEARS ON CHILD HOVER */}
                        {child.children && (
                          <div
                            className="absolute top-0 left-full w-fit text-nowrap h-[70vh] no-scrollbar overflow-y-auto
                         bg-white  rounded-xl
                         opacity-0 invisible
                         group-hover/item:opacity-100
                         group-hover/item:visible
                         transition-all duration-200 m-3"
                          >
                            <ul className="py-4 bg-white rounded-xl">
                              {child.children.map((sub, i) => (
                                <li key={i}>
                                  {sub.link ? (
                                    <Link
                                      to={sub.link}
                                      className={`block px-6 py-2 hover:bg-gray-50 hover:text-[#FF1033] ${location.pathname === sub.link ? "bg-gray-50 text-[#FF1033] font-semibold" : ""
                                        }`}
                                    >
                                      {sub.label}
                                    </Link>
                                  ) : (
                                    <span className="block px-6 py-2 hover:bg-gray-50 hover:text-[#FF1033]">
                                      {sub.label}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </nav>


        <div className="lg:hidden flex items-center gap-6">
          {/* Phone Number */}
          <div className="text-gray-600">
            <a href="tel:+919876543210" className="flex items-center gap-2">
              <img src="/assets/navbar/phone.png" alt="Phone" className="w-8 h-8" />
              {/* <Phone className="w-8 h-8 text-[#FF1033] bg-[#FF1033] bg-clip-text" /> */}
            </a>
          </div>


          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-3xl font-bold"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </div>


      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
          <nav aria-label="Mobile navigation" className="h-full w-[80vw] bg-[#252423] text-white overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setOpen(false)} className="text-2xl">
                ✕
              </button>
            </div>

            <div className="divide-y divide-white/10">
              {navbar.items.map((item, i) => (
                <MobileItem key={i} item={item} onClose={() => setOpen(false)} />
              ))}
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}


function MobileItem({ item, level = 0, onClose }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.link) {
      // Close mobile menu when navigating
      if (onClose) onClose();
    }
  };

  return (
    <div>
      {/* Item Row */}
      <div
        className={`flex justify-between items-center px-6 py-4 cursor-pointer ${level === 0 ? "text-white" : "text-gray-300"
          }`}
        onClick={handleClick}
      >
        {item.link ? (
          <Link to={item.link} className="block w-full" onClick={onClose}>
            {item.label}
          </Link>
        ) : (
          <span className="block w-full">
            {item.label}
          </span>
        )}

        {hasChildren && (
          <span className="ml-2 text-xl">
            {open ? "−" : "+"}
          </span>
        )}
      </div>

      {/* Children */}
      {open && hasChildren && (
        <div className="pl-4 bg-[#2f2e2d]">
          {item.children.map((child, i) => (
            <MobileItem key={i} item={child} level={level + 1} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}


export default Navbar;









// Mega Menu

// <div
//   className="absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[900px]
//      bg-white  xl rounded-xl flex overflow-hidden
//      opacity-0 invisible group-hover:opacity-100 group-hover:visible
//      transition-all duration-200"
// >
//   {/* Level 1 */}
//   <div className="w-1/2 border-r">
//     {item.children.map((child, cIndex) => (
//       <div
//         key={cIndex}
//         className="group/child px-6 py-3 cursor-pointer flex justify-between items-center
//            hover:bg-gray-100 hover:text-[#FF1033]"
//       >
//         <span>{child.label}</span>
//         {child.children && "›"}

//         {/* Level 2 */}
//         {child.children && (
//           <div
//             className="absolute right-0 top-0 h-full w-1/2 bg-gray-50
//                opacity-0 invisible group-hover/child:opacity-100
//                group-hover/child:visible transition-all"
//           >
//             <ul className="py-4">
//               {child.children.map((sub, sIndex) => (
//                 <li key={sIndex}>
//                   <a
//                     href={sub.link}
//                     className="block px-6 py-2 hover:bg-white hover:text-[#FF1033]"
//                   >
//                     {sub.label}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// </div>
// <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[900px]
// bg-white  xl rounded-xl flex overflow-hidden
// opacity-0 invisible group-hover:opacity-100 group-hover:visible
// transition-all duration-200">

//   {/* LEFT – Level 1 */}
//   <div className="w-1/2 border-r">
//     {item.children.map((child, index) => (
//       <div key={index} className="group/item">
//         <div
//           className="px-6 py-3 flex justify-between items-center cursor-pointer
//      hover:bg-gray-100 hover:text-[#FF1033]"
//         >
//           {child.label}
//           {child.children && "›"}
//         </div>

//         {/* RIGHT – Level 2 (FLOATING PANEL) */}
//         {child.children && (
//           <div
//             className="absolute top-0 right-0 w-1/2 h-full bg-gray-50
//        opacity-0 invisible
//        group-hover/item:opacity-100 group-hover/item:visible
//        transition-all duration-200"
//           >
//             <ul className="py-4">
//               {child.children.map((sub, i) => (
//                 <li key={i}>
//                   <a
//                     href={sub.link}
//                     className="block px-6 py-2 hover:bg-white hover:text-[#FF1033]"
//                   >
//                     {sub.label}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// </div>










// {/* Desktop Menu */}
// <nav className="hidden lg:flex gap-8">
// {navbar.items.map((item, i) => (
//   <div
//     key={i}
//     className="relative"
//     onMouseEnter={() => setActive(i)}
//     onMouseLeave={() => {
//       setActive(null);
//       setActiveChild(null);
//     }}
//   >
//     <a
//       href={item.link || "#"}
//       className="font-medium text-gray-800 hover:text-[#FF1033] flex items-center gap-1 border-b-2 border-white hover:border-b-2 hover:border-[#FF1033]"
//     >
//       {item.label}
//       {item.children && "▾"}
//     </a>

//     {/* Mega Menu */}
//     {item.children && active === i && (
//       <div className="absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[900px] bg-white  xl rounded-xl flex overflow-hidden">
//         {/* Level 1 */}
//         <div className="w-1/2 border-r">
//           {item.children.map((child, cIndex) => (
//             <div
//               key={cIndex}
//               onMouseEnter={() => setActiveChild(cIndex)}
//               className={`px-6 py-3 cursor-pointer flex justify-between items-center
//                 ${activeChild === cIndex
//                   ? "bg-gray-100 text-[#FF1033]"
//                   : "hover:bg-gray-50"
//                 }`}
//             >
//               <span>{child.label}</span>
//               {child.children && "›"}
//             </div>
//           ))}
//         </div>

//         {/* Level 2 */}
//         <div className="w-1/2 bg-gray-50">
//           {item.children[activeChild]?.children ? (
//             <ul className="py-4">
//               {item.children[activeChild].children.map(
//                 (sub, sIndex) => (
//                   <li key={sIndex}>
//                     <a
//                       href={sub.link}
//                       className="block px-6 py-2 hover:bg-white hover:text-[#FF1033]"
//                     >
//                       {sub.label}
//                     </a>
//                   </li>
//                 )
//               )}
//             </ul>
//           ) : (
//             <div className="p-6 text-gray-400">
//               Select a category
//             </div>
//           )}
//         </div>
//       </div>
//     )}
//   </div>
// ))}
// </nav>