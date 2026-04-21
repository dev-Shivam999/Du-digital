import { FaPercentage, FaHandshake, FaRegCheckCircle } from "react-icons/fa";

const iconMap = {
  rates: FaPercentage,
  guidance: FaHandshake,
  fast: FaRegCheckCircle,
};

const WhyDuGlobal = ({ data }) => {
  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-4xl  font-bold text-center mb-6 text-gray-900">
          {data.title}
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, index) => {
            const Icon = iconMap[item.icon];

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-8  transition"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#FFE7EA] mb-6">
                  <Icon className="text-[#FF1033] text-xl" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.text}
                </h3>

                {/* Description (optional – matches reference) */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  We ensure reliable, transparent, and efficient processes
                  tailored to your needs.
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyDuGlobal;











// import { FaPercentage, FaHandshake, FaRegCheckCircle } from "react-icons/fa";

// const iconMap = {
//   rates: FaPercentage,
//   guidance: FaHandshake,
//   fast: FaRegCheckCircle
// };

// const WhyDuGlobal = ({ data }) => {
//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Heading */}
//          <h2 className="text-4xl  font-bold text-center mb-16">
//           {data.title}
//         </h2>

//         {/* Cards */}
//         <div className="grid md:grid-cols-3 gap-8">
//           {data.items.map((item, index) => {
//             const Icon = iconMap[item.icon];

//             return (
//               <div
//                 key={index}
//                 className="border-2 border-[#FF1033] rounded-2xl p-10 flex items-center gap-6"
//               >
//                 <Icon className="text-[#FF1033] text-4xl shrink-0" />
//                 <p className="text-2xl font-semibold text-[#FF1033]">
//                   {item.text}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyDuGlobal;
