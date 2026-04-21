import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Globe, Users, Shield, Building, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

// Static images
const STATIC_IMAGES = {
  hero: "https://images.unsplash.com/photo-1538485399081-7191377e8241?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
};

const Southkoreavisaforindians = () => {
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
      const response = await fetch(`${BackendURL}/api/forms/slug/south-korea-visa-for-indians`);
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
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // const response = await fetch(`${BackendURL}/api/form-submissions/slug/south-korea-visa-for-indians`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formValues),
      // });
      if (otpSent) {
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/south-korea-visa-for-indians`, {
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

  if (loading) return <LoadingState message="Loading South Korea Visa..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { name, description, fields = [], faqs = [], documents = [], contentSections = {} } = formData || {};

  // Get sections by API keys
  const visaTypesSection = contentSections['South Korea Visa Types with Fees'] || [];
  const embassySection = contentSections['Designated Travel Agency by the Embassy of the Republic of Korea in India'] || [];
  const ktoSection = contentSections['Designated Travel Agency for the Korea Tourism Organization (KTO)'] || [];
  const additionalReqSection = contentSections['Additional Requirements'] || [];
  const employedSection = contentSections['For Employed People'] || [];
  const howToApplySection = contentSections['How to Apply for your South Korea Visa'] || [];
  const whyChooseSection = [
    ...(contentSections['Why Choose DU GLOBAL?'] || []),
    ...(contentSections['Why Choose DU GLOBAL'] || [])
  ];

  // Parse description
  const descriptionLines = description?.split('\r\n').filter(line => line.trim()) || [];

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative w-full lg:h-[800px] min-h-[800px] overflow-hidden"
      >
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark overlay with red glow */}
        {/* <div
          className="absolute inset-0"
          // style={{
          //   background: 'linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(26,26,26,0.85) 50%, rgba(10,10,10,0.9) 100%)'
          // }}
        /> */}
        {/* Dark teal/blue overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"
        // style={{ background: 'linear-gradient(135deg, rgba(0,30,50,0.85) 0%, rgba(0,50,70,0.75) 100%)' }}
        />
        {/* Red glow effect on right */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse at right center, #FF1033 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full place-items-center">
            {/* Left - Hero Text */}
            <div className="text-white">
              {/* <div className="flex items-center gap-4 mb-4">
                <div className="w-1 h-10" style={{ backgroundColor: '#FF1033' }}></div>
                <p className="text-gray-400 uppercase tracking-wider text-sm">South Korea Visa</p>
              </div> */}
              <h1 className="text-4xl   lg:text-5xl font-bold leading-tight mb-6">
                South Korea Visa For Indians – <span style={{ color: '#FF1033' }}> <br />
                  Apply Now!</span>
              </h1>

              {/* Key points */}
              <ul className="space-y-4 mb-8  p-4 rounded-lg bg-gradient-to-r from-[#FF1033] to-[#FF1033]/10">
                {descriptionLines.slice(1).map((line, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center bg-white shrink-0 mt-0.5"
                    >
                      <Check className="w-3 h-3 text-[#FF1033]" strokeWidth={3} />
                    </div>
                    <span className="text-white">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Contact Form */}
            {fields.length > 0 && (
              <div
                className="rounded-2xl p-8  2xl"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {/* <h3 className="text-2xl font-bold text-white mb-6">Apply Now</h3> */}
                <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.filter(f => f.type !== 'checkbox').map((field, index) => {
                      const fieldType = field.type || field.fieldType;

                      if (fieldType === 'select' || fieldType === 'dropdown') {
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
                            {field.options?.map((opt, optIdx) => (
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
                            className="flex-1 w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm md:col-span-2"
                            required={field.required}
                          />
                        );
                      } else if (fieldType == "redio") {
                        return (
                          <div key={field._id || index} className="space-y-4 md:col-span-2">
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
                        )

                      } else {
                        const isDate = fieldType === 'date' || field.name?.toLowerCase().includes('date') || field.label?.toLowerCase().includes('date');
                        return (
                          <input
                            key={field._id || index}
                            type={fieldType === 'number' ? 'tel' : fieldType}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            className={`w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm ${isDate ? 'md:col-span-2' : ''}`}
                            required={field.required}
                          />
                        );
                      }
                    })}
                  </div>

                  {/* Checkbox fields */}
                  {fields.filter(f => f.type === 'checkbox').map((field, index) => (
                    <label key={field._id || index} className="flex items-start gap-4 text-white text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formValues[field.name] || false}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 accent-red-600 rounded shrink-0"
                      />
                      <span className="text-gray-300">{field.label}</span>
                    </label>
                  ))}
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
                    className="w-full py-3 rounded-full font-bold text-base transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] uppercase mt-2 disabled:opacity-70 flex items-center justify-center gap-4"
                  >
                    {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Apply Now'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== VISA INFO CARD ===== */}
      {visaTypesSection.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl  font-semibold text-[#333333] mb-3">
                South Korea Visa Types with Fees
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            {visaTypesSection.map((item, index) => (
              <div key={item._id || index} className="bg-white rounded-2xl   overflow-hidden max-w-md mx-auto">
                {/* Red header banner */}
                <div
                  className="py-4 px-6 text-center"
                  style={{ backgroundColor: '#FF1033' }}
                >
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>

                {/* Table-style content */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-[#333333]">Processing time:</span>
                    <span className="font-semibold text-gray-900">5 working days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-[#333333]">Stay period:</span>
                    <span className="font-semibold text-gray-900">30 days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-[#333333]">Validity:</span>
                    <span className="font-semibold text-gray-900">90 Days</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-[#333333]">Entry:</span>
                    <span className="font-semibold text-gray-900">Single</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#333333]">Fees:</span>
                    <span className="text-xl font-bold" style={{ color: '#FF1033' }}>INR 6,599/-</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== DESIGNATED TRAVEL AGENCY - EMBASSY ===== */}
      {embassySection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {embassySection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-2">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-[#333333] leading-relaxed text-lg">
                    {item.contentHtml}
                  </p>
                </div>
                <div className="flex justify-center">
                  {item?.images?.length > 0 ? (
                    item.images.map(p => <img
                      src={getImageUrl(p)}
                      alt={item.title}
                      className="max-w-full h-auto rounded-xl  "
                      style={{ maxHeight: '400px' }}
                    />)
                  ) : item.image && <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="max-w-full h-auto rounded-xl  "
                    style={{ maxHeight: '400px' }}
                  />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== DESIGNATED TRAVEL AGENCY - KTO ===== */}
      {ktoSection.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {ktoSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div className="flex justify-center order-2 lg:order-1">
                  {item?.images?.length > 0 ? (
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="max-w-full h-auto rounded-xl  "
                      style={{ minHeight: '400px' }}
                    />
                  ) : item.image && <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="max-w-full h-auto rounded-xl  "
                    style={{ minHeight: '400px' }}
                  />}
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-2">
                    {item.title}
                  </h2>
                  {item?.images?.length > 1 && (
                    <img
                      src={getImageUrl(item.images[1])}
                      alt={item.title}
                      className="max-w-full h-[100px]"
                    // style={{ maxHeight: '400px' }}
                    />)}
                  {/* <div className="w-20 h-1 mb-6" ></div> */}
                  <p className="text-[#333333] leading-relaxed text-lg">
                    {item.contentHtml}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ===== DOCUMENTS REQUIRED ===== */}
      {documents.length > 0 && (
        <section className="py-20 bg-white relative overflow-hidden">

          {/* Watermark */}
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 text-[100px] font-bold opacity-50 pointer-events-none whitespace-nowrap">
            DOCUMENTS
          </div> */}

          <div className="relative z-10 max-w-[1200px] mx-auto px-6">
            {documents.map((doc, index) => {

              // 🔹 PREPARE LIST DATA ONCE (NO DUPLICATES)
              const items = doc.description
                ?.split("\n")
                .map(line => line.trim())
                .filter(Boolean);

              const mid = Math.ceil(items.length / 2);
              const leftItems = items.slice(0, mid);
              const rightItems = items.slice(mid);

              return (
                <div key={doc._id || index}>

                  {/* Heading */}
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#333333] mb-3">
                      {doc.title}
                    </h2>
                    <div className="w-20 h-1 mx-auto" />
                  </div>

                  <p className="text-[#333333] leading-relaxed text-lg text-center mb-12">
                    Below are the requirements for your South Korean Visa.
                  </p>

                  {/* ===== TWO COLUMN LIST ===== */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">

                    {/* LEFT COLUMN */}
                    <ul className="space-y-4">
                      {leftItems.map((item, idx) => {
                        const [title, desc] = item.split(":");
                        return (
                          <li key={idx} className="flex items-start gap-4">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[#FF1033]"
                            >
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>

                            <div className="text-[17px] leading-relaxed">
                              <span className="font-bold text-gray-800">
                                {title}:
                              </span>{" "}
                              <span className="text-gray-700">{desc}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* RIGHT COLUMN */}
                    <ul className="space-y-4">
                      {rightItems.map((item, idx) => {
                        const [title, desc] = item.split(":");
                        return (
                          <li key={idx} className="flex items-start gap-4">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[#FF1033]"
                            >
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>

                            <div className="text-[17px] leading-relaxed">
                              <span className="font-bold text-gray-800">
                                {title}:
                              </span>{" "}
                              <span className="text-gray-700">{desc}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* ===== ADDITIONAL REQUIREMENTS ===== */}
      {(additionalReqSection.length > 0 || employedSection.length > 0) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Additional Requirements
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* For Employed People */}
              {additionalReqSection.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white rounded-xl p-6  md relative overflow-hidden border border-gray-100"
                >
                  {/* Large number */}
                  <div
                    className="text-4xl font-bold mb-4"
                    style={{ color: '#FF1033' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <ul className="space-y-4">
                    {item.contentHtml?.split('\r\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} className="flex list-disc items-start gap-4 text-gray-600 text-sm">

                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Red triangle accent */}
                  {/* <div
                    className="absolute bottom-0 right-0 w-16 h-16"
                    style={{
                      background: 'linear-gradient(135deg, transparent 50%, rgba(227,30,36,0.2) 50%)'
                    }}
                  /> */}
                </div>
              ))}

              {/* For Self-Employed */}
              {employedSection.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white rounded-xl p-6  md relative overflow-hidden border border-gray-100"
                >
                  <div
                    className="text-4xl font-bold mb-4"
                    style={{ color: '#FF1033' }}
                  >
                    {String(additionalReqSection.length + index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <ul className="space-y-4">
                    {item.contentHtml?.split('\r\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} className="flex list-disc items-start gap-4 text-gray-600 text-sm">
                        {/* <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: '#FF1033' }}
                        >
                        </div> */}
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="absolute bottom-0 right-0 w-16 h-16"
                    style={{
                      background: 'linear-gradient(135deg, transparent 50%, rgba(227,30,36,0.2) 50%)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== HOW TO APPLY ===== */}
      {howToApplySection.length > 0 && (
        <section className="py-20 relative overflow-hidden bg-[#3a3a3c]" >


          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                How to Apply for your South Korea Visa
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {howToApplySection.map((item, index) => (
                <div
                  key={item._id || index}
                  className=" backdrop-blur-sm rounded-xl p-6 relative overflow-hidden border bg-white border-white/10"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#FF1033' }}
                  >
                    {index === 0 ? <Building className="w-6 h-6 text-white" /> : <Check className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-md">
                    {item.contentHtml?.replace(/\r?\n/g, ' ').trim()}
                  </p>
                  {/* Large faded number */}
                  <div
                    className="absolute bottom-2 right-4 text-6xl font-bold pointer-events-none"
                    style={{ color: 'rgba(227,30,36,0.15)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE DU GLOBAL ===== */}
      {whyChooseSection.length > 0 && (
        <section className="py-20  relative overflow-hidden">
          {/* SOUTH KOREA watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/5 text-[120px] font-bold pointer-events-none whitespace-nowrap">
            SOUTH KOREA
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-20">
            {/* Section Header */}
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-4xl font-bold mb-3">
                Why Choose DU GLOBAL?
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
              We offer expert help and guidance to people throughout their visa journey. And that's the reason why many choose us for their visa application. And this is why people choose us.
            </p>

            {/* Feature Cards with Background Images - Dynamic from API */}
            <div className="grid md:grid-cols-3 gap-4">
              {whyChooseSection.map((item, index) => {
                // Get image from images array or single image field
                const bgImage = item.images?.[0]
                  ? getImageUrl(item.images[0])
                  : item.image
                    ? getImageUrl(item.image)
                    : 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={item._id || index}
                    className="relative rounded-xl hover:bg-[rgba(227,30,37,0.48)] overflow-hidden min-h-[280px] group"
                    style={{
                      backgroundImage: `url('${bgImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>
                    {/* Red top accent */}
                    {/* <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#FF1033' }}></div> */}
                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title?.trim()}</h3>
                      <p className="text-gray-300 text-sm">
                        {item.contentHtml?.replace(/\r?\n/g, ' ').trim()}
                      </p>
                    </div>
                  </div>
                );
              })}
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

export default Southkoreavisaforindians;