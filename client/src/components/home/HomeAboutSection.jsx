const HomeAboutSection = ({ data }) => {
    return (

        <section className="relative py-24 px-6 md:px-20 bg-[#FFFDF5] overflow-hidden">

            {/* ✅ ABSOLUTE BACKGROUND SHAPE */}
            <img
                src="/assets/home/about/about-bg-shape.png"
                alt=""
                className="
          absolute 
          inset-0
          w-full
          h-full
          object-cover
          pointer-events-none
          z-0
        "
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-[#FFFDF5]/50 z-[15]" /> */}

            <div className="relative max-w-7xl mx-auto h-[300px] grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT CONTENT */}
                <div>
                    <h2 className="text-[48px]  font-[450px] text-[#000000] leading-12  mb-10 whitespace-pre-line">
                        {data.title}
                    </h2>

                    <p className="text-[#000000] max-sm:w-full w-[90%] text-[17px]  leading-normal">
                        {data.description}
                    </p>
                </div>

                {/* RIGHT VIDEO */}
                <div className="relative mx-auto md:w-[85%] h-full rounded-xl overflow-hidden bg-black aspect-video">
                    <iframe
                        src={data.video.embedUrl}
                        title="DU Digital Global"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

            </div>
        </section>




    );
};

export default HomeAboutSection;



// const HomeAboutSection = ({ data }) => {
//     return (
//         <section className="py-24 bg-[#FFF8ED] relative overflow-hidden">

//             {/* Decorative Shapes */}
//             <div className="absolute inset-0 pointer-events-none">
//                 {/* <div className="absolute top-10 left-1/3 w-64 h-64 bg-[#FFE4C7] rotate-45" /> */}
//                 {/* <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#FFE4C7] rotate-45" /> */}
//                 <img src="/assets/home/about/about-bg-shape.png" alt="bg-image" />
//             </div>

//             <div className="relative max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2 gap-16 items-center">

//                 {/* LEFT CONTENT */}
//                 <div>
//                      <h2 className="text-4xl   font-semibold leading-tight mb-6 whitespace-pre-line">
//                         {data.title}
//                     </h2>

//                     <p className="text-gray-700 leading-relaxed max-w-xl">
//                         {data.description}
//                     </p>
//                 </div>

//                 {/* RIGHT VIDEO */}
//                 <div className="relative rounded-xl overflow-hidden  xl bg-black aspect-video">
//                     <iframe
//                         src={data.video.embedUrl}
//                         title="DU Digital Global"
//                         className="w-full h-full"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                     />
//                 </div>

//             </div>
//         </section>
//     );
// };



// export default HomeAboutSection;
