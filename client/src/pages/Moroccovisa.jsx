import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Globe, Users, Shield, Clock, Award, Building, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import WhyUsSection from "../components/reusable/WhyUsSection";
import homeData from "../data/homeData.json";
import SEO from "../components/reusable/SEO";
const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Moroccovisa = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('');

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/morocco-visa`);
      if (!response.ok) throw new Error("Failed to fetch form data");
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/api/')) {
      return `${BackendURL}${imagePath}`;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${BackendURL}/api${imagePath}`;
    }
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For number input, prevent non-numeric characters
    if (type === 'tel' || type === 'number') {
      const isNumeric = /^\d*$/.test(value);
      if (!isNumeric) return;
    }

    setFormValues(prev => {
      const newValues = { ...prev, [name]: type === 'checkbox' ? checked : value };

      // Reset state if country changes
      if (name === 'country') {
        newValues['state'] = '';
      }

      return newValues;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {

      if (otpSent) {
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/morocco-visa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formValues, otp }),
        });
        const res = await response.json();
        if (res.ok) {
          setSubmitStatus('success');
          setSubmitMessage('Thank you! Your  application has been submitted successfully. Our team will contact you shortly.');
          // Reset form
          // const resetValues = {};
          // formData?.fields?.forEach(field => { resetValues[field.name] = ''; });
          // setFormValues(resetValues);
        } else {

          setSubmitStatus('error');
          setSubmitMessage(res.message || 'Something went wrong. Please try again.');
        }
      } else {

        const data = await fetch(`${BackendURL}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number || formValues.Phone|| '' }),
        });

        const res =await data.json()
        if (res.success) {
          setSubmitMessage('Thank you! submit the 6 digit otp');
          setSubmitStatus('success');
          alert('submit the 6 digit otp');
          setOtpSent(true);
        } else {
          setSubmitMessage('Invaild Number');

          setSubmitStatus('error');
        }

      }

    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit. Please check your connection and try again.');
    } finally {
      setSubmitLoading(false);
      setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
    }
  };

  if (loading) return <LoadingState message="Loading Morocco Visa..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { description, fields = [], faqs = [], documents = [], contentSections = {} } = formData || {};

  // Get sections by API keys
  const introSection = contentSections['Morocco Visa for Indians'] || [];
  const visaTypesSection = contentSections['Morocco Visa Types, Fees, and Processing Time for Indian Citizens'] || [];

  // Why DU GLOBAL features (static data)
  const whyChooseFeatures = [
    { icon: Award, title: "Quality and Value", desc: "Premium service at competitive pricing" },
    { icon: Users, title: "Experienced Professionals", desc: "Expert team with years of visa expertise" },
    { icon: Shield, title: "Services", desc: "Comprehensive visa and travel solutions" },
    { icon: Clock, title: "Technology", desc: "Modern tech for faster processing" },
    { icon: Globe, title: "Extensive Reach", desc: "35+ countries, 1300+ offices worldwide" },
    { icon: Building, title: "Security", desc: "Your data is protected and secure" }
  ];

  return (
    <div className="bg-white  ">
   <SEO />
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full lg:h-[800px] min-h-[800px] overflow-hidden">
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Morocco Visa"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full place-items-center">
            {/* Left - Hero Text */}
            <div className="text-white">
              <p className="text-4xl    font-bold mb-2">Apply For</p>
              <h1 className="text-4xl  lg:text-5xl  font-bold leading-tight mb-6">
                Morocco Visa
              </h1>
              {/* <p className="text-gray-300 text-lg">
                {description}
              </p> */}
            </div>

            {/* Right - Contact Form with dark transparent bg */}
            {fields.length > 0 && (
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                <form className="flex flex-col w-full items-center gap-4" onSubmit={handleSubmit}>
                  {[...fields].sort((a, b) => (a.order || 0) - (b.order || 0)).map((field, index) => {
                    const fieldType = field.type || field.fieldType;

                    if (fieldType === 'select' || fieldType === 'dropdown') {
                      let options = field.options || [];

                      // If this is the state field, filter based on selected country
                      if (field.name === 'state') {
                        const selectedCountry = formValues['country']; // Assuming 'country' is the name of the country field
                        if (!selectedCountry) {
                          return null; // Don't show state if no country selected
                        }

                        options = options.filter(opt =>
                          opt.connectId && opt.connectId.toLowerCase() === selectedCountry.toLowerCase()
                        );

                        if (options.length === 0) {
                          return null; // Don't show state if no states for this country
                        }
                      }

                      return (
                        <select
                          key={field._id || index}
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none appearance-none cursor-pointer text-sm"
                          required={field.required}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.25em 1.25em',
                            paddingRight: '2rem'
                          }}
                        >
                          <option value="">{field.placeholder || field.label}</option>
                          {options.map((opt, optIdx) => (
                            <option key={opt._id || optIdx} value={opt.value || opt}>
                              {opt.label || opt}
                            </option>
                          ))}
                        </select>
                      );
                    } else if (fieldType === 'textarea') {
                      return (
                        <textarea
                          key={field._id || index}
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          className="flex-1 w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                          required={field.required}
                        />
                      );
                    } else if (fieldType == "redio") {
                      return (
                        <div className="space-y-4">
                          <label className="text-white text-sm font-medium block mb-2">
                            {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                          </label>
                          <div className="flex flex-wrap gap-4">
                            {field.options?.map((opt, i) => (
                              <label key={i} className="flex items-center gap-4 text-white cursor-pointer">
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={opt.value || opt.label || opt}
                                  checked={formValues[field.name] === (opt.value || opt.label || opt)}
                                  onChange={handleInputChange}
                                  className="w-4 h-4"
                                  required={field.required}
                                />
                                <span className="text-sm">{opt.label || opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    } else if (fieldType === "checkbox") {
                      return (
                        <label key={field._id || `checkbox-${index}`} className="flex items-start gap-4 text-gray-600 cursor-pointer mb-4">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={formValues[field.name] || false}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 accent-red-600 rounded flex-shrink-0"
                          />
                          <span className="text-xs leading-relaxed text-white">{field.label}</span>
                        </label>
                      );
                    } else if (fieldType === 'number' || field.name === 'phone') {
                      return (
                        <input
                          key={field._id || index}
                          type="tel"
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                          required={field.required}
                        />
                      );
                    } else {
                      return (
                        <input
                          key={field._id || index}
                          type={fieldType === 'number' ? 'tel' : fieldType}
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                          required={field.required}
                        />
                      );
                    }
                  })}
                  {otpSent && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-[#c60505] focus:ring-1 focus:ring-[#c60505] outline-none text-gray-900 bg-white text-sm"
                      />
                    </div>
                  )}
                  {/* Submit Status Message */}
                  {submitStatus && (
                    <div className={`w-full flex items-center gap-4 p-3 rounded ${submitStatus === 'success' ? 'bg-green-500/20' : 'bg-[#FF1033]/20'}`}>
                      {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      <p className={`text-sm ${submitStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>{submitMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3 rounded-full font-bold text-base transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] uppercase disabled:opacity-70 flex items-center justify-center gap-4"
                  >
                    {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Apply Now'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== MOROCCO VISA FOR INDIANS SECTION ===== */}
      {introSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {introSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-4xl md:text-4xl  font-semibold text-gray-900 mb-2 uppercase">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>

                  <p className="text-[#333333] leading-relaxed text-lg whitespace-pre-line">
                    {item.contentHtml}
                  </p>
                </div>

                {/* Image area with overlapping badge */}
                <div className="relative flex justify-center">
                  {/* Badge overlapping top-left of image */}
                  {
                    item?.badge && (
                      <div className="flex flex-col items-center text-white gap-0 absolute -top-10 -right-10 rounded-lg p-4 flex" style={{
                        backgroundColor: `${item.badge.background || "#FF1033"}`
                      }}>
                        <span>{item.badge.text.split("+")[0]}</span>
                        <div>{item.badge.text.split("+")[1]}</div>
                        {/* <span className="font-semibold">{item.badge.text}</span> */}
                      </div>
                    )
                  }
                  {item?.images?.length > 0 ? (
                    item.images.map(p => <img
                      src={getImageUrl(p)}
                      alt={item.title}
                      className="max-w-full h-auto rounded-xl  "
                      style={{ maxHeight: '500px' }}
                    />)
                  ) : item.image && <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="max-w-full h-auto rounded-xl  "
                    style={{ maxHeight: '500px' }}
                  />}

                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== VISA TYPES, FEES AND PROCESSING TIME ===== */}
      {visaTypesSection.length > 0 && (
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl  font-semibold text-gray-900 mb-3">
                Morocco Visa Types, Fees, and Processing Time for Indian Citizens
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {visaTypesSection.map((item, index) => {
                // Parse the content - labels and values are on alternating lines
                const lines = item.contentHtml?.split('\r\n').filter(line => line.trim()) || [];
                const pairs = [];

                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i].trim();
                  // If line ends with : it's a label, next line is value
                  if (line.endsWith(':')) {
                    const label = line.slice(0, -1); // Remove trailing :
                    const value = lines[i + 1]?.trim() || '';
                    pairs.push({ label, value });
                    i++; // Skip the value line
                  }
                }

                return (
                  <div key={item._id || index} className="bg-white rounded-xl p-6  md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{item.title}</h3>
                    <div className="space-y-4">
                      {pairs.map((pair, idx) => {
                        const isFee = pair.label.toLowerCase().includes('fee');
                        return (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-black">{pair.label}:</span>
                            <span className={`font-semibold ${isFee ? 'text-xl' : ''}`} style={isFee ? { color: '#FF1033' } : {}}>
                              {pair.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY DU GLOBAL SECTION ===== */}
      <WhyUsSection data={homeData.whyUsSection} button={true} buttonLink={"/about-us"} buttonName="About Us" />


      {/* ===== DOCUMENTS REQUIRED SECTION ===== */}
      {documents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl font-bold text-black mb-3">
                Morocco Visa Requirements for Indians
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="space-y-8">
              {documents.map((doc, index) => (
                <div key={doc._id || index}>
                  {/* Document category header */}
                  <h3 className="text-xl font-bold text-[#333333] mb-4">{doc.title}</h3>

                  {/* Document items list */}
                  <ul className="space-y-4">
                    {doc.description?.split('\n').filter(line => line.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: '#FF1033' }}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-[#333333]">{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ SECTION ===== */}
      {faqs.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-4xl  font-bold leading-tight mb-6">
                Any questions? <br />
                We got you.
              </h2>

              <p className="text-gray-500 max-w-md mb-6">
                Yet bed any for assistance indulgence unpleasing. Not thoughts all
                exercise blessing. Indulgence way everything joy alteration
                boisterous the attachment.
              </p>


            </div>

            {/* RIGHT FAQ LIST */}
            <div className="divide-y">
              {faqs.map((faq, index) => (

                <div key={index} className="py-6">
                  <button

                    onClick={() => setOpenFaq(index)}


                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </span>

                    <span className="text-2xl text-gray-500">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>

                  {openFaq === index && (
                    <p className="mt-4 text-gray-500 max-w-xl">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Moroccovisa;
