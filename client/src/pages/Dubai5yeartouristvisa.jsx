import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Star, Shield, Clock, Users, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

import WhyUsSection from "../components/reusable/WhyUsSection";
import homeData from "../data/homeData.json";
const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

// Static images for sections
const STATIC_IMAGES = {
  hero: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  explore: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

const Dubai5yeartouristvisa = () => {
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
      const response = await fetch(`${BackendURL}/api/forms/slug/dubai-5year-tourist-visa`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {


      if (otpSent) {
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/dubai-5year-tourist-visa`, {
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
          body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number ||  formValues.Phone|| '' }),
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

  if (loading) return <LoadingState message="Loading Dubai 5-Year Tourist Visa..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { name, description, fields = [], faqs = [], documents = [], contentSections = {} } = formData || {};

  // Get sections by API keys
  const exploreSection = contentSections['Explore UAE with a 5-year Tourist Visa'] || [];
  const feesSection = contentSections['5-year UAE Tourist Visa for Indians: Fees and Processing Time'] || [];

  // Parse description for hero text
  const descriptionLines = description?.split('\r\n').filter(line => line.trim()) || [];

  // Why Choose features
  const whyChooseFeatures = [
    { icon: Shield, title: "Quality and Value", desc: "Premium service at competitive pricing" },
    { icon: Clock, title: "Fast Processing", desc: "Quick turnaround for your visa application" },
    { icon: Users, title: "Expert Support", desc: "24/7 dedicated customer assistance" },
    { icon: Globe, title: "Trusted Partner", desc: "17 Lac+ happy customers worldwide" }
  ];

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full lg:h-[800px] min-h-[800px] ">
        <img
          src={getImageUrl(formData?.image) || STATIC_IMAGES.hero}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark teal/blue overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"
        // style={{ background: 'linear-gradient(135deg, rgba(0,30,50,0.85) 0%, rgba(0,50,70,0.75) 100%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-24 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full">
            {/* Left - Hero Text */}
            <div className="text-white">
              <p className="text-3xl md:text-4xl  font-bold mb-2">Apply For</p>
              <h1 className="text-4xl   lg:text-5xl font-bold leading-tight mb-6">
                <span style={{ color: '#FF1033' }}>UAE/Dubai Tourist Visa</span>
              </h1>

              {/* Key points */}
              <ul className="space-y-4 mb-8 p-4 rounded-lg bg-gradient-to-r from-[#FF1033] to-[#FF1033]/10">
                {descriptionLines.slice(2).map((line, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center bg-white shrink-0 mt-0.5"
                    >
                      <Check className="w-3 h-3 text-[#FF1033]" strokeWidth={3} />
                    </div>
                    <span className="text-gray-200">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Contact Form */}
            {fields.length > 0 && (
              <div
                className="rounded-2xl p-8 mx-12  2xl backdrop-blur-md z-10 "
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              >
                {/* <h3 className="text-2xl font-bold text-white mb-6">Apply Now</h3> */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {fields
                    .filter(f => f.type !== 'checkbox' && f.type !== 'radio')
                    .sort((a, b) => {
                      const order = ['name', 'email', 'phone', 'number', 'mobile', 'city', 'travel date', 'travel_date', 'date', 'interested', 'visa type'];
                      const getIndex = (field) => {
                        const label = (field.label || field.name || '').toLowerCase();
                        const index = order.findIndex(key => label.includes(key));
                        return index === -1 ? 999 : index;
                      };
                      return getIndex(a) - getIndex(b);
                    })
                    .map((field, index) => {
                      const fieldType = field.type || field.fieldType;

                      if (fieldType === 'select' || fieldType === 'dropdown') {
                        return (
                          <select
                            key={field._id || index}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none appearance-none cursor-pointer"
                            required={field.required}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.75rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '2.5rem'
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
                      } else {
                        return (
                          <input
                            key={field._id || index}
                            type={fieldType === 'number' ? 'tel' : fieldType}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            className="w-full px-4 py-3 bg-white border-0 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                            required={field.required}
                          />
                        );
                      }
                    })}
                  {
                    fields.filter(f => f.type == "textarea").map((field, index) =>
                      <>
                        {field.label && (
                          <label className={`${labelClass} block mb-2`}>
                            {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                          </label>
                        )}
                        <textarea
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          className={`${baseInputClass} min-h-[100px]`}
                          required={field.required}
                        />
                      </>
                    )
                  }
                  <p className="text-white text-sm mb-2">Applicants need to provide a valid 6-months bank statement with a minimum balance of approx. INR 3,50,000 (equivalent to USD 4,000)</p>

                  {/* Radio buttons */}
                  {fields.filter(f => f.type === 'radio').map((field, index) => (
                    <div key={field._id || index} className="space-y-4">
                      <p className="text-white text-sm mb-2">{field.label}</p>
                      <div className="flex gap-4">
                        {field.options?.map((opt, optIdx) => (
                          <label key={opt._id || optIdx} className="flex items-center gap-4 text-white text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={field.name}
                              value={opt.value}
                              onChange={handleInputChange}
                              className="w-4 h-4 accent-red-600"
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Checkbox */}
                  {fields.filter(f => f.type === 'checkbox').map((field, index) => (
                    <label key={field._id || index} className="flex items-start gap-4 text-gray-300 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formValues[field.name] || false}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 accent-red-600 rounded"
                      />
                      <span>{field.label}</span>
                    </label>
                  ))}

                  {/* Submit Status Message */}
                  {submitStatus && (
                    <div className={`flex items-center gap-4 p-3 rounded ${submitStatus === 'success' ? 'bg-green-500/20' : 'bg-[#FF1033]/20'}`}>
                      {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      <p className={`text-sm ${submitStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>{submitMessage}</p>
                    </div>
                  )}
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

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] disabled:opacity-70 flex items-center justify-center gap-4"
                  >
                    {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Get Started'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== FEES AND PROCESSING TIME SECTION ===== */}
      {feesSection.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                5-year UAE Tourist Visa for Indians: <br /> Fees and Processing Time
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            {feesSection.map((item, index) => {
              // Parse contentHtml for dynamic key-value pairs
              const lines = item.contentHtml?.split(/[\r\n]+/).filter(line => line.trim()) || [];
              const pairs = [];

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.endsWith(':')) {
                  const label = line; // Keep the colon if desired, or slice(0, -1) to remove
                  const value = lines[i + 1]?.trim() || '';
                  pairs.push({ label, value });
                  i++; // Skip the value line
                }
              }

              return (
                <div key={item._id || index} className="bg-white rounded-2xl   p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-left">{item.title}</h3>

                  {/* Visa details dynamic list */}
                  <div className="space-y-4 mb-8">
                    {pairs.map((pair, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-600 text-lg">{pair.label}</span>
                        <span className="text-lg font-medium text-gray-900">{pair.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <a
                      href="https://wa.me/9711018888"
                      target="_blank"
                      className="px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]  md"
                    >
                      Enquire Now
                    </a>
                  </div>

                  <p className="text-gray-500 text-sm mt-6 text-left">*T&C Apply</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== EXPLORE UAE SECTION ===== */}
      {exploreSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {exploreSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    {item.contentHtml}
                  </p>

                  {/* Trust badge */}

                </div>
                <div className="flex justify-center relative">
                  {item?.images.length > 0 ? (
                    item?.images.map((image, index) => (
                      <img
                        key={index}
                        src={getImageUrl(image)}
                        alt={item.title}
                        className="max-w-full h-auto rounded-2xl  xl"
                      // style={{ maxHeight: '450px' }}
                      />
                    ))
                  ) : (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="max-w-full h-auto rounded-2xl  xl"
                      style={{ maxHeight: '450px' }}
                    />
                  )}
                  {
                    item?.badge && (
                      <div className="flex flex-col items-center text-white gap-0 absolute -top-10 -right-10 rounded-lg p-4" style={{
                        backgroundColor: `${item.badge.background || "#FF1033"}`
                      }}>
                        <span>{item.badge.text.split("+")[0]}</span>
                        <div>{item.badge.text.split("+")[1]}</div>
                        {/* <span className="font-semibold">{item.badge.text}</span> */}
                      </div>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== ELIGIBILITY AND DOCUMENTS SECTION ===== */}
      {documents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {documents.map((doc, index) => (
              <div key={doc._id || index}>
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {doc.title}
                  </h2>
                  <div className="w-20 h-1 mx-auto" ></div>
                </div>

                <div className="max-w-5xl mx-auto">
                  <ul className="space-y-4">
                    {doc.description?.split('\n').filter(line => line.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: '#FF1033' }}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-gray-900 font-semibold">{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
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

      {/* ===== WHY CHOOSE US SECTION ===== */}

      <WhyUsSection data={homeData.whyUsSection} />
    </div>
  );
};

export default Dubai5yeartouristvisa;
