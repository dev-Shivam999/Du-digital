import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter
} from "react-icons/fa6";
import footerData from "../../data/footerData.json";

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  x: FaXTwitter
};

export default function Footer() {
  const { logo, links, newsletter, socials, payments } = footerData;

  return (
    <footer className="bg-[#b10e2a] text-white">
      {/* #AC0826 */}
      {/* max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-16 flex flex-col md:flex-row justify-between gap-12 */}
      {/* max-w-7xl mx-auto px-6 md:px-20 lg:px-0 py-16 flex flex-col lg:flex-row justify-between gap-12 */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-16 flex flex-col lg:flex-row justify-between gap-12">

        {/* LOGO */}
        <div>
          <img src={logo.src} alt={logo.alt} className="w-40 mb-6" />
        </div>

        {/* LINKS */}
        <div>
          <ul className="space-y-2 text-sm">
            {links.items.map((item, i) => (
              <li key={i}>
                <Link to={item.url} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <p className="mb-4 text-sm max-w-xs">
            Subscribe to our newsletter to stay in touch with the latest.
          </p>

          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full text-sm rounded-full px-5 py-2 bg-[#FFFDF5] text-[#b10e2a] outline-none"
            aria-label="Your Email Address"
          />
        </div>

        {/* SOCIALS + PAYMENTS */}
        <div>
          <p className="mb-3 text-sm">Follow us here:</p>
          <div className="flex gap-3 mb-6">
            {socials.items.map((item, i) => {
              const Icon = socialIcons[item.name];
              return (
                <Link
                  key={i}
                  to={item.url}
                  target="_blank"
                  className="w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#b10e2a] transition"
                >
                  <Icon size={14} />
                </Link>
              );
            })}
          </div>

          <p className="mb-2 text-sm">We Accept</p>
          <img src={payments.image} alt="Payments" className="w-36" />
        </div>

      </div>
    </footer>
  );
}











// import { Link } from "react-router-dom";
// import footerData from "../../data/footerData.json";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaYoutube,
//   FaLinkedinIn,
//   FaXTwitter
// } from "react-icons/fa6";

// const socialIcons = {
//   facebook: FaFacebookF,
//   instagram: FaInstagram,
//   youtube: FaYoutube,
//   linkedin: FaLinkedinIn,
//   x: FaXTwitter
// };

// export default function Footer() {
//   const {
//     logo,
//     newsletter,
//     socials,
//     payments,
//     links,
//     contact
//   } = footerData;

//   return (
//     <footer className="bg-gradient-to-br from-black via-[#1a0f0f] to-black text-white py-16 md:px-8">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

//         {/* LEFT */}
//         <div>
//           <img src={logo.src} alt={logo.alt} className="w-48 mb-6" />

//           <p className="font-semibold mb-4">{newsletter.text}</p>

//           <div className="flex items-center border border-white/40 rounded-full overflow-hidden max-w-md">
//             <input
//               type="email"
//               placeholder={newsletter.placeholder}
//               className="flex-1 bg-transparent px-4 py-3 outline-none text-sm"
//             />
//             <button className="p-1 bg-white rounded-full mr-2">
//               <img src={newsletter.submitIcon} alt="submit" className="w-5" />
//             </button>
//           </div>

//           <div className="flex max-sm:flex-col justify-between">
//             <div className="mt-6">
//               <p className="mb-3">{socials.title}</p>
//               <div className="flex gap-2">
//                 {socials.items.map((item, i) => {
//                   const Icon = socialIcons[item.name];
//                   return (
//                     <Link
//                       key={i}
//                       to={item.url}
//                       target="_blank"
//                       className="w-7 h-7 border border-white/50 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
//                     >
//                       <Icon />
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="mt-6">
//               <p className="mb-2">{payments.title}</p>
//               <img src={payments.image} alt="payments" className="w-30" />
//             </div>
//           </div>
//         </div>

//         {/* LINKS */}
//         <div>
//           <h3 className="text-xl font-semibold mb-6">{links.title}</h3>
//           <ul className="space-y-3">
//             {links.items.map((link, i) => (
//               <li key={i}>
//                 <Link to={link.url} className="hover:underline">
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* CONTACT */}
//         <div>
//           <h3 className="text-xl font-semibold mb-6">{contact.title}</h3>

//           <div className="space-y-4 text-sm leading-relaxed">
//             {contact.offices.map((office, i) => (
//               <div key={i}>
//                 {office.city && <p className="font-bold">{office.city}</p>}
//                 {office.type && (
//                   <p>
//                     <strong>{office.type}:</strong> {office.address}
//                   </p>
//                 )}
//                 {!office.type && office.address && <p>{office.address}</p>}
//                 {office.phone && (
//                   <p>
//                     <strong>Phone:</strong> {office.phone}
//                   </p>
//                 )}
//                 {office.email && (
//                   <p>
//                     <strong>Email:</strong> {office.email}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }















// import { Link } from "react-router-dom";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaYoutube,
//   FaLinkedinIn,
//   FaXTwitter
// } from "react-icons/fa6";
// import footerData from "../../data/footerData.json";

// const socialIcons = {
//   facebook: FaFacebookF,
//   instagram: FaInstagram,
//   youtube: FaYoutube,
//   linkedin: FaLinkedinIn,
//   x: FaXTwitter
// };

// export default function Footer() {
//   const { logo, links, newsletter, socials, payments } = footerData;

//   return (
//     <footer className="bg-[#b10e2a] text-white">
//       {/* #AC0826 */}
//       <div className="w-full mx-auto px-6 md:px-[8vw]  py-16  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-10">

//         {/* LOGO */}
//         <div>
//           <img src={logo.src} alt={logo.alt} className="w-40 mb-6" />
//         </div>

//         {/* LINKS */}
//         <div>
//           <ul className="space-y-2 text-sm">
//             {links.items.map((item, i) => (
//               <li key={i}>
//                 <Link to={item.url} className="hover:underline">
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* NEWSLETTER */}
//         <div>
//           <p className="mb-4 text-sm max-w-xs">
//             Subscribe to our newsletter to stay in touch with the latest.
//           </p>

//           <input
//             type="email"
//             placeholder="Your Email Address"
//             className="w-full text-sm rounded-full px-5 py-2 bg-[#FFFDF5] text-[#b10e2a] outline-none"
//             aria-label="Your Email Address"
//           />
//         </div>

//         {/* SOCIALS + PAYMENTS */}
//         <div>
//           <p className="mb-3 text-sm">Follow us here:</p>
//           <div className="flex gap-3 mb-6">
//             {socials.items.map((item, i) => {
//               const Icon = socialIcons[item.name];
//               return (
//                 <Link
//                   key={i}
//                   to={item.url}
//                   target="_blank"
//                   className="w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#b10e2a] transition"
//                 >
//                   <Icon size={14} />
//                 </Link>
//               );
//             })}
//           </div>

//           <p className="mb-2 text-sm">We Accept</p>
//           <img src={payments.image} alt="Payments" className="w-36" />
//         </div>

//       </div>
//     </footer>
//   );
// }











// import { Link } from "react-router-dom";
// import footerData from "../../data/footerData.json";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaYoutube,
//   FaLinkedinIn,
//   FaXTwitter
// } from "react-icons/fa6";

// const socialIcons = {
//   facebook: FaFacebookF,
//   instagram: FaInstagram,
//   youtube: FaYoutube,
//   linkedin: FaLinkedinIn,
//   x: FaXTwitter
// };

// export default function Footer() {
//   const {
//     logo,
//     newsletter,
//     socials,
//     payments,
//     links,
//     contact
//   } = footerData;

//   return (
//     <footer className="bg-gradient-to-br from-black via-[#1a0f0f] to-black text-white py-16 md:px-8">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

//         {/* LEFT */}
//         <div>
//           <img src={logo.src} alt={logo.alt} className="w-48 mb-6" />

//           <p className="font-semibold mb-4">{newsletter.text}</p>

//           <div className="flex items-center border border-white/40 rounded-full overflow-hidden max-w-md">
//             <input
//               type="email"
//               placeholder={newsletter.placeholder}
//               className="flex-1 bg-transparent px-4 py-3 outline-none text-sm"
//             />
//             <button className="p-1 bg-white rounded-full mr-2">
//               <img src={newsletter.submitIcon} alt="submit" className="w-5" />
//             </button>
//           </div>

//           <div className="flex max-sm:flex-col justify-between">
//             <div className="mt-6">
//               <p className="mb-3">{socials.title}</p>
//               <div className="flex gap-2">
//                 {socials.items.map((item, i) => {
//                   const Icon = socialIcons[item.name];
//                   return (
//                     <Link
//                       key={i}
//                       to={item.url}
//                       target="_blank"
//                       className="w-7 h-7 border border-white/50 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition"
//                     >
//                       <Icon />
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="mt-6">
//               <p className="mb-2">{payments.title}</p>
//               <img src={payments.image} alt="payments" className="w-30" />
//             </div>
//           </div>
//         </div>

//         {/* LINKS */}
//         <div>
//           <h3 className="text-xl font-semibold mb-6">{links.title}</h3>
//           <ul className="space-y-3">
//             {links.items.map((link, i) => (
//               <li key={i}>
//                 <Link to={link.url} className="hover:underline">
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* CONTACT */}
//         <div>
//           <h3 className="text-xl font-semibold mb-6">{contact.title}</h3>

//           <div className="space-y-4 text-sm leading-relaxed">
//             {contact.offices.map((office, i) => (
//               <div key={i}>
//                 {office.city && <p className="font-bold">{office.city}</p>}
//                 {office.type && (
//                   <p>
//                     <strong>{office.type}:</strong> {office.address}
//                   </p>
//                 )}
//                 {!office.type && office.address && <p>{office.address}</p>}
//                 {office.phone && (
//                   <p>
//                     <strong>Phone:</strong> {office.phone}
//                   </p>
//                 )}
//                 {office.email && (
//                   <p>
//                     <strong>Email:</strong> {office.email}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
