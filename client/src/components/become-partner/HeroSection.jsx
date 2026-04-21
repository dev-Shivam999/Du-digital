import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountryPhoneInput from "./CountryPhoneInput";
import { submitPartnerForm, clearPartnerState, dataFill } from "../../redux/slices/partnerSlice";

const LOOKING_FOR_OPTIONS = [
  "Travel Agent - Becoming a Partner",
  "Traveler - I am looking for a Visa to Travel"
];

const CITY_OPTIONS = ["Bangalore", "Chandigarh", "Chennai", "Delhi NCR", "Jammu & Kashmir", "Kolkata", "Mumbai", "Other"];

const HeroSection = ({ data }) => {
  const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const dispatch = useDispatch();
  const { loading, error, success,successMsg } = useSelector((state) => state.partner);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: null,
    lookingFor: "",
    businessName: "",
    destinationCountry: "",
    city: "",
    otherCity: "",
    isMsg: false,
    otp:""
  });

  useEffect(() => {
    return () => {
      dispatch(clearPartnerState());
    };
  }, [dispatch]);

  const handlePhoneChange = (payload) => {
    setFormData((prev) => ({ ...prev, phone: payload }));
  };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //     ...(name === "lookingFor" && {
  //       businessName: "",
  //       destinationCountry: "",
  //     }),
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,

      ...(name === "lookingFor" && {
        businessName: "",
        destinationCountry: "",
      }),

      ...(name === "city" && value !== "Other" && {
        otherCity: "",
      }),
    }));
  };


const [otpSent, setOtpSent] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearPartnerState());

    // const payload = {
    //   fullName: formData.fullName,
    //   email: formData.email,
    //   phone: formData.phone?.fullNumber || "",
    //   lookingFor: formData.lookingFor,
    //   city: formData.city,
    //   isMsg: formData.isMsg,
    //   ...(formData.lookingFor.includes("Partner") && {
    //     businessName: formData.businessName,
    //   }),
    //   ...(formData.lookingFor.includes("Traveler") && {
    //     destinationCountry: formData.destinationCountry,
    //   }),
    // };

    const payload = {
      Last_Name: formData.fullName,
      Email: formData.email,
      Phone: formData.phone?.fullNumber || "",
      Looking_For: formData.lookingFor,
      City: formData.city,
      Remarks: formData.isMsg,
      ...(formData.lookingFor.includes("Partner") &&  formData.businessName&&{
        Business_Name: formData.businessName,
      }),
        ...(formData.lookingFor.includes("Traveler") &&  formData.destinationCountry&&{
        Country: formData.destinationCountry,
      }),
      otp:formData.otp
    };


 if(otpSent){
  console.log("payload",payload);
  
   const result = await dispatch(submitPartnerForm(payload));

    if (submitPartnerForm.fulfilled.match(result)) {
      setFormData({
        fullName: "",
        email: "",
        phone: null,
        lookingFor: "",
        businessName: "",
        destinationCountry: "",
        city: "",
        isMsg: false,
        otp:""
      });
      
setOtpSent(false);
    }}
    else{
      const data =       await fetch(`${BackendURL}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({mobile:formData.phone?.fullNumber|| ''}),
        });
        const res = await data.json();
       if(res.success){
        dispatch(dataFill({data:{success:true,error:null,msg:'Thank you! submit the 6 digit otp'}}))
         
          alert('submit the 6 digit otp');
          setOtpSent(true);
       }else{
        dispatch(dataFill({data:{success:false,error:'invaild number',msg:'invaild number'}}))
       }
        
      }
    }
  

  return (
    <section className="relative min-h-[800px] ">
      <img
        src={data.backgroundImage}
        alt={data.title || "Partner Hero"}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"

      />
      <div className="absolute inset-0 bg-[#b21a1a3d]" />

      <div className="relative max-w-6xl mx-auto  p-2 md:px-4 py-20 grid lg:grid-cols-2 gap-16 items-center place-items-center">
        {/* LEFT CONTENT */}
        <div>
          <h1
            className="text-4xl text-white lg:text-5xl font-bold mb-8"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />

          <ul className="space-y-4 text-white">
            {data.points.map((p, i) => (
              <li key={i} className="text-lg font-semibold">• {p}</li>
            ))}
          </ul>
        </div>

        {/* FORM */}
        <div className="bg-white  max-w-md lg:ml-auto rounded-lg p-3 md:p-6 ">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Name"
              className="w-full border px-4 py-3 rounded-md"
              value={formData.fullName}
              onChange={handleChange}
              required
              aria-label="Name"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full border px-4 py-3 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Email Address"
            />

            <CountryPhoneInput onChange={handlePhoneChange} />

            {/* LOOKING FOR */}
            <select
              name="lookingFor"
              className="w-full border px-4 py-3 rounded-md"
              value={formData.lookingFor}
              onChange={handleChange}
              required
              aria-label="What are you looking for?"
            >
              <option value="">What are you looking for?</option>
              {LOOKING_FOR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            {/* CONDITIONAL FIELD: BUSINESS NAME */}
            {formData.lookingFor.includes("Partner") && (
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                className="w-full border px-4 py-3 rounded-md"
                value={formData.businessName}
                onChange={handleChange}
                required
                aria-label="Business Name"
              />
            )}

            {/* CONDITIONAL FIELD: DESTINATION COUNTRY */}
            {formData.lookingFor.includes("Traveler") && (
              <input
                type="text"
                name="destinationCountry"
                placeholder="Destination country?"
                className="w-full border px-4 py-3 rounded-md"
                value={formData.destinationCountry}
                onChange={handleChange}
                required
                aria-label="Destination country"
              />
            )}


            {/* CITY */}
            <select
              name="city"
              className="w-full border px-4 py-3 rounded-md"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Location (City)</option>
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* OTHER CITY INPUT */}
            {formData.city === "Other" && (
              <input
                type="text"
                name="otherCity"
                placeholder="Enter your city"
                className="w-full border px-4 py-3 rounded-md"
                value={formData.otherCity}
                onChange={handleChange}
                required
              />
            )}


            {/* CONSENT */}
            <div className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="isMsg"
                id="isMsg"
                checked={formData.isMsg}
                onChange={handleChange}
                className="mt-1 accent-red-600"
              />
              <label htmlFor="isMsg" className="text-xs ">{data.form.consentText}</label>
            </div>
            {
              otpSent&&(
                <input
                type="text"
                name="otp"
                placeholder="OTP"
                className="w-full border px-4 py-3 rounded-md"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              )
            }

            {/* MESSAGES */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
              {successMsg}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Submitting..." : data.form.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;













// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CountryPhoneInput from "./CountryPhoneInput";
// import { submitPartnerForm, clearPartnerState } from "../../redux/slices/partnerSlice";

// const LOOKING_FOR_OPTIONS = [
//   "Visa Services",
//   "Partnership",
//   "Support",
//   "Others",
// ];

// const CITY_OPTIONS = [
//   "Delhi",
//   "Mumbai",
//   "Bangalore",
//   "Chennai",
//   "Other",
// ];

// const HeroSection = ({ data }) => {
//   const dispatch = useDispatch();
//   const { loading, error, success } = useSelector((state) => state.partner);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: null,
//     lookingFor: "",
//     city: "",
//     isMsg: false,
//   });

//   // Clear success/error messages when component unmounts
//   useEffect(() => {
//     return () => {
//       dispatch(clearPartnerState());
//     };
//   }, [dispatch]);

//   const handlePhoneChange = (payload) => {
//     setFormData(prev => ({
//       ...prev,
//       phone: payload
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Clear previous errors
//     dispatch(clearPartnerState());

//     const payload = {
//       fullName: formData.fullName,
//       email: formData.email,
//       phone: formData.phone?.fullNumber || "",
//       lookingFor: formData.lookingFor,
//       city: formData.city,
//       isMsg: formData.isMsg,
//     };

//     // Dispatch the async thunk
//     const result = await dispatch(submitPartnerForm(payload));

//     // If successful, reset the form
//     if (submitPartnerForm.fulfilled.match(result)) {
//       setFormData({
//         fullName: "",
//         email: "",
//         phone: null,
//         lookingFor: "",
//         city: "",
//         isMsg: false,
//       });
//     }
//   };

//   return (
//     <section
//       className="relative min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url(${data.backgroundImage})` }}
//     >
//       <div className="absolute inset-0 bg-white/80" />

