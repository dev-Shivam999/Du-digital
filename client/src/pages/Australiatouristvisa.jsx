import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Clock, Calendar, CreditCard, Globe, FileText, Hourglass, IdCard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

// Static visa types data (used if not in API)
const STATIC_VISA_TYPES = {
  processingTime: "25 to 30 working days",
  validity: "Depends on Embassy",
  entryType: "Single or Multiple (Embassy Decision)",
  charges: "Approx. ₹8,500/- (AUD 197 Visa Fee) + ₹3,000 Service Fee"
};

const Australiatouristvisa = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/australia-tourist-visa`);
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
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {

      if (otpSent) {
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/australia-tourist-visa`, {
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
          body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number ||formValues.Phone|| '' }),
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

  if (loading) return <LoadingState message="Loading Australia Tourist Visa..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { description, fields = [], faqs = [], documents = [], contentSections = {}, pricingPlans = [] } = formData || {};

  // Get sections by API keys
  const additionalDocsSection = contentSections['Additional Documents for Your Australia Tourist Visa (As Applicable)'] || [];
  const howToApplySection = contentSections['How to Apply for Australia Tourist Visa'] || [];
  const whyChooseSection = contentSections['Why Choose DU GLOBAL for Australia Visa'] || [];

  // Visa types data - use API data if available, otherwise static
  const visaTypesData = pricingPlans.length > 0 ? pricingPlans[0] : STATIC_VISA_TYPES;

  // Icons for How to Apply section
  const howToApplyIcons = [Hourglass, FileText, IdCard];

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full lg:h-[800px] min-h-[800px] overflow-hidden">
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/10" />

        {/* Dark overlay with red gradient on right */}
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.65)_40%,rgba(227,30,36,0.55)_100%)]"
        // style={{
        //   background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 60%, rgba(179,29,29,0.6) 100%)'
        // }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full">
            {/* Left - Hero Text */}
            <div className="text-white">
              {/* <p className="text-xl mb-2">Apply for</p> */}
              <h1 className="text-4xl  lg:text-5xl  font-bold text-black leading-tight mb-6">
                Apply for Australia Tourist Visa
                {/* Apply for <span style={{ color: '#FF1033' }}>Australia Tourist Visa</span> */}
              </h1>
              {/* <p className="text-gray-300 text-lg">
                {description}
              </p> */}
            </div>

            {/* Right - Contact Form with dark transparent bg */}
            {fields.length > 0 && (
              <div
                className="rounded-xl p-3 max-w-md"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                <form className="space-y-4 border border-white p-3 rounded-xl" onSubmit={handleSubmit}>
                  {/* Dynamically render all fields */}
                  {(() => {
                    // Separate fields by type
                    const textFields = fields.filter(f => ['text', 'email', 'number'].includes(f.type));
                    const dateFields = fields.filter(f => f.type === 'date');
                    const selectFields = fields.filter(f => f.type === 'select' || f.type === 'dropdown');
                    const checkboxFields = fields.filter(f => f.type === 'checkbox');
                    const textarea = fields.filter(f => f.type === "textarea");
                    const radio = fields.filter(f => f.type === 'radio');

                    // Group text fields in pairs for 2-column layout
                    const textFieldPairs = [];
                    for (let i = 0; i < textFields.length; i += 2) {
                      textFieldPairs.push(textFields.slice(i, i + 2));
                    }

                    return (
                      <>
                        {/* Text/Email/Number fields in 2-column pairs */}
                        {textFieldPairs.map((pair, pairIndex) => (
                          <div key={pairIndex} className={`grid gap-4 ${pair.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {pair.map((field, index) => (
                              <input
                                key={field._id || `text-${pairIndex}-${index}`}
                                type={field.type === 'number' ? 'tel' : field.type}
                                name={field.name}
                                value={formValues[field.name] || ''}
                                onChange={handleInputChange}
                                placeholder={field.placeholder || field.label}
                                aria-label={field.label || field.placeholder}
                                className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                                required={field.required}
                              />
                            ))}
                          </div>
                        ))}

                        {/* Select/Dropdown fields */}
                        {selectFields.length > 0 && (
                          <div className={`grid gap-4 ${selectFields.length >= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {selectFields.map((field, index) => (
                              <select
                                key={field._id || `select-${index}`}
                                name={field.name}
                                value={formValues[field.name] || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                                required={field.required}
                                aria-label={field.label || field.placeholder}
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: 'right 0.5rem center',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: '1.25em 1.25em',
                                  paddingRight: '2rem'
                                }}
                              >
                                <option value="">{field.placeholder || field.label}</option>
                                {field.options?.map((opt, optIdx) => (
                                  <option key={opt._id || optIdx} value={opt.value || opt}>
                                    {opt.label || opt}
                                  </option>
                                ))}
                              </select>
                            ))}
                          </div>
                        )}

                        {/* Date fields */}
                        {dateFields.map((field, index) => (
                          <input
                            key={field._id || `date-${index}`}
                            type="date"
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            aria-label={field.label || field.placeholder}
                            className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                            required={field.required}
                          />
                        ))}
                        {/* Textarea fields */}
                        {textarea.map((field, index) => (
                          <div key={index}>
                            {field.label && (
                              <label className="text-white text-sm font-medium block mb-2">
                                {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                              </label>
                            )}
                            <textarea
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              aria-label={field.label || field.placeholder}
                              className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm min-h-[100px]"
                              required={field.required}
                            />
                          </div>
                        ))}

                        {/* Checkbox fields */}
                        {checkboxFields.map((field, index) => (
                          <label key={field._id || `checkbox-${index}`} className="flex items-start gap-4 text-white text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formValues[field.name] || false}
                              onChange={handleInputChange}
                              className="mt-1 w-4 h-4 accent-red-600 rounded flex-shrink-0"
                            />
                            <span className="text-gray-300">{field.label}</span>
                          </label>
                        ))}
                        {/* Radio fields */}
                        {radio.map((field, index) => (
                          <div key={index} className="space-y-4">
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
                        ))}
                      </>
                    );
                  })()}
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
                    <div className={`flex items-center gap-4 p-3 rounded ${submitStatus === 'success' ? 'bg-green-500/20' : 'bg-[#FF1033]/20'}`}>
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

      {/* ===== VISA TYPES, PROCESSING TIME, AND FEES ===== */}
      <section className="py-20">
        <h2 className="text-4xl md:text-4xl  font-bold text-center text-[#333333] mb-10">
          Types of Australia Tourist Visas,<br />Processing Time, and Fees
        </h2>
        <div className=" w-16 h-[3px] mx-auto mb-8 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid lg:grid-cols-[40%_60%] rounded-3xl overflow-hidden bg-[#C62828]">

            {/* LEFT IMAGE */}
            <div className="h-full">
              <img
                src="/imageinau.jpg"
                alt="Australia Visa Application"
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="p-4 md:p-6 text-white">

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-8">
                Tourist Visa
              </h3>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Processing Time */}
                <div className="border border-white rounded-2xl p-6 flex flex-col items-center">
                  <Clock className="w-10 h-10 mb-4" />
                  <h4 className="font-semibold mb-1">Processing Time</h4>
                  <p className="font-normal text-base">
                    {visaTypesData.processingTime || STATIC_VISA_TYPES.processingTime}
                  </p>
                </div>

                {/* Validity */}
                <div className="border border-white rounded-2xl p-6 flex flex-col items-center">
                  <Calendar className="w-10 h-10 mb-4" />
                  <h4 className="font-semibold mb-1">Validity</h4>
                  <p className="font-normal text-base">
                    {visaTypesData.validity || STATIC_VISA_TYPES.validity}
                  </p>
                </div>

                {/* Entry Type */}
                <div className="border border-white rounded-2xl p-6  flex flex-col items-center">
                  <Globe className="w-10 h-10 mb-4" />
                  <h4 className="font-semibold mb-1">Entry Type</h4>
                  <p className="font-normal text-base">
                    {visaTypesData.entryType || STATIC_VISA_TYPES.entryType}
                  </p>
                </div>

                {/* Charges */}
                <div className="border border-white rounded-2xl p-6 flex flex-col items-center">
                  <CreditCard className="w-10 h-10 mb-4" />
                  <h4 className="font-semibold mb-1">Charges</h4>
                  <p className="font-normal text-base">
                    {visaTypesData.charges || STATIC_VISA_TYPES.charges}
                  </p>
                </div>
              </div>

              {/* Note */}
              <p className="text-white font-normal text-base mt-8 italic text-center">
                <span className="font-bold">Note:</span> The type of entry (single or multiple) and visa validity are determined solely by the embassy and are not guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>




      {/* ===== DOCUMENTS REQUIRED SECTION ===== */}
      {documents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">

            {/* Heading */}
            <div className="text-center mb-14">
              <h2 className="text-4xl   font-bold text-[#333333] mb-4">
                Documents required for Australia Tourist Visa
              </h2>
              <div className="w-20 h-[3px] mx-auto"></div>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-2 gap-x-20 gap-y-6 max-w-6xl mx-auto">

              {documents.map((doc) =>
                doc.description
                  ?.split("\n")
                  .filter(item => item.trim())
                  .map((item, index) => (
                    <div key={index} className="flex items-start gap-4">

                      {/* Check Icon */}
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF1033] flex items-center justify-center mt-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>

                      {/* Text */}
                      <p className="text-base font-medium text-[#333333] leading-relaxed">
                        {item.trim()}
                      </p>
                    </div>
                  ))
              )}

            </div>
          </div>
        </section>
      )}


      {/* ===== ADDITIONAL DOCUMENTS SECTION ===== */}
      {additionalDocsSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl  font-bold text-[#333333] mb-2">
                Additional Documents for Your Australia Tourist Visa (As Applicable)
              </h2>
              {/* <p className="text-[#333333] mb-3">(As Applicable)</p> */}
              {/* <div className="w-20 h-1 mx-auto" ></div> */}
            </div>
            <p className="text-[#333333] mb-3 text-center text-base md:px-12">To ensure a smooth application process for your <span className="font-bold">Australia Tourist Visa</span>, you may need to provide additional documents based on your specific circumstances. Here’s a quick guide:</p>

            {/* 2-column grid of numbered cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {additionalDocsSection.map((item, index) => (
                <div
                  key={item._id || index}
                  className="relative bg-white rounded-2xl p-8 border border-gray-200 overflow-hidden"
                >
                  {/* Large number */}
                  <span className="text-4xl font-bold mb-4 block" style={{ color: '#C62625' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>

                  {/* Content as list */}
                  <ul className="space-y-4">
                    {item.contentHtml?.trim().split('\r\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-gray-600">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{line.trim()}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pink triangular accent in bottom-right */}
                  <div
                    className="absolute bottom-0 right-0 w-20 h-20"
                    style={{
                      background: 'linear-gradient(135deg, transparent 50%, rgba(198,38,37,0.15) 50%)'
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="max-w-6xl mx-auto mt-16 px-6">
              <h3 className="text-xl font-semibold italic text-gray-900 mb-4">
                Important Notes
              </h3>

              <ol className="list-decimal pl-6 space-y-4 text-gray-700 text-base leading-relaxed">
                <li>
                  Additional documents may be requested by the embassy depending on individual circumstances.
                </li>
                <li>
                  Ensure that all financial documents, such as bank statements, are recent and meet the Embassy’s
                  requirements for authenticity (e.g., sealed and stamped).
                </li>
              </ol>
            </div>

          </div>
        </section>
      )}

      {/* ===== HOW TO APPLY SECTION ===== */}
      {howToApplySection.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#383838' }}>
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl  font-bold text-white mb-3">
                How to Apply for Australia Tourist Visa
              </h2>
              <p className="text-white mt-2">A Simple 3-Step Process to Get Your Australia Tourist Visa</p>
              {/* <div className="w-20 h-1 mx-auto" ></div> */}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howToApplySection.map((item, index) => {
                const IconComponent = howToApplyIcons[index % howToApplyIcons.length];
                return (
                  <div key={item._id || index} className="relative bg-white rounded-xl p-6 text-center">
                    {/* Faded number in background */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-[#EAB1B0]">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mr-auto mb-4"
                      style={{ backgroundColor: '#FF1033' }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#333333] mb-2 text-left">{item.title}</h3>
                    <p className="text-[#333333]  text-left text-base">{item.contentHtml?.trim()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE DU GLOBAL SECTION ===== */}
      {whyChooseSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl  font-bold text-[#333333] mb-3">
                Why Choose DU GLOBAL for Australia Visa
              </h2>
              {/* <div className="w-20 h-1 mx-auto" ></div> */}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {whyChooseSection.map((item, index) => (
                <div
                  key={item._id || index}
                  className="relative rounded-2xl overflow-hidden h-[220px] flex flex-col justify-center group cursor-pointer"
                >
                  {/* Background Image */}
                  {item?.images?.[0] ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${getImageUrl(item.images[0])})`, backgroundSize: 'cover', backgroundPosition: 'bottom' }}
                    />
                  ) : item?.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : null}

                  {/* Default Dark Overlay */}
                  <div className="absolute inset-0 bg-[#0a0909c3] transition-opacity duration-500 group-hover:opacity-0" />

                  {/* Red Hover Overlay */}
                  <div className="absolute inset-0 bg-[#FF1033]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-2">
                      {item.title?.trim()}
                    </h3>
                    <p className="text-white text-sm lg:text-base leading-relaxed">
                      {item.contentHtml?.trim()}
                    </p>
                  </div>
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
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-answer-${index}`}
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

export default Australiatouristvisa;