//       <div className="relative max-w-6xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16 items-center">

//         {/* LEFT */}
//         <div>
//           <h1 className="text-4xl  font-bold mb-8">
//             {data.title} <span className="text-[#FF1033]">{data.highlight}</span>
//           </h1>

//           <ul className="space-y-4">
//             {data.points.map((p, i) => (
//               <li key={i} className="text-lg">• {p}</li>
//             ))}
//           </ul>
//         </div>

//         {/* FORM */}
//         <div className="bg-white  xl max-w-md ml-auto rounded-lg p-8">
//           <form className="space-y-6" onSubmit={handleSubmit}>

//             <input
//               type="text"
//               name="fullName"
//               placeholder="Name"
//               className="w-full border px-4 py-3 rounded-md"
//               onChange={handleChange}
//               value={formData.fullName}
//               required
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               className="w-full border px-4 py-3 rounded-md"
//               onChange={handleChange}
//               value={formData.email}
//               required
//             />

//             {/* PHONE */}
//             <CountryPhoneInput onChange={handlePhoneChange} />

//             {/* LOOKING FOR */}
//             <select
//               name="lookingFor"
//               className="w-full border px-4 py-3 rounded-md"
//               onChange={handleChange}
//               value={formData.lookingFor}
//             >
//               <option value="">What are you looking for?</option>
//               {LOOKING_FOR_OPTIONS.map((opt) => (
//                 <option key={opt} value={opt}>{opt}</option>
//               ))}
//             </select>

//             {/* CITY */}
//             <select
//               name="city"
//               className="w-full border px-4 py-3 rounded-md"
//               onChange={handleChange}
//               value={formData.city}
//             >
//               <option value="">Location (City)</option>
//               {CITY_OPTIONS.map((city) => (
//                 <option key={city} value={city}>{city}</option>
//               ))}
//             </select>

//             {/* CONSENT */}
//             <div className="flex items-start gap-3 text-sm">
//               <input
//                 type="checkbox"
//                 name="isMsg"
//                 className="mt-1 accent-red-600"
//                 onChange={handleChange}
//                 checked={formData.isMsg}
//               />
//               <p>{data.form.consentText}</p>
//             </div>

//             {/* Success Message */}
//             {success && (
//               <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
//                 Thank you! Your partner application has been submitted successfully. We'll get back to you soon.
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className={`bg-[#FF1033] text-white px-6 py-3 rounded-md w-full ${
//                 loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#511313]'
//               } transition-colors`}
//             >
//               {loading ? 'Submitting...' : data.form.buttonText}
//             </button>

//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
